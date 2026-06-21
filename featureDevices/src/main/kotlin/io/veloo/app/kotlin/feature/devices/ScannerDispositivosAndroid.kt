package io.veloo.app.feature.devices

import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.LinkProperties
import android.net.Network
import android.net.wifi.WifiManager
import android.util.Log
import androidx.core.content.ContextCompat
import com.stealthcopter.networktools.ARPInfo
import com.stealthcopter.networktools.SubnetDevices
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.Inet4Address
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.MulticastSocket
import java.net.NetworkInterface
import java.net.Socket
import java.net.SocketException
import java.util.Locale
import java.util.concurrent.Semaphore
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.math.max
import kotlin.math.min
import kotlin.coroutines.resume

/**
 * Motor de scan de dispositivos de rede.
 *
 * Fontes de descoberta (em ordem de confiabilidade):
 *  1. SubnetDevices (AndroidNetworkTools) — ping nativo /system/bin/ping, funciona sem root.
 *     Substitui InetAddress.isReachable() que requeria root em Android 10+.
 *  2. ARPInfo.getMacFromIPAddress() — obtém MAC do cache ARP do kernel por host encontrado.
 *     Funciona sem root quando o kernel já tem o host em cache (o SubnetDevices popula isso).
 *  3. mDNS — Bonjour/Avahi, identifica nomes de instância e tipos de serviço.
 *  4. SSDP/UPnP — identifica nomes amigáveis de dispositivos smart home.
 *  5. TCP probe — como complemento para hosts que bloqueiam ICMP mas têm portas abertas.
 *     Limitado por Semaphore(50) para não estourar file descriptors.
 *
 * NBNS (NetBIOS) foi aposentado: retorna praticamente zero resultados em redes modernas
 * (Windows 10+ usa mDNS/LLMNR por padrão; broadcast UDP na porta 137 é bloqueado por
 * roteadores modernos). A slot de progresso que ele ocupava foi redistribuída.
 *
 * Gating de permissão:
 *  - Scan principal (SubnetDevices/ping/TCP/mDNS/SSDP) NÃO requer permissão nenhuma.
 *  - Apenas o Wi-Fi scan (WifiManager) requer NEARBY_WIFI_DEVICES (API 33+) /
 *    ACCESS_FINE_LOCATION — mas esse módulo não faz Wi-Fi scan, então a permissão
 *    era desnecessária aqui. Removida do gating obrigatório.
 *
 * Guarda Wi-Fi: o scan só roda em Wi-Fi (EstadoConexao.wifi). Em rede móvel,
 * emite erro semântico "naoWifi" imediatamente.
 */
