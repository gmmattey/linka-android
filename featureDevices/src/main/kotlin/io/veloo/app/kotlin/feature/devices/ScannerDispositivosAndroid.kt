package io.veloo.app.feature.devices

import android.annotation.SuppressLint
import android.content.Context
import android.net.ConnectivityManager
import android.net.LinkProperties
import android.net.Network
import android.net.wifi.WifiManager
import android.util.Log
import com.stealthcopter.networktools.ARPInfo
import com.stealthcopter.networktools.SubnetDevices
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.Inet4Address
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.NetworkInterface
import java.net.Socket
import java.net.SocketException
import java.util.Locale
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Semaphore
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import javax.jmdns.JmDNS
import javax.jmdns.ServiceEvent
import javax.jmdns.ServiceInfo
import javax.jmdns.ServiceListener
import kotlin.coroutines.resume
import kotlin.math.max
import kotlin.math.min

/**
 * Motor de scan de dispositivos de rede.
 *
 * Fontes de descoberta (em ordem de confiabilidade):
 *  1. SubnetDevices (AndroidNetworkTools) — ping nativo /system/bin/ping, funciona sem root.
 *     Substitui InetAddress.isReachable() que requeria root em Android 10+.
 *  2. ARPInfo.getMacFromIPAddress() — obtém MAC do cache ARP do kernel por host encontrado.
 *     Funciona sem root quando o kernel já tem o host em cache (o SubnetDevices popula isso).
 *  3. mDNS via jmDNS — Bonjour/Avahi com suporte a TXT records (fn=, md=, model=).
 *     Substitui o parser de pacotes DNS binários artesanal.
 *  4. SSDP/UPnP — faz HTTP GET do XML de descrição (LOCATION header) para obter
 *     friendlyName, manufacturer e modelName reais.
 *  5. TCP probe — como complemento para hosts que bloqueiam ICMP mas têm portas abertas.
 *     Limitado por Semaphore(50) para não estourar file descriptors.
 *
 * Pipeline de naming (melhor → pior):
 *   friendlyName SSDP(XML) > nome amigável mDNS TXT/instância(jmDNS) > reverse DNS > "Host ativo"
 *
 * Pipeline de fabricante (melhor → pior):
 *   manufacturer UPnP(XML) > fabricante mDNS TXT > OUI(MAC) > null
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

    /** OkHttpClient compartilhado para fetch de XMLs UPnP — timeout curto. */
    private val okHttpClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .connectTimeout(1500, TimeUnit.MILLISECONDS)
            .readTimeout(1500, TimeUnit.MILLISECONDS)
            .followRedirects(false)
            .build()
    }

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

                    // 3. mDNS via jmDNS — nomes Bonjour/Avahi com TXT records (coleta concorrente)
                    val mdns = coletarViaMdnsJmDns()
                    Log.d("SignallQDevices", "mdns(jmDNS): ${mdns.size} dispositivos")
                    mdns.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 65)

                    // 4. SSDP/UPnP com fetch de XML de descrição
                    val ssdp = coletarViaSsdp()
                    Log.d("SignallQDevices", "ssdp: ${ssdp.size} dispositivos")
                    ssdp.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 78)

                    // 5. TCP probe — hosts que bloqueiam ICMP mas têm portas abertas
                    val tcpProbe = coletarViaTcpProbe(gatewayIp, localIp)
                    Log.d("SignallQDevices", "tcpProbe: ${tcpProbe.size} dispositivos")
                    tcpProbe.forEach { adicionarDispositivo(dispositivos, it) }
                    publicar(dispositivos.values.toList(), 90)
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
                    // Prioridade de fabricante: manufacturer UPnP(XML) > fabricante mDNS TXT > OUI(MAC)
                    val fabricanteOui = OuiDatabase.lookupFabricante(macResolvido)
                    val fabricanteResolvido = d.fabricante ?: fabricanteOui
                    val tipo = ClassificadorDispositivoRede.classificar(d, fabricanteResolvido)
                    val hostname = if (d.ip != null && d.fonteNome != "gateway") resolverHostname(d.ip) else null
                    // Prioridade de nome: fonteNome com alta prioridade já vem enriquecido (ssdpXml/mdnsJmDns)
                    // Só cai para hostname/fabricante se ainda é genérico
                    val nomeResolvido = when {
                        d.fonteNome == "gateway" -> d.nomeExibicao
                        d.nomeExibicao !in genericosParaResolver -> d.nomeExibicao
                        hostname != null -> hostname
                        fabricanteResolvido != null -> fabricanteResolvido
                        else -> d.ip ?: d.nomeExibicao
                    }
                    d.copy(
                        mac = macResolvido,
                        fabricante = fabricanteResolvido,
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

    // ── mDNS via jmDNS ─────────────────────────────────────────────────────────

    /**
     * Descoberta mDNS/Bonjour usando jmDNS (Apache-2.0) — coleta CONCORRENTE.
     *
     * Padrão correto de jmDNS: registra [ServiceListener] para TODOS os tipos de serviço
     * de uma vez, aguarda uma ÚNICA janela de tempo (~4,5s) e coleta o acumulado.
     * Tempo total da fase: ~4–5s independente do número de tipos (antes: até 36s sequencial).
     *
     * Fluxo:
     * 1. MulticastLock adquirida antes de criar JmDNS, liberada em finally.
     * 2. JmDNS criada no IPv4 da interface Wi-Fi — não loopback.
     * 3. Um único [ServiceListener] registrado para todos os 18 tipos simultaneamente.
     * 4. [serviceAdded] → chama [JmDNS.requestServiceInfo] para forçar resolução do TXT.
     * 5. [serviceResolved] → acumula em [ConcurrentHashMap] (thread-safe).
     * 6. [delay(4500)] — janela única fixa.
     * 7. Remove listeners, coleta mapa, fecha JmDNS.
     *
     * TXT records extraídos de cada [ServiceInfo]:
     * - IPv4 (`inet4Addresses[0]`)
     * - nome: `fn` > `name` > instância > `md` > `ty`
     * - fabricante: `manufacturer` / `mf`
     * - modelo: `md` / `model`
     */
    private suspend fun coletarViaMdnsJmDns(): List<DispositivoRede> = withContext(Dispatchers.IO) {
        val acumulado = ConcurrentHashMap<String, DispositivoRede>()

        val wm = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
        val multicastLock = wm.createMulticastLock("signallq_jmdns")
        multicastLock.setReferenceCounted(false)
        multicastLock.acquire()

        val ipLocalWifi = obterIpv4InterfaceWifi()

        val tiposServico = listOf(
            "_googlecast._tcp.local.",
            "_airplay._tcp.local.",
            "_raop._tcp.local.",
            "_spotify-connect._tcp.local.",
            "_ipp._tcp.local.",
            "_ipps._tcp.local.",
            "_printer._tcp.local.",
            "_pdl-datastream._tcp.local.",
            "_http._tcp.local.",
            "_workstation._tcp.local.",
            "_smb._tcp.local.",
            "_ssh._tcp.local.",
            "_afpovertcp._tcp.local.",
            "_homekit._tcp.local.",
            "_hap._tcp.local.",
            "_amzn-wplay._tcp.local.",
            "_googlezone._tcp.local.",
            "_device-info._tcp.local.",
        )

        try {
            val jmdns = if (ipLocalWifi != null) {
                JmDNS.create(ipLocalWifi, "signallq-scanner")
            } else {
                JmDNS.create()
            }

            try {
                // Listener único — acumula resolvidos na ConcurrentHashMap
                val listener = object : ServiceListener {
                    override fun serviceAdded(event: ServiceEvent) {
                        // Força resolução do TXT — jmDNS não resolve automaticamente em addServiceListener
                        try {
                            jmdns.requestServiceInfo(event.type, event.name, 1000)
                        } catch (_: Throwable) {}
                    }

                    override fun serviceRemoved(event: ServiceEvent) { /* não nos importa */ }

                    override fun serviceResolved(event: ServiceEvent) {
                        val info = event.info ?: return
                        processarServiceInfo(info, event.type, acumulado)
                    }
                }

                // Registra para todos os tipos de uma vez — disparo concorrente
                for (tipo in tiposServico) {
                    try {
                        jmdns.addServiceListener(tipo, listener)
                    } catch (e: Throwable) {
                        Log.d("SignallQDevices", "jmDNS: falha ao registrar listener para $tipo: ${e.message}")
                    }
                }

                // Janela única de coleta — todos os tipos respondem em paralelo
                delay(4500L)

                // Remove listeners antes de fechar
                for (tipo in tiposServico) {
                    try {
                        jmdns.removeServiceListener(tipo, listener)
                    } catch (_: Throwable) {}
                }

                Log.d("SignallQDevices", "jmDNS: janela concluída, ${acumulado.size} dispositivos resolvidos")
            } finally {
                try { jmdns.close() } catch (_: Throwable) {}
            }
        } catch (e: Throwable) {
            Log.e("SignallQDevices", "jmDNS: falha ao criar instância — ROM incompatível? ${e.message}")
            // não derruba o scan — retorna o que conseguiu
        } finally {
            if (multicastLock.isHeld) multicastLock.release()
        }

        acumulado.values.toList()
    }

    /**
     * Extrai campos de um [ServiceInfo] resolvido e acumula/enriquece no mapa thread-safe.
     * Chamado de dentro do [ServiceListener.serviceResolved] — pode ser chamado de múltiplas threads.
     */
    private fun processarServiceInfo(
        info: ServiceInfo,
        tipo: String,
        acumulado: ConcurrentHashMap<String, DispositivoRede>,
    ) {
        val ipv4 = info.inet4Addresses.firstOrNull()?.hostAddress ?: return
        if (!validarIpv4(ipv4)) return

        val tipoServico = tipo.removeSuffix(".")

        val txtFn = info.getPropertyString("fn")?.takeIf { it.isNotBlank() }
        val txtName = info.getPropertyString("name")?.takeIf { it.isNotBlank() }
        val txtMd = info.getPropertyString("md")?.takeIf { it.isNotBlank() }
        val txtTy = info.getPropertyString("ty")?.takeIf { it.isNotBlank() }
        val txtModel = info.getPropertyString("model")?.takeIf { it.isNotBlank() }
        val txtMf = info.getPropertyString("mf")?.takeIf { it.isNotBlank() }
        val txtManufacturer = info.getPropertyString("manufacturer")?.takeIf { it.isNotBlank() }

        // Prioridade de nome: fn > name > instância > md/ty
        val nomeAmigavel = txtFn
            ?: txtName
            ?: info.getName().takeIf { it.isNotBlank() && !it.startsWith("_") }
            ?: txtMd
            ?: txtTy
            ?: "Serviço mDNS"

        val fabricanteMdns = txtManufacturer ?: txtMf
        val modeloMdns = txtMd ?: txtModel

        // merge atômico via compute — garante thread-safety sem lock externo
        acumulado.merge(
            ipv4,
            DispositivoRede(
                id = "mdns:$ipv4",
                ip = ipv4,
                mac = null,
                nomeExibicao = nomeAmigavel,
                fonteNome = "mdnsJmDns",
                fabricante = fabricanteMdns,
                modeloDispositivo = modeloMdns,
                tiposServicoMdns = setOf(tipoServico),
            ),
        ) { existente, novo ->
            val nomeMelhor = when {
                existente.nomeExibicao == "Serviço mDNS" -> novo.nomeExibicao
                novo.nomeExibicao != "Serviço mDNS" && txtFn != null -> novo.nomeExibicao
                else -> existente.nomeExibicao
            }
            existente.copy(
                nomeExibicao = nomeMelhor,
                fabricante = existente.fabricante ?: novo.fabricante,
                modeloDispositivo = existente.modeloDispositivo ?: novo.modeloDispositivo,
                tiposServicoMdns = existente.tiposServicoMdns + novo.tiposServicoMdns,
            )
        }
    }

    // ── SSDP/UPnP com fetch do XML de descrição ────────────────────────────────

    /**
     * Envia M-SEARCH multicast, coleta respostas, lê o header LOCATION de cada resposta
     * e faz HTTP GET do XML de descrição UPnP para extrair `friendlyName`, `manufacturer`
     * e `modelName`. Fallback para nome extraído dos headers se o fetch falhar.
     *
     * Limite de concorrência para os fetches HTTP: Semaphore(8) para não explodir
     * conexões em redes com muitos dispositivos UPnP.
     */
    private fun coletarViaSsdp(): List<DispositivoRede> {
        // Mapa: ip → (DispositivoRede, qualidadeNome, locationUrl)
        data class SsdpEntry(val dispositivo: DispositivoRede, val qualidade: Int, val locationUrl: String?)

        val entradas = mutableMapOf<String, SsdpEntry>()

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
                    val texto = try { String(buf, 0, resp.length, Charsets.UTF_8) } catch (_: Throwable) { continue }
                    val (nome, qualidade) = extrairNomeSsdpComQualidade(texto)
                    val locationUrl = extrairLocationHeader(texto)
                    val existente = entradas[ip]
                    if (existente == null || qualidade > existente.qualidade) {
                        entradas[ip] = SsdpEntry(
                            DispositivoRede(id = "ssdp:$ip", ip = ip, mac = null, nomeExibicao = nome, fonteNome = "ssdp"),
                            qualidade,
                            locationUrl,
                        )
                    }
                } catch (_: java.net.SocketTimeoutException) {}
            }
        } finally {
            socket.close()
        }

        // Fetch dos XMLs de descrição em paralelo com limite de concorrência
        val semaphore = Semaphore(8)
        val resultados = entradas.values.map { entry ->
            val locationUrl = entry.locationUrl
            if (locationUrl.isNullOrBlank()) {
                entry.dispositivo
            } else {
                semaphore.acquire()
                try {
                    val descricao = fetchDescricaoUpnp(locationUrl)
                    if (descricao != null) {
                        val nomeFinal = descricao.friendlyName.takeIf { it.isNotBlank() } ?: entry.dispositivo.nomeExibicao
                        entry.dispositivo.copy(
                            nomeExibicao = nomeFinal,
                            fonteNome = "ssdpXml",
                            fabricante = descricao.manufacturer.takeIf { it.isNotBlank() },
                            modeloDispositivo = descricao.modelName.takeIf { it.isNotBlank() },
                        )
                    } else {
                        entry.dispositivo
                    }
                } catch (_: Throwable) {
                    entry.dispositivo
                } finally {
                    semaphore.release()
                }
            }
        }

        return resultados
    }

    // ── Fetch + parse do XML de descrição UPnP ─────────────────────────────────

    /**
     * Faz HTTP GET da URL de descrição UPnP e parseia os campos relevantes via [XmlDescricaoUpnpParser].
     * Retorna null se o fetch falhar ou o XML não contiver friendlyName.
     */
    private fun fetchDescricaoUpnp(url: String): XmlDescricaoUpnpParser.Descricao? {
        return try {
            val request = Request.Builder().url(url).get().build()
            okHttpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) return null
                val body = response.body?.string() ?: return null
                XmlDescricaoUpnpParser.parsear(body)
            }
        } catch (_: Throwable) {
            null
        }
    }

    // ── Helpers de rede ─────────────────────────────────────────────────────────

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

    internal fun ipToInt(ip: String): Int {
        val parts = ip.split(".")
        return (parts[0].toInt() shl 24) or (parts[1].toInt() shl 16) or
            (parts[2].toInt() shl 8) or parts[3].toInt()
    }

    internal fun intToIpPrefix(networkInt: Int, prefixLen: Int): String? {
        val a = (networkInt shr 24) and 0xFF
        val b = (networkInt shr 16) and 0xFF
        val c = (networkInt shr 8) and 0xFF
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
            val fabricanteOui = OuiDatabase.lookupFabricante(d.mac)
            val fabricante = d.fabricante ?: fabricanteOui
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

        // Prioridade de fonte: ssdpXml > ssdp > mdnsJmDns > subnetMdns > arp > subnet > tcpProbe
        val prioFonte = mapOf(
            "ssdpXml" to 6,
            "ssdp" to 5,
            "mdnsJmDns" to 4,
            "subnetMdns" to 3,
            "arp" to 2,
            "subnet" to 1,
            "tcpProbe" to 0,
        )
        val prioExistente = prioFonte[existente.fonteNome] ?: 0
        val prioNova = prioFonte[dispositivo.fonteNome] ?: 0
        val genericos = setOf("Dispositivo não identificado", "Host ativo", "Serviço mDNS", "Dispositivo SSDP")
        val nome = when {
            existente.nomeExibicao in genericos -> dispositivo.nomeExibicao
            dispositivo.nomeExibicao !in genericos && prioNova > prioExistente -> dispositivo.nomeExibicao
            else -> existente.nomeExibicao
        }
        val fonte = if (prioNova > prioExistente) dispositivo.fonteNome else existente.fonteNome
        // Fabricante: prefere o mais específico (ssdpXml > mdnsJmDns > OUI)
        val fabricanteMerge = when {
            prioNova > prioExistente && dispositivo.fabricante != null -> dispositivo.fabricante
            else -> existente.fabricante ?: dispositivo.fabricante
        }
        val modeloMerge = existente.modeloDispositivo ?: dispositivo.modeloDispositivo

        mapa[chave] =
            existente.copy(
                ip = existente.ip ?: dispositivo.ip,
                mac = existente.mac ?: dispositivo.mac,
                nomeExibicao = nome,
                fonteNome = fonte,
                fabricante = fabricanteMerge,
                modeloDispositivo = modeloMerge,
                tiposServicoMdns = existente.tiposServicoMdns + dispositivo.tiposServicoMdns,
                portasAbertas = existente.portasAbertas + dispositivo.portasAbertas,
            )
    }

    // ── Helpers de interface/IP ─────────────────────────────────────────────────

    /** Retorna o endereço InetAddress IPv4 da interface Wi-Fi para uso no jmDNS. */
    private fun obterIpv4InterfaceWifi(): InetAddress? =
        try {
            val candidatos = NetworkInterface.getNetworkInterfaces()?.toList()
                ?.filter { iface ->
                    iface.isUp && !iface.isLoopback && iface.supportsMulticast() &&
                        iface.inetAddresses.toList().any { it is Inet4Address && !it.isLoopbackAddress }
                } ?: emptyList()
            val iface = candidatos.firstOrNull { it.name.startsWith("wlan") } ?: candidatos.firstOrNull()
            iface?.inetAddresses?.toList()?.firstOrNull { it is Inet4Address && !it.isLoopbackAddress }
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

    // ── Helpers de extração de headers SSDP ────────────────────────────────────

    /**
     * Extrai o melhor nome disponível dos headers SSDP (sem fetch de XML).
     * Retorna (nome, qualidade) onde qualidade 1 = nome do header SERVER, 0 = genérico.
     * O nome real (friendlyName) vem do XML — este método é só fallback.
     */
    private fun extrairNomeSsdpComQualidade(texto: String): Pair<String, Int> {
        val linhas = texto.split("\r\n", "\n")
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

    /** Extrai o valor do header LOCATION da resposta SSDP. */
    private fun extrairLocationHeader(texto: String): String? {
        val linhas = texto.split("\r\n", "\n")
        for (linha in linhas) {
            if (linha.lowercase().startsWith("location:")) {
                val url = linha.substringAfter(":").trim().let {
                    // "location: http://..." — o substringAfter acima pega só o que vem depois do primeiro ":"
                    // mas URLs HTTP têm ":", precisamos reconstruir
                    val loc = linha.substringAfterFirst(":")
                    loc.trim()
                }
                // Reconstruir URL completa: o header pode ser "LOCATION: http://192.168.1.1:49152/desc.xml"
                // substringAfter(":") retorna "//192.168.1.1:49152/desc.xml" — precisa do "http:"
                val urlCompleta = extrairUrlLocation(linha)
                if (!urlCompleta.isNullOrBlank()) return urlCompleta
            }
        }
        return null
    }

    /** Extrai a URL completa do header LOCATION, tratando o ":" do scheme HTTP. */
    private fun extrairUrlLocation(headerLinha: String): String? {
        val sep = headerLinha.indexOf(':')
        if (sep < 0) return null
        val resto = headerLinha.substring(sep + 1).trim()
        // resto pode ser "http://..." ou "//..." (raro)
        return when {
            resto.startsWith("http://") || resto.startsWith("https://") -> resto
            resto.startsWith("//") -> "http:$resto"
            else -> null
        }
    }

    private fun String.substringAfterFirst(delimiter: String): String {
        val idx = indexOf(delimiter)
        return if (idx < 0) this else substring(idx + delimiter.length)
    }
}
