package io.signallq.app.core.network.topologia.engine

import io.signallq.app.core.network.contracts.oui.EspecificidadeOui
import io.signallq.app.core.network.contracts.topologia.ClassificacaoTopologia
import io.signallq.app.core.network.contracts.topologia.ConflitoSinal
import io.signallq.app.core.network.contracts.topologia.Evidencia
import io.signallq.app.core.network.contracts.topologia.NivelConfianca
import io.signallq.app.core.network.contracts.topologia.OrigemDados
import io.signallq.app.core.network.contracts.topologia.PapelTopologia
import io.signallq.app.core.network.contracts.topologia.PesoEvidencia
import io.signallq.app.core.network.contracts.topologia.RedeClassificadaTopologia
import io.signallq.app.core.network.contracts.topologia.TipoEvidencia
import io.signallq.app.core.network.contracts.wifi.RedeVizinha
import io.signallq.app.core.network.topologia.oui.OuiCatalog

/**
 * Motor de topologia unificado — Fase 2A do plano de unificação de topologia
 * (issue #975/#979, `PLANO_UNIFICACAO_TOPOLOGIA_WIFI_2026-07-15.md`).
 *
 * Substitui, num único motor, a lógica de dois motores hoje desalinhados:
 * - `TopologiaWifiEngine` (`feature/wifi`) — agrupamento por SSID + OUI + banda.
 * - `GatewayHeuristica` (`app`) — keyword de SSID (MESH/DECO/EERO/VELOP/ORBI, EXTENSOR/EXT/RANGE)
 *   e, quando não há dado de OUI algum, a contagem de BSSIDs distintos com o mesmo SSID acima do
 *   threshold de RSSI (-75dBm, inclusive).
 *
 * **Roda em paralelo — Fase 2A não tem nenhum consumidor real ainda.** Só testes comparam este
 * motor contra os dois motores antigos e contra os testes de caracterização da Preparação
 * (issue #976). Nenhuma tela (Home, Sinal → Redes, Dispositivos) consome [classificar] até a
 * Fase 2B.
 *
 * **Regra de segurança inegociável (ajuste #1 da revisão do plano):** o Android só expõe uma 2ª
 * rota IP (prova de qual nó é o roteador central de um sistema mesh) em casos raros — este motor
 * não recebe esse dado (só scan Wi-Fi passivo). Por isso, **nunca** atribui [PapelTopologia.ROTEADOR]
 * a um nó só porque ele tem o RSSI mais forte do grupo, ou porque é o BSSID conectado, quando a
 * evidência disponível é de sistema mesh — o resultado nesse caso é sempre
 * [PapelTopologia.SISTEMA_MESH_PROVAVEL] para **todos** os nós do grupo, nunca a afirmação de que
 * um nó específico é o "roteador central". Isso corrige um bug conhecido do `TopologiaWifiEngine`
 * antigo, que rotulava o BSSID conectado como `ROTEADOR_MESH` (nó principal) só por conveniência —
 * ver `TopologiaCaracterizacaoTest`/`TopologiaWifiEngineTest` para o comportamento antigo.
 *
 * **Cascata de decisão** (da evidência mais confiável — hardware — para a mais fraca — heurística
 * de SSID/RSSI sem nenhum dado de hardware):
 * 1. Conflito explícito entre SSID (keyword) e OUI (papel único e sem sobreposição) — OUI vence
 *    por ser sinal de hardware; SSID é configurável pelo usuário. Registrado como [ConflitoSinal].
 * 2. OUI ambíguo (ex.: conflito de curadoria Intelbras — [OuiCatalog] declara
 *    `papeisPossiveis = {ROTEADOR, NO_MESH}`) e nó isolado (nenhum outro BSSID com o mesmo SSID
 *    visível) → sem evidência de grupo, o contexto resolve para [PapelTopologia.ROTEADOR] — não
 *    dá pra ser "nó de um mesh" sem ver outros nós. Corrige o `BUG CONHECIDO` documentado em
 *    `TopologiaCaracterizacaoTest` (o `TopologiaWifiEngine` antigo caía sempre no ramo de mesh por
 *    causa da ordem dos `if`s).
 * 3. Evidência de mesh concordante — banda repetida entre nós de mesmo OUI, OU OUI cujo único
 *    papel possível é [PapelTopologia.NO_MESH] (linha de produto mesh dedicada, ex.: Eero/Deco),
 *    OU keyword de SSID de mesh — qualquer uma dessas, isoladas ou combinadas, resulta em
 *    [PapelTopologia.SISTEMA_MESH_PROVAVEL]. Confiança sobe pra ALTA quando 2+ sinais concordam.
 * 4. Keyword de SSID de extensor (sem conflito com OUI) → [PapelTopologia.REPETIDOR].
 * 5. OUI confirma papel único de gateway ISP (`ROTEADOR`, não ambíguo) → [PapelTopologia.ROTEADOR].
 * 6. Mesmo OUI no grupo, banda **não** repetida (ex.: 2.4GHz + 5GHz do mesmo rádio físico) →
 *    [PapelTopologia.ROTEADOR] — é um único AP dual/tri-band, não um sistema mesh.
 * 7. Grupo com OUIs diferentes para o mesmo SSID (extensor por hardware) — nunca decide por RSSI
 *    (ver aviso da revisão do plano: "o de maior RSSI deve ser o central" é proibido). Só vira
 *    [PapelTopologia.REPETIDOR] quando outro nó do grupo tem OUI **confirmado** de gateway ISP;
 *    caso contrário [PapelTopologia.DESCONHECIDO], com o RSSI registrado como evidência auxiliar
 *    (nunca usado pra decidir).
 * 8. Nó isolado sem nenhum sinal → [PapelTopologia.ROTEADOR] com confiança BAIXA (mesmo fallback
 *    conservador do `TopologiaWifiEngine` antigo pra "rede única").
 */