class ScannerDispositivosAndroid(
    private val context: Context,
) : ScannerDispositivos {

    private val scanEmAndamento = AtomicBoolean(false)

    private val mutableSnapshotFlow =
        MutableStateFlow(
            SnapshotScanDispositivos(
                estado = EstadoScanDispositivos.idle,
                progressoPercentual = 0,
                dispositivos = emptyList(),
                erroMensagem = null,
            ),
        )

    override val snapshotFlow: StateFlow<SnapshotScanDispositivos> = mutableSnapshotFlow.asStateFlow()

    override suspend fun iniciarScan(profundo: Boolean) {
        withContext(Dispatchers.IO) {
            if (!scanEmAndamento.compareAndSet(false, true)) {
                Log.d("SignallQDevices", "scan ja em andamento, ignorando")
                return@withContext
            }
            try {
                // Guarda Wi-Fi: só escanear em Wi-Fi
                if (!estaEmWifi()) {
                    mutableSnapshotFlow.value =
                        mutableSnapshotFlow.value.copy(
                            estado = EstadoScanDispositivos.erro,
                            progressoPercentual = 0,
                            erroMensagem = "naoWifi",
                        )
                    return@withContext
                }

                atualizarEstado(EstadoScanDispositivos.varrendo, 5, null)
                val dispositivos = linkedMapOf<String, DispositivoRede>()
                val localIp = detectarIpLocal()
                Log.d("SignallQDevices", "ipLocal=$localIp")

                val gatewayIp = detectarGatewayIp()
                Log.d("SignallQDevices", "gateway=$gatewayIp")
                if (!gatewayIp.isNullOrBlank()) {
                    adicionarDispositivo(
                        dispositivos,
                        DispositivoRede(
                            id = "gateway:$gatewayIp",
                            ip = gatewayIp,
                            mac = null,
                            nomeExibicao = "Gateway",
                            fonteNome = "gateway",
                        ),
                    )
                }
                publicar(dispositivos.values.toList(), 10)

                if (profundo) {
                    // 1. Descoberta de hosts via SubnetDevices (ping nativo — funciona sem root)
                    val hostsDescobertos = descobrirViaSubnetDevices()
                    Log.d("SignallQDevices", "subnetDevices: ${hostsDescobertos.size} hosts")
                    hostsDescobertos.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 40)

                    // 2. ARP legado — complementa para redes que ainda preenchem /proc/net/arp
                    val arp = coletarViaArpLegado()
                    Log.d("SignallQDevices", "arp: ${arp.size} dispositivos")
                    arp.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 50)

                    // 3. mDNS — nomes Bonjour/Avahi
                    val mdns = coletarViaMdns()
                    Log.d("SignallQDevices", "mdns: ${mdns.size} dispositivos")
                    mdns.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 65)

                    // 4. SSDP/UPnP — nomes amigáveis de smart home
                    val ssdp = coletarViaSsdp()
                    Log.d("SignallQDevices", "ssdp: ${ssdp.size} dispositivos")
                    ssdp.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 78)

                    // 5. TCP probe — hosts que bloqueiam ICMP mas têm portas abertas
                    val tcpProbe = coletarViaTcpProbe(gatewayIp, localIp)
                    Log.d("SignallQDevices", "tcpProbe: ${tcpProbe.size} dispositivos")
                    tcpProbe.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 90)

                    // NBNS aposentado: retorna ~zero em redes modernas (Windows 10+ usa mDNS/LLMNR).
                } else {
                    // Scan leve: SubnetDevices + ARP legado
                    val hostsDescobertos = descobrirViaSubnetDevices()
                    hostsDescobertos.forEach { adicionarDispositivo(dispositivos, it) }
                    val arp = coletarViaArpLegado()
                    arp.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 65)
                }

                // 6. Enriquecimento: MAC via ARPInfo, OUI lookup, classificação, hostname reverso
                val genericosParaResolver = setOf(
                    "Dispositivo não identificado", "Host ativo",
                    "Serviço mDNS", "Dispositivo SSDP",
                )
                val dispositivosEnriquecidos = dispositivos.values.map { d ->
                    // Tenta obter MAC via ARPInfo para hosts sem MAC (quando não veio do SubnetDevices)
                    val macResolvido: String? = if (d.mac != null) {
                        d.mac
                    } else {
                        val ip = d.ip
                        if (ip != null) {
                            try {
                                val mac: String? = ARPInfo.getMACFromIPAddress(ip)
                                if (!mac.isNullOrBlank() && mac != "00:00:00:00:00:00") mac else null
                            } catch (_: Throwable) { null }
                        } else null
                    }
                    val fabricante = OuiDatabase.lookupFabricante(macResolvido)
                    val tipo = ClassificadorDispositivoRede.classificar(d, fabricante)
                    val hostname = if (d.ip != null && d.fonteNome != "gateway") resolverHostname(d.ip) else null
                    val nomeResolvido = when {
                        d.fonteNome == "gateway" -> d.nomeExibicao
                        hostname != null -> hostname
                        d.nomeExibicao !in genericosParaResolver -> d.nomeExibicao
                        fabricante != null -> fabricante
                        else -> d.ip ?: d.nomeExibicao
                    }
                    d.copy(
                        mac = macResolvido,
                        fabricante = fabricante,
                        tipoDispositivo = tipo,
                        nomeExibicao = nomeResolvido,
                        esteDispositivo = localIp != null && d.ip == localIp,
                    )
                }
                Log.d("SignallQDevices", "scan concluido: ${dispositivosEnriquecidos.size} dispositivos")
                mutableSnapshotFlow.value =
                    mutableSnapshotFlow.value.copy(
                        estado = EstadoScanDispositivos.concluido,
                        progressoPercentual = 100,
                        dispositivos = dispositivosEnriquecidos,
                        erroMensagem = null,
                    )
            } catch (t: Throwable) {
                Log.e("SignallQDevices", "scan falhou", t)
                val erroSemantico = when {
                    t is SecurityException -> "semPermissaoLocalizacao"
                    t is SocketException -> "erroRede"
                    t.message?.contains("timeout", ignoreCase = true) == true -> "timeout"
                    else -> "erroDesconhecido"
                }
                mutableSnapshotFlow.value =
                    mutableSnapshotFlow.value.copy(
                        estado = EstadoScanDispositivos.erro,
                        erroMensagem = erroSemantico,
                    )
            } finally {
                scanEmAndamento.set(false)
            }
        }
    }

    // ── Guarda Wi-Fi ────────────────────────────────────────────────────────────

    @SuppressLint("MissingPermission")
    private fun estaEmWifi(): Boolean {
        return try {
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val network = cm.activeNetwork ?: return false
            val caps = cm.getNetworkCapabilities(network) ?: return false
            caps.hasTransport(android.net.NetworkCapabilities.TRANSPORT_WIFI) ||
                caps.hasTransport(android.net.NetworkCapabilities.TRANSPORT_ETHERNET)
        } catch (_: Throwable) {
            true // se não conseguir verificar, deixa passar
        }
    }

    // ── Descoberta via SubnetDevices (AndroidNetworkTools) ────────────────────

    /**
     * Usa [SubnetDevices.fromLocalAddress] para descobrir hosts via ping nativo.
     * O ping usa /system/bin/ping com fallback TCP — funciona sem root em Android 10+.
     * Subnet é inferida automaticamente pela lib a partir do endereço local.
     *
     * Complementamos o resultado com o prefixo correto de rede via [LinkAddress.getPrefixLength()]
     * para garantir coerência nos cálculos de broadcast/range usados pelo mDNS/SSDP.
     */
    private suspend fun descobrirViaSubnetDevices(): List<DispositivoRede> =
        suspendCancellableCoroutine { cont ->
            val resultados = mutableListOf<DispositivoRede>()
            val scanner = SubnetDevices.fromLocalAddress()
                .setTimeOutMillis(800)
                .findDevices(object : SubnetDevices.OnSubnetDeviceFound {
                    override fun onDeviceFound(device: com.stealthcopter.networktools.subnet.Device?) {
                        val ip = device?.ip ?: return
                        if (!validarIpv4(ip)) return
                        val mac = device.mac?.takeIf { it.isNotBlank() && it != "00:00:00:00:00:00" }
                        val hostname = device.hostname?.takeIf { it.isNotBlank() && it != ip }
                        resultados.add(
                            DispositivoRede(
                                id = if (mac != null) "subnet:$mac" else "subnet:$ip",
                                ip = ip,
                                mac = mac,
                                nomeExibicao = hostname ?: "Host ativo",
                                fonteNome = if (hostname != null) "subnetMdns" else "subnet",
                            ),
                        )
                    }

                    override fun onFinished(devicesFound: ArrayList<com.stealthcopter.networktools.subnet.Device>?) {
                        if (cont.isActive) cont.resume(resultados)
                    }
                })

            cont.invokeOnCancellation {
                try { scanner.cancel() } catch (_: Throwable) {}
            }
        }

    // ── ARP legado (/proc/net/arp) ──────────────────────────────────────────────

    private fun coletarViaArpLegado(): List<DispositivoRede> {
        // /proc/net/arp está restrito em Android 10+ (target SDK 29+).
        // A tentativa não aborta o scan — retorna lista vazia se negado.
        return try {
            val arquivo = java.io.File("/proc/net/arp")
            if (!arquivo.exists()) return emptyList()
            val linhas = arquivo.readLines()
            if (linhas.size <= 1) return emptyList()
            linhas.drop(1).mapNotNull { linha ->
                val p = linha.trim().split(Regex("\\s+"))
                if (p.size < 6) return@mapNotNull null
                val ip = p[0]
                val mac = p[3]
                if (!validarIpv4(ip) || !validarMac(mac)) return@mapNotNull null
                DispositivoRede(
                    id = "arp:$mac",
                    ip = ip,
                    mac = mac,
                    nomeExibicao = "Dispositivo não identificado",
                    fonteNome = "arp",
                )
            }
        } catch (_: Throwable) {
            Log.d("SignallQDevices", "arp: acesso negado a /proc/net/arp (Android 10+, esperado)")
            emptyList()
        }
    }

    // ── TCP probe (Semaphore limitado) ─────────────────────────────────────────

    /**
     * Limita a concorrência via Semaphore(50) para evitar estouro de file descriptors
     * em ranges /24 (254 alvos x N portas = muitas conexões simultâneas sem limite).
     */
    private suspend fun coletarViaTcpProbe(gatewayIp: String?, localIp: String?): List<DispositivoRede> = coroutineScope {
        val base = inferirPrefixoRedeCorreto() ?: inferirPrefixoRede(gatewayIp) ?: return@coroutineScope emptyList()
        val portas = intArrayOf(80, 443, 22, 53, 139, 445, 8080, 8443)
        val alvos = (1..254).map { host -> "$base.$host" }
            .filter { it != gatewayIp && it != localIp }

        val semaphore = Semaphore(50)
        val tarefas = alvos.map { ip ->
            async {
                semaphore.acquire()
                try {
                    val portasAbertas = portas.filter { porta -> testarPortaAberta(ip, porta, 400) }.toSet()
                    if (portasAbertas.isEmpty()) return@async null
                    DispositivoRede(
                        id = "tcp:$ip",
                        ip = ip,
                        mac = null,
                        nomeExibicao = "Host ativo",
                        fonteNome = "tcpProbe",
                        portasAbertas = portasAbertas,
                    )
                } finally {
                    semaphore.release()
                }
            }
        }
        tarefas.awaitAll().filterNotNull()
    }

    // ── mDNS ────────────────────────────────────────────────────────────────────

    /**
     * Fase 1: queries para tipos comuns (900ms) + coleta de tipos anunciados via _services.
     * Fase 2: se restarem dispositivos sem nome, consulta os tipos descobertos na fase 1 (1200ms).
     *
     * O MulticastSocket é criado sem porta fixa (porta 0) para evitar conflito com outros
     * processos que possam estar ouvindo na 5353. O bind na porta de envio é implícito.
     * O multicastLock é liberado em finally — garante liberação mesmo em erro.
     */
    private fun coletarViaMdns(): List<DispositivoRede> {
        val resultados = mutableMapOf<String, DispositivoRede>()
        val tiposDescobertos = mutableSetOf<String>()
        val tiposPorIp = mutableMapOf<String, MutableSet<String>>()

        val wm = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        val multicastLock = wm.createMulticastLock("signallq_mdns")
        multicastLock.setReferenceCounted(false)
        multicastLock.acquire()

        val grupo = InetAddress.getByName("224.0.0.251")
        val grupoAddr = InetSocketAddress(grupo, 5353)
        val ifaceWifi = obterInterfaceWifi()
        val socket = MulticastSocket(0)
        try {
            socket.timeToLive = 1
            socket.soTimeout = 300
            socket.broadcast = false
            socket.joinGroup(grupoAddr, ifaceWifi)

            val consulta1 = construirConsultaMdnsMulti()
            socket.send(DatagramPacket(consulta1, consulta1.size, grupo, 5353))

            val inicio1 = System.currentTimeMillis()
            while (System.currentTimeMillis() - inicio1 < 900) {
                try {
                    val buf = ByteArray(1500)
                    val resp = DatagramPacket(buf, buf.size)
                    socket.receive(resp)
                    val ip = resp.address?.hostAddress ?: continue
                    if (!validarIpv4(ip)) continue
                    val tiposDoIp = extrairTiposServicoMdns(buf, resp.length)
                    tiposDescobertos.addAll(tiposDoIp)
                    tiposPorIp.getOrPut(ip) { mutableSetOf() }.addAll(tiposDoIp)
                    val nome = extrairNomeMdnsDoPayload(buf, resp.length)
                    if (nome != null) {
                        resultados[ip] = DispositivoRede(id = "mdns:$ip", ip = ip, mac = null, nomeExibicao = nome, fonteNome = "mdns", tiposServicoMdns = tiposPorIp[ip] ?: emptySet())
                    } else if (!resultados.containsKey(ip)) {
                        resultados[ip] = DispositivoRede(id = "mdns:$ip", ip = ip, mac = null, nomeExibicao = "Serviço mDNS", fonteNome = "mdns", tiposServicoMdns = tiposPorIp[ip] ?: emptySet())
                    }
                } catch (_: java.net.SocketTimeoutException) {}
            }

            // Fase 2: consultar tipos descobertos para obter nomes de instância
            val tiposParaConsultar = tiposDescobertos
                .filter { !it.startsWith("_services") }
                .take(8)
            val temSemNome = resultados.values.any { it.nomeExibicao == "Serviço mDNS" }
            if (temSemNome && tiposParaConsultar.isNotEmpty()) {
                val consulta2 = construirConsultaMdnsParaTipos(tiposParaConsultar)
                socket.send(DatagramPacket(consulta2, consulta2.size, grupo, 5353))

                val inicio2 = System.currentTimeMillis()
                while (System.currentTimeMillis() - inicio2 < 1200) {
                    try {
                        val buf = ByteArray(1500)
                        val resp = DatagramPacket(buf, buf.size)
                        socket.receive(resp)
                        val ip = resp.address?.hostAddress ?: continue
                        if (!validarIpv4(ip)) continue
                        val nome = extrairNomeMdnsDoPayload(buf, resp.length) ?: continue
                        val existente = resultados[ip]
                        if (existente == null || existente.nomeExibicao == "Serviço mDNS") {
                            resultados[ip] = DispositivoRede(
                                id = "mdns:$ip", ip = ip, mac = null, nomeExibicao = nome, fonteNome = "mdns",
                                tiposServicoMdns = (existente?.tiposServicoMdns ?: emptySet()) + (tiposPorIp[ip] ?: emptySet()),
                            )
                        }
                    } catch (_: java.net.SocketTimeoutException) {}
                }
            }
        } finally {
            try { socket.leaveGroup(grupoAddr, null) } catch (_: Throwable) {}
            socket.close()
            if (multicastLock.isHeld) multicastLock.release()
        }
        return resultados.values.toList()
    }

    // ── SSDP/UPnP ──────────────────────────────────────────────────────────────

    private fun coletarViaSsdp(): List<DispositivoRede> {
        val resultados = mutableMapOf<String, Pair<DispositivoRede, Int>>()
        val payload = (
            "M-SEARCH * HTTP/1.1\r\n" +
                "HOST: 239.255.255.250:1900\r\n" +
                "MAN: \"ssdp:discover\"\r\n" +
                "MX: 1\r\n" +
                "ST: ssdp:all\r\n\r\n"
        ).toByteArray()

        val socket = DatagramSocket()
        try {
            socket.broadcast = true
            socket.soTimeout = 250
            socket.send(DatagramPacket(payload, payload.size, InetAddress.getByName("239.255.255.250"), 1900))
            val inicio = System.currentTimeMillis()
            while (System.currentTimeMillis() - inicio < 900) {
                try {
                    val buf = ByteArray(2048)
                    val resp = DatagramPacket(buf, buf.size)
                    socket.receive(resp)
                    val ip = resp.address?.hostAddress ?: continue
                    if (!validarIpv4(ip)) continue
                    val (nome, qualidade) = extrairNomeSsdpComQualidade(buf, resp.length)
                    val existente = resultados[ip]
                    if (existente == null || qualidade > existente.second) {
                        resultados[ip] = Pair(
                            DispositivoRede(id = "ssdp:$ip", ip = ip, mac = null, nomeExibicao = nome, fonteNome = "ssdp"),
                            qualidade,
                        )
                    }
                } catch (_: java.net.SocketTimeoutException) {}
            }
        } finally {
            socket.close()
        }
        return resultados.values.map { it.first }
    }

    // ── Helpers de rede ─────────────────────────────────────────────────────────

    /**
     * Deriva o prefixo de rede correto via ConnectivityManager.getLinkProperties,
     * usando [LinkAddress.getPrefixLength()] em vez de assumir /24.
     * Suporta redes como 192.168.1.0/24, 10.0.0.0/24, 172.16.x.x/20, etc.
     */
    @SuppressLint("MissingPermission")
    fun inferirPrefixoRedeCorreto(): String? {
        return try {
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val network: Network = cm.activeNetwork ?: return null
            val lp: LinkProperties = cm.getLinkProperties(network) ?: return null
            val linkAddr = lp.linkAddresses.firstOrNull { la ->
                la.address is Inet4Address && !la.address.isLoopbackAddress
            } ?: return null
            val ipInt = ipToInt(linkAddr.address.hostAddress ?: return null)
            val prefix = linkAddr.prefixLength
            val mask = if (prefix == 0) 0 else (-1 shl (32 - prefix))
            val networkInt = ipInt and mask
            intToIpPrefix(networkInt, prefix)
        } catch (_: Throwable) { null }
    }

    /** Converte IP string para Int (big-endian). */
    internal fun ipToInt(ip: String): Int {
        val parts = ip.split(".")
        return (parts[0].toInt() shl 24) or (parts[1].toInt() shl 16) or
            (parts[2].toInt() shl 8) or parts[3].toInt()
    }

    /** Converte IP network int para prefixo de 3 octetos (ex: "192.168.1" para /24)
     *  ou prefixo completo sem o octeto de host para outros prefixos. */
    internal fun intToIpPrefix(networkInt: Int, prefixLen: Int): String? {
        val a = (networkInt shr 24) and 0xFF
        val b = (networkInt shr 16) and 0xFF
        val c = (networkInt shr 8) and 0xFF
        // Para /24 exato ou maior, retorna os 3 octetos (comportamento existente)
        return if (prefixLen >= 24) "$a.$b.$c" else null
    }

    @SuppressLint("MissingPermission")
    private fun detectarGatewayIp(): String? {
        try {
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val network: Network = cm.activeNetwork ?: error("sem rede ativa")
            val lp: LinkProperties = cm.getLinkProperties(network) ?: error("sem link properties")
            val ip = lp.routes.firstOrNull { it.isDefaultRoute }?.gateway?.hostAddress
            if (!ip.isNullOrBlank()) return ip
        } catch (_: Throwable) {}

        try {
            val wm = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
            @Suppress("DEPRECATION")
            val dhcp = wm.dhcpInfo
            val gw = dhcp.gateway
            if (gw != 0) {
                return String.format(
                    Locale.ROOT,
                    "%d.%d.%d.%d",
                    gw and 0xff,
                    (gw shr 8) and 0xff,
                    (gw shr 16) and 0xff,
                    (gw shr 24) and 0xff,
                )
            }
        } catch (_: Throwable) {}

        return null
    }

    private fun publicar(dispositivos: List<DispositivoRede>, progresso: Int) {
        mutableSnapshotFlow.value =
            mutableSnapshotFlow.value.copy(
                estado = EstadoScanDispositivos.varrendo,
                progressoPercentual = min(99, max(0, progresso)),
                dispositivos = enriquecer(dispositivos),
            )
    }

    private fun enriquecer(dispositivos: List<DispositivoRede>): List<DispositivoRede> =
        dispositivos.map { d ->
            val fabricante = OuiDatabase.lookupFabricante(d.mac)
            d.copy(
                fabricante = fabricante,
                tipoDispositivo = ClassificadorDispositivoRede.classificar(d, fabricante),
            )
        }

    private fun atualizarEstado(estado: EstadoScanDispositivos, progresso: Int, erro: String?) {
        mutableSnapshotFlow.value =
            mutableSnapshotFlow.value.copy(
                estado = estado,
                progressoPercentual = progresso,
                erroMensagem = erro,
            )
    }

    private fun adicionarDispositivo(
        mapa: LinkedHashMap<String, DispositivoRede>,
        dispositivo: DispositivoRede,
    ) {
        val chave = dispositivo.mac?.lowercase(Locale.ROOT) ?: "ip:${dispositivo.ip}" ?: dispositivo.id
        val existente = mapa[chave]
        if (existente == null) {
            mapa[chave] = dispositivo
            return
        }

        // Prioridade de fonte: ssdp > mdns > subnetMdns > arp > subnet > tcpProbe
        val prioFonte = mapOf("ssdp" to 5, "mdns" to 4, "subnetMdns" to 3, "arp" to 2, "subnet" to 1, "tcpProbe" to 0)
        val prioExistente = prioFonte[existente.fonteNome] ?: 0
        val prioNova = prioFonte[dispositivo.fonteNome] ?: 0
        val genericos = setOf("Dispositivo não identificado", "Host ativo", "Serviço mDNS", "Dispositivo SSDP")
        val nome = when {
            existente.nomeExibicao in genericos -> dispositivo.nomeExibicao
            dispositivo.nomeExibicao !in genericos && prioNova > prioExistente -> dispositivo.nomeExibicao
            else -> existente.nomeExibicao
        }
        val fonte = if (prioNova > prioExistente) dispositivo.fonteNome else existente.fonteNome
        mapa[chave] =
            existente.copy(
                ip = existente.ip ?: dispositivo.ip,
                mac = existente.mac ?: dispositivo.mac,
                nomeExibicao = nome,
                fonteNome = fonte,
                tiposServicoMdns = existente.tiposServicoMdns + dispositivo.tiposServicoMdns,
                portasAbertas = existente.portasAbertas + dispositivo.portasAbertas,
            )
    }

    // ── Helpers de interface/IP ─────────────────────────────────────────────────

    /** Prefere interface wlan* para evitar que usb0/rmnet0 seja selecionada. */
    private fun obterInterfaceWifi(): NetworkInterface? =
        try {
            val candidatos = NetworkInterface.getNetworkInterfaces()?.toList()
                ?.filter { iface ->
                    iface.isUp && !iface.isLoopback && iface.supportsMulticast() &&
                        iface.inetAddresses.toList().any { it is Inet4Address && !it.isLoopbackAddress }
                } ?: emptyList()
            candidatos.firstOrNull { it.name.startsWith("wlan") } ?: candidatos.firstOrNull()
        } catch (_: Throwable) { null }

    private fun inferirPrefixoRede(gatewayIp: String?): String? {
        if (gatewayIp.isNullOrBlank()) return null
        if (!validarIpv4(gatewayIp)) return null
        val partes = gatewayIp.split(".")
        if (partes.size != 4) return null
        return "${partes[0]}.${partes[1]}.${partes[2]}"
    }

    private fun testarPortaAberta(ip: String, porta: Int, timeoutMs: Int): Boolean =
        try {
            Socket().use { socket ->
                socket.connect(InetSocketAddress(ip, porta), timeoutMs)
                true
            }
        } catch (_: Throwable) { false }

    private fun validarIpv4(ip: String): Boolean {
        val partes = ip.split(".")
        if (partes.size != 4) return false
        return partes.all { p -> p.toIntOrNull()?.let { it in 0..255 } == true }
    }

    private fun validarMac(mac: String): Boolean =
        Regex("^[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}$").matches(mac)

    private fun detectarIpLocal(): String? =
        try {
            NetworkInterface.getNetworkInterfaces()?.toList()
                ?.filter { it.isUp && !it.isLoopback }
                ?.flatMap { it.inetAddresses.toList() }
                ?.firstOrNull { it is Inet4Address && !it.isLoopbackAddress }
                ?.hostAddress
        } catch (_: Throwable) { null }

    private fun resolverHostname(ip: String): String? =
        try {
            val partes = ip.split(".").map { it.toInt().toByte() }.toByteArray()
            val addr = InetAddress.getByAddress(partes)
            val hostname = addr.canonicalHostName
            if (hostname == ip) null
            else hostname.removeSuffix(".local").removeSuffix(".").takeIf { it.isNotBlank() }
        } catch (_: Throwable) { null }

    // ── Extração de nomes dos protocolos ────────────────────────────────────────

    private fun extrairNomeSsdpComQualidade(payload: ByteArray, tamanho: Int): Pair<String, Int> {
        val texto = try { String(payload, 0, tamanho, Charsets.UTF_8) } catch (_: Throwable) { return Pair("Dispositivo SSDP", 0) }
        val linhas = texto.split("\r\n", "\n")
        for (linha in linhas) {
            if (linha.lowercase().startsWith("friendlyname")) {
                val nome = linha.substringAfter(":").trim()
                if (nome.isNotBlank()) return Pair(nome, 2)
            }
        }
        for (linha in linhas) {
            if (linha.lowercase().startsWith("server:")) {
                val server = linha.substringAfter(":").trim()
                val genericos = setOf("linux", "windows", "macos", "darwin", "ios", "android", "upnp", "http")
                val tokens = server.split(" ").map { it.trimEnd(',') }.filter { it.isNotBlank() }
                val produto = tokens.lastOrNull { tok ->
                    tok.contains("/") && tok.substringBefore("/").lowercase() !in genericos
                }
                val nome = produto?.substringBefore("/")?.takeIf { it.isNotBlank() }
                if (nome != null) return Pair(nome, 1)
            }
        }
        return Pair("Dispositivo SSDP", 0)
    }

    private fun extrairNomeMdnsDoPayload(payload: ByteArray, tamanho: Int): String? {
        if (tamanho < 12) return null
        val reservados = setOf("local", "tcp", "udp", "ip6", "ipv6", "arpa", "in-addr")
        return try {
            val numPerguntas  = ((payload[4].toInt() and 0xFF) shl 8) or (payload[5].toInt() and 0xFF)
            val numRespostas  = ((payload[6].toInt() and 0xFF) shl 8) or (payload[7].toInt() and 0xFF)
            val numAuthority  = ((payload[8].toInt() and 0xFF) shl 8) or (payload[9].toInt() and 0xFF)
            val numAdicionais = ((payload[10].toInt() and 0xFF) shl 8) or (payload[11].toInt() and 0xFF)

            var pos = 12
            repeat(numPerguntas) {
                val novo = pularNomeDns(payload, pos)
                pos = if (novo >= 0 && novo + 4 <= tamanho) novo + 4 else tamanho
            }

            var nomeInstancia: String? = null
            var nomeTxt: String? = null

            fun candidatoValido(nome: String?) =
                !nome.isNullOrBlank() && !nome.startsWith("_") &&
                    nome.lowercase() !in reservados && nome.any { it.isLetterOrDigit() }

            repeat(numRespostas + numAuthority + numAdicionais) {
                if (pos >= tamanho) return@repeat
                val rNomeOffset = pos
                val aposNome = pularNomeDns(payload, pos)
                if (aposNome < 0 || aposNome + 10 > tamanho) { pos = tamanho; return@repeat }
                val tipo  = ((payload[aposNome].toInt() and 0xFF) shl 8) or (payload[aposNome + 1].toInt() and 0xFF)
                val rdlen = ((payload[aposNome + 8].toInt() and 0xFF) shl 8) or (payload[aposNome + 9].toInt() and 0xFF)
                val rdataOffset = aposNome + 10
                pos = rdataOffset + rdlen

                when (tipo) {
                    0x000C -> if (nomeInstancia == null) {
                        val nome = lerPrimeiroLabelDns(payload, rdataOffset)
                        if (candidatoValido(nome)) nomeInstancia = nome
                    }
                    0x0001, 0x001C -> if (nomeInstancia == null) {
                        val nome = lerPrimeiroLabelDns(payload, rNomeOffset)
                        if (candidatoValido(nome)) nomeInstancia = nome
                    }
                    0x0010 -> if (nomeTxt == null) {
                        nomeTxt = extrairNomeTxtMdns(payload, rdataOffset, rdlen)
                    }
                }
            }
            nomeTxt ?: nomeInstancia
        } catch (_: Throwable) { null }
    }

    private fun extrairNomeTxtMdns(payload: ByteArray, rdataOffset: Int, rdlen: Int): String? {
        val prioridade = listOf("fn", "name", "n", "md", "model", "integrator", "manufacturer")
        val encontrados = mutableMapOf<String, String>()
        var pos = rdataOffset
        val fim = (rdataOffset + rdlen).coerceAtMost(payload.size)
        try {
            while (pos < fim) {
                val len = payload[pos].toInt() and 0xFF
                pos++
                if (pos + len > fim) break
                val entrada = String(payload, pos, len, Charsets.UTF_8)
                pos += len
                val sep = entrada.indexOf('=')
                if (sep < 1) continue
                val chave = entrada.substring(0, sep).lowercase().trim()
                val valor = entrada.substring(sep + 1).trim()
                if (valor.isNotBlank()) encontrados[chave] = valor
            }
        } catch (_: Throwable) {}
        return prioridade.firstNotNullOfOrNull { encontrados[it] }
    }

    private fun extrairTiposServicoMdns(payload: ByteArray, tamanho: Int): List<String> {
        val tipos = mutableListOf<String>()
        if (tamanho < 12) return tipos
        try {
            val numPerguntas  = ((payload[4].toInt() and 0xFF) shl 8) or (payload[5].toInt() and 0xFF)
            val numRespostas  = ((payload[6].toInt() and 0xFF) shl 8) or (payload[7].toInt() and 0xFF)
            val numAuthority  = ((payload[8].toInt() and 0xFF) shl 8) or (payload[9].toInt() and 0xFF)
            val numAdicionais = ((payload[10].toInt() and 0xFF) shl 8) or (payload[11].toInt() and 0xFF)
            var pos = 12
            repeat(numPerguntas) {
                pos = pularNomeDns(payload, pos).also { if (it < 0) return@repeat } + 4
            }
            repeat(numRespostas + numAuthority + numAdicionais) {
                val aposNome = pularNomeDns(payload, pos).also { if (it < 0) return@repeat }
                if (aposNome + 10 > tamanho) return@repeat
                val tipo  = ((payload[aposNome].toInt() and 0xFF) shl 8) or (payload[aposNome + 1].toInt() and 0xFF)
                val rdlen = ((payload[aposNome + 8].toInt() and 0xFF) shl 8) or (payload[aposNome + 9].toInt() and 0xFF)
                val rdataOffset = aposNome + 10
                pos = rdataOffset + rdlen
                if (tipo == 0x000C) {
                    val nomeCompleto = lerNomeDnsCompleto(payload, rdataOffset)
                    if (nomeCompleto != null && nomeCompleto.startsWith("_")) tipos.add(nomeCompleto)
                }
            }
        } catch (_: Throwable) {}
        return tipos
    }

    // ── Construção de queries ───────────────────────────────────────────────────

    private fun construirConsultaMdnsMulti(): ByteArray {
        val tiposServico = listOf(
            listOf("_http", "_tcp", "local"),
            listOf("_https", "_tcp", "local"),
            listOf("_airplay", "_tcp", "local"),
            listOf("_googlecast", "_tcp", "local"),
            listOf("_ipp", "_tcp", "local"),
            listOf("_smb", "_tcp", "local"),
            listOf("_afpovertcp", "_tcp", "local"),
            listOf("_ssh", "_tcp", "local"),
            listOf("_raop", "_tcp", "local"),
            listOf("_companion-link", "_tcp", "local"),
            listOf("_services", "_dns-sd", "_udp", "local"),
        )
        return buildList<Byte> {
            add(0x00); add(0x00)
            add(0x00); add(0x00)
            add(0x00); add(tiposServico.size.toByte())
            add(0x00); add(0x00)
            add(0x00); add(0x00)
            add(0x00); add(0x00)
            for (labels in tiposServico) {
                for (label in labels) {
                    add(label.length.toByte())
                    label.forEach { add(it.code.toByte()) }
                }
                add(0x00)
                add(0x00); add(0x0C)
                add(0x00); add(0x01)
            }
        }.toByteArray()
    }

    private fun construirConsultaMdnsParaTipos(tipos: List<String>): ByteArray {
        return buildList<Byte> {
            add(0x00); add(0x00)
            add(0x00); add(0x00)
            add(0x00); add(tipos.size.toByte())
            add(0x00); add(0x00)
            add(0x00); add(0x00)
            add(0x00); add(0x00)
            for (tipo in tipos) {
                for (label in tipo.split(".")) {
                    add(label.length.toByte())
                    label.forEach { add(it.code.toByte()) }
                }
                add(0x00)
                add(0x00); add(0x0C)
                add(0x00); add(0x01)
            }
        }.toByteArray()
    }

    // ── DNS helpers ─────────────────────────────────────────────────────────────

    private fun pularNomeDns(payload: ByteArray, offset: Int): Int {
        var pos = offset
        while (pos < payload.size) {
            val len = payload[pos].toInt() and 0xFF
            when {
                (len and 0xC0) == 0xC0 -> return pos + 2
                len == 0               -> return pos + 1
                len in 1..63           -> pos += len + 1
                else                   -> return -1
            }
        }
        return -1
    }

    private fun lerPrimeiroLabelDns(payload: ByteArray, offset: Int): String? {
        var pos = offset
        val visitados = mutableSetOf<Int>()
        while (pos < payload.size) {
            if (!visitados.add(pos)) return null
            val len = payload[pos].toInt() and 0xFF
            when {
                (len and 0xC0) == 0xC0 -> {
                    if (pos + 1 >= payload.size) return null
                    pos = ((len and 0x3F) shl 8) or (payload[pos + 1].toInt() and 0xFF)
                }
                len == 0 -> return null
                len in 1..63 -> {
                    if (pos + 1 + len > payload.size) return null
                    return String(payload, pos + 1, len, Charsets.UTF_8)
                }
                else -> return null
            }
        }
        return null
    }

    private fun lerNomeDnsCompleto(payload: ByteArray, offset: Int): String? {
        val labels = mutableListOf<String>()
        var pos = offset
        val visitados = mutableSetOf<Int>()
        while (pos < payload.size) {
            if (!visitados.add(pos)) return null
            val len = payload[pos].toInt() and 0xFF
            when {
                (len and 0xC0) == 0xC0 -> {
                    if (pos + 1 >= payload.size) return null
                    pos = ((len and 0x3F) shl 8) or (payload[pos + 1].toInt() and 0xFF)
                }
                len == 0 -> break
                len in 1..63 -> {
                    if (pos + 1 + len > payload.size) return null
                    labels.add(String(payload, pos + 1, len, Charsets.UTF_8))
                    pos += len + 1
                }
                else -> return null
            }
        }
        return if (labels.isEmpty()) null else labels.joinToString(".")
    }
}