object TopologiaRedeEngine {

    // Mesmos tokens de SSID do GatewayHeuristica (app/GatewayHeuristica.kt) — replicados aqui
    // porque :coreNetwork não pode depender de :app (lei de dependências feature/core).
    private val SSID_MESH_EXATOS = listOf("MESH", "DECO", "EERO", "VELOP")
    private val SSID_MESH_PREFIXO = listOf("ORBI")
    private val SSID_EXTENSOR_EXATOS = listOf("EXTENSOR", "REPEATER")
    private val SSID_EXTENSOR_TOKEN = listOf("EXT", "RANGE")

    // Threshold mínimo inclusivo de RSSI pra contagem de BSSIDs — só usado quando não há
    // nenhum dado de OUI (fallback equivalente ao GatewayHeuristica.RSSI_MESH_MINIMO).
    private const val RSSI_MESH_MINIMO = -75

    fun classificar(
        redes: List<RedeVizinha>,
        connectedBssid: String? = null,
    ): List<RedeClassificadaTopologia> {
        if (redes.isEmpty()) return emptyList()

        val porSsid = redes.groupBy { it.ssid }
        return redes.map { rede ->
            val grupo = porSsid[rede.ssid] ?: listOf(rede)
            classificarRede(rede, grupo)
        }
    }

    private fun classificarRede(
        rede: RedeVizinha,
        grupo: List<RedeVizinha>,
    ): RedeClassificadaTopologia {
        val oui = normalizarOui(rede.oui)
        val ouiEntry = if (oui.isNotEmpty()) OuiCatalog.lookup(oui) else null
        val papeisOui = ouiEntry?.papeisPossiveis.orEmpty()
        val ouiIndicaMesh = papeisOui.contains(PapelTopologia.NO_MESH)
        val ouiIndicaRoteador = papeisOui.contains(PapelTopologia.ROTEADOR)
        val ouiAmbiguo = papeisOui.size > 1

        val ssidUpper = rede.ssid.orEmpty().uppercase()
        val tokens = tokenize(ssidUpper)
        val ssidIndicaMesh = ssidUpper.isNotEmpty() &&
            (SSID_MESH_EXATOS.any { ssidUpper.contains(it) } || tokens.any { it in SSID_MESH_PREFIXO })
        val ssidIndicaExtensor = ssidUpper.isNotEmpty() &&
            (SSID_EXTENSOR_EXATOS.any { ssidUpper.contains(it) } || tokens.any { it in SSID_EXTENSOR_TOKEN })

        val ouisNoGrupo = grupo.map { normalizarOui(it.oui) }.toSet()
        val mesmoOuiNoGrupo = grupo.size > 1 && oui.isNotEmpty() && ouisNoGrupo == setOf(oui)
        val bandas = grupo.map { it.banda }
        val bandaRepetidaNoGrupo = mesmoOuiNoGrupo && bandas.size != bandas.toSet().size
        val evidenciaEstruturalMesh = bandaRepetidaNoGrupo

        // Fallback GatewayHeuristica: só entra em jogo quando NÃO há dado de OUI algum pra este
        // nó — se houver OUI (mesmo desconhecido do catálogo), o agrupamento por banda (acima)
        // já é um sinal melhor e evita o falso positivo conhecido de dual-band virar "mesh".
        val ssidNormalizado = rede.ssid?.trim()?.lowercase().orEmpty()
        val bssidsMesmoSsidRssiForte = if (oui.isEmpty() && ssidNormalizado.isNotEmpty()) {
            grupo
                .filter { it.ssid?.trim()?.lowercase() == ssidNormalizado }
                .filter { it.rssiDbm >= RSSI_MESH_MINIMO }
                .map { it.bssid }
                .distinct()
        } else {
            emptyList()
        }
        val evidenciaRssiSemOui = bssidsMesmoSsidRssiForte.size >= 2

        val evidencias = mutableListOf<Evidencia>()
        val conflitos = mutableListOf<ConflitoSinal>()

        val evidenciaOui = if (ouiEntry != null && papeisOui.isNotEmpty()) {
            Evidencia(TipoEvidencia.OUI, oui, PesoEvidencia.FORTE).also { evidencias += it }
        } else {
            null
        }
        if (evidenciaEstruturalMesh) {
            evidencias += Evidencia(
                TipoEvidencia.OUI,
                "grupo_mesmo_oui_banda_repetida:${grupo.size}_nos",
                PesoEvidencia.FORTE,
            )
        }
        val evidenciaSsid = if (ssidIndicaMesh || ssidIndicaExtensor) {
            Evidencia(TipoEvidencia.SSID, rede.ssid.orEmpty(), PesoEvidencia.MEDIO).also { evidencias += it }
        } else {
            null
        }
        if (evidenciaRssiSemOui) {
            evidencias += Evidencia(
                TipoEvidencia.RSSI,
                "${bssidsMesmoSsidRssiForte.size} bssids >= ${RSSI_MESH_MINIMO}dBm, sem dado de OUI",
                PesoEvidencia.MEDIO,
            )
        }

        // 1. Conflito: SSID sugere mesh, mas OUI confirma papel único de gateway ISP (sem mesh)
        if (ssidIndicaMesh && ouiIndicaRoteador && !ouiIndicaMesh) {
            conflitos += ConflitoSinal(
                evidenciaA = evidenciaSsid!!,
                evidenciaB = evidenciaOui!!,
                descricao = "SSID \"${rede.ssid}\" sugere mesh, mas OUI $oui tem papel único de gateway ISP " +
                    "no catálogo (sem papel de mesh) — OUI priorizado por ser sinal de hardware.",
            )
            return montar(rede, PapelTopologia.ROTEADOR, NivelConfianca.MEDIA, evidencias, conflitos)
        }

        // 2. Conflito inverso: SSID sugere extensor, mas OUI confirma papel único de mesh dedicado
        if (ssidIndicaExtensor && ouiIndicaMesh && !ouiIndicaRoteador) {
            conflitos += ConflitoSinal(
                evidenciaA = evidenciaSsid!!,
                evidenciaB = evidenciaOui!!,
                descricao = "SSID \"${rede.ssid}\" sugere extensor, mas OUI $oui é de linha de produto mesh " +
                    "dedicada no catálogo — OUI priorizado por ser sinal de hardware.",
            )
            return montar(rede, PapelTopologia.SISTEMA_MESH_PROVAVEL, NivelConfianca.MEDIA, evidencias, conflitos)
        }

        // 3. OUI ambíguo (conflito de curadoria, ex.: Intelbras) e nó isolado — contexto resolve
        // pra ROTEADOR: sem outro nó do mesmo SSID visível, não há evidência de sistema mesh.
        if (ouiAmbiguo && grupo.size == 1 && !evidenciaEstruturalMesh && !ssidIndicaMesh) {
            return montar(rede, PapelTopologia.ROTEADOR, NivelConfianca.MEDIA, evidencias, conflitos)
        }

        // 4. Evidência de mesh concordante (hardware e/ou estrutural e/ou nome) — nunca afirma
        // qual nó é central, o papel é o mesmo pra todos os nós do grupo em evidência.
        val ouiConfirmaMeshUnico = ouiIndicaMesh && !ouiAmbiguo
        if (evidenciaEstruturalMesh || ouiConfirmaMeshUnico || ssidIndicaMesh || evidenciaRssiSemOui) {
            val sinaisConcordantes = listOf(evidenciaEstruturalMesh, ouiConfirmaMeshUnico, ssidIndicaMesh)
                .count { it }
            val confianca = if (sinaisConcordantes >= 2) NivelConfianca.ALTA else NivelConfianca.MEDIA
            return montar(rede, PapelTopologia.SISTEMA_MESH_PROVAVEL, confianca, evidencias, conflitos)
        }

        // 5. SSID indica extensor, sem conflito com OUI
        if (ssidIndicaExtensor) {
            return montar(rede, PapelTopologia.REPETIDOR, NivelConfianca.MEDIA, evidencias, conflitos)
        }

        // 6. OUI confirma papel único de gateway ISP
        if (ouiIndicaRoteador && !ouiAmbiguo) {
            val confianca = if (ouiEntry?.especificidade == EspecificidadeOui.LINHA_PRODUTO_ESPECIFICA) {
                NivelConfianca.ALTA
            } else {
                NivelConfianca.MEDIA
            }
            return montar(rede, PapelTopologia.ROTEADOR, confianca, evidencias, conflitos)
        }

        // 7. Mesmo OUI no grupo, banda NÃO repetida — um único AP físico dual/tri-band
        if (mesmoOuiNoGrupo && !bandaRepetidaNoGrupo) {
            evidencias += Evidencia(TipoEvidencia.OUI, "$oui em bandas distintas — AP único dual-band", PesoEvidencia.MEDIO)
            return montar(rede, PapelTopologia.ROTEADOR, NivelConfianca.MEDIA, evidencias, conflitos)
        }

        // 8. Grupo com OUIs diferentes pro mesmo SSID — extensor por hardware, nunca por RSSI
        if (grupo.size > 1 && ouisNoGrupo.size > 1) {
            val vizinhoComRoteadorConfirmado = grupo.any { vizinho ->
                vizinho.bssid != rede.bssid &&
                    OuiCatalog.lookup(normalizarOui(vizinho.oui))?.papeisPossiveis
                        ?.let { it.contains(PapelTopologia.ROTEADOR) && it.size == 1 } == true
            }
            return if (vizinhoComRoteadorConfirmado) {
                montar(rede, PapelTopologia.REPETIDOR, NivelConfianca.MEDIA, evidencias, conflitos)
            } else {
                evidencias += Evidencia(
                    TipoEvidencia.RSSI,
                    "${rede.rssiDbm}dBm (evidência auxiliar — RSSI não decide papel sozinho)",
                    PesoEvidencia.FRACO,
                )
                montar(rede, PapelTopologia.DESCONHECIDO, NivelConfianca.BAIXA, evidencias, conflitos)
            }
        }

        // 9. Fallback: nó isolado sem nenhum sinal de hardware ou nome
        return montar(rede, PapelTopologia.ROTEADOR, NivelConfianca.BAIXA, evidencias, conflitos)
    }

    private fun montar(
        rede: RedeVizinha,
        papel: PapelTopologia,
        confianca: NivelConfianca,
        evidencias: List<Evidencia>,
        conflitos: List<ConflitoSinal>,
    ): RedeClassificadaTopologia = RedeClassificadaTopologia(
        rede = rede,
        classificacao = ClassificacaoTopologia(
            papelProvavel = papel,
            confianca = confianca,
            evidencias = evidencias.toList(),
            origemDados = OrigemDados.SCAN_WIFI_PASSIVO,
            conflitos = conflitos.toList(),
        ),
    )

    private fun normalizarOui(oui: String): String {
        val limpo = oui.replace(":", "").replace("-", "").replace(".", "").uppercase()
        return if (limpo.length >= 6) limpo.take(6) else limpo
    }

    private fun tokenize(upper: String): Set<String> =
        upper.split(Regex("[^A-Z0-9]")).filter { it.isNotEmpty() }.toSet()
}
