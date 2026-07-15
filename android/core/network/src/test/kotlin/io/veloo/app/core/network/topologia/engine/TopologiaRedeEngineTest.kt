package io.signallq.app.core.network.topologia.engine

import io.signallq.app.core.network.contracts.topologia.NivelConfianca
import io.signallq.app.core.network.contracts.topologia.PapelTopologia
import io.signallq.app.core.network.contracts.wifi.RedeVizinha
import io.signallq.app.core.network.contracts.wifi.SegurancaWifi
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Testes de [TopologiaRedeEngine] — Fase 2A do plano de unificação de topologia
 * (issue #975/#979). Cobre a cascata de decisão isolada (sem comparar com os motores antigos —
 * isso fica em [TopologiaRedeEngineCaracterizacaoComparativoTest] e
 * [TopologiaRedeEngineGatewayHeuristicaPortedTest]) e, especialmente, a regra crítica de
 * segurança: nunca sintetizar um nó "roteador central" afirmativo num sistema mesh.
 */
class TopologiaRedeEngineTest {

    private fun rede(
        ssid: String? = "MinhaRede",
        bssid: String = "AA:BB:CC:DD:EE:FF",
        rssiDbm: Int = -60,
        oui: String = "",
        frequenciaMhz: Int = 2412,
    ) = RedeVizinha(
        ssid = ssid,
        bssid = bssid,
        rssiDbm = rssiDbm,
        frequenciaMhz = frequenciaMhz,
        seguranca = SegurancaWifi.wpa2,
        larguraCanalMhz = 20,
        oui = oui,
    )

    // ─── Regra crítica de segurança (requisito mais importante da Fase 2A) ──────────

    @Test
    fun `mesh detectado so por scan Wi-Fi sem 2a rota IP nunca sintetiza no central - todos os nos ficam SISTEMA_MESH_PROVAVEL`() {
        val ouiDeco = "50C7BF"
        val bssidComMaiorRssi = "50:C7:BF:00:00:01"
        val redes = listOf(
            rede(ssid = "CasaSilva", bssid = bssidComMaiorRssi, oui = ouiDeco, frequenciaMhz = 2412, rssiDbm = -40),
            rede(ssid = "CasaSilva", bssid = "50:C7:BF:00:00:02", oui = ouiDeco, frequenciaMhz = 2412, rssiDbm = -65),
            rede(ssid = "CasaSilva", bssid = "50:C7:BF:00:00:03", oui = ouiDeco, frequenciaMhz = 2412, rssiDbm = -72),
        )

        // connectedBssid é justamente o de maior RSSI — a tentação clássica de "achar" que é o
        // central. O motor não pode usar isso pra afirmar ROTEADOR.
        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = bssidComMaiorRssi)

        assertEquals(3, resultado.size)
        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.SISTEMA_MESH_PROVAVEL })
        assertTrue(resultado.none { it.classificacao.papelProvavel == PapelTopologia.ROTEADOR })
        // Nenhum papel do enum afirma "central" como fato.
        assertTrue(PapelTopologia.entries.none { it.name.contains("CENTRAL") })
    }

    @Test
    fun `nenhum no do grupo mesh recebe papel diferente dos demais - simetria entre os nos`() {
        val ouiEero = "F4F5E8"
        val redes = listOf(
            rede(ssid = "EeroCasa", bssid = "F4:F5:E8:00:00:01", oui = ouiEero, rssiDbm = -30),
            rede(ssid = "EeroCasa", bssid = "F4:F5:E8:00:00:02", oui = ouiEero, rssiDbm = -80),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = "F4:F5:E8:00:00:01")

        val papeis = resultado.map { it.classificacao.papelProvavel }.toSet()
        assertEquals(setOf(PapelTopologia.SISTEMA_MESH_PROVAVEL), papeis)
    }

    // ─── Casos novos exigidos pelo plano ─────────────────────────────────────────────

    @Test
    fun `SSID com keyword mesh e OUI desconhecido no catalogo ainda classifica como mesh`() {
        val redes = listOf(rede(ssid = "DECO_SALA", bssid = "11:22:33:00:00:01", oui = "112233"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(PapelTopologia.SISTEMA_MESH_PROVAVEL, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `SSID generico sem keyword mas OUI de fabricante mesh conhecido Eero classifica como mesh mesmo sem keyword`() {
        val ouiEero = "F4F5E8"
        val redes = listOf(rede(ssid = "MinhaCasaComum", bssid = "F4:F5:E8:00:00:01", oui = ouiEero))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(PapelTopologia.SISTEMA_MESH_PROVAVEL, resultado.first().classificacao.papelProvavel)
    }

    // ─── Cascata: conflito SSID x OUI ────────────────────────────────────────────────

    @Test
    fun `SSID diz mesh mas OUI confirma gateway ISP puro - OUI prioriza e vira ROTEADOR com conflito registrado`() {
        // ZTE (2C26C5) só tem papel ROTEADOR no catalogo, nunca NO_MESH.
        val redes = listOf(rede(ssid = "CASA_MESH_5G", bssid = "2C:26:C5:00:00:01", oui = "2C26C5"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)
        val classificacao = resultado.first().classificacao

        assertEquals(PapelTopologia.ROTEADOR, classificacao.papelProvavel)
        assertEquals(1, classificacao.conflitos.size)
    }

    @Test
    fun `SSID diz extensor mas OUI confirma mesh dedicado - OUI prioriza e vira mesh com conflito registrado`() {
        // TP-Link Deco (50C7BF) só tem papel NO_MESH no catalogo, nunca ROTEADOR.
        val redes = listOf(rede(ssid = "WIFI-EXT-SALA", bssid = "50:C7:BF:00:00:01", oui = "50C7BF"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)
        val classificacao = resultado.first().classificacao

        assertEquals(PapelTopologia.SISTEMA_MESH_PROVAVEL, classificacao.papelProvavel)
        assertEquals(1, classificacao.conflitos.size)
    }

    // ─── Cascata: OUI e SSID concordam -> confianca ALTA ─────────────────────────────

    @Test
    fun `OUI e SSID concordam em mesh - confianca sobe para ALTA`() {
        val redes = listOf(rede(ssid = "DECO_SALA", bssid = "50:C7:BF:00:00:01", oui = "50C7BF"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)
        val classificacao = resultado.first().classificacao

        assertEquals(PapelTopologia.SISTEMA_MESH_PROVAVEL, classificacao.papelProvavel)
        assertEquals(NivelConfianca.ALTA, classificacao.confianca)
    }

    // ─── Cascata: extensor por hardware, sem RSSI decidindo ──────────────────────────

    @Test
    fun `grupo com OUIs diferentes sem nenhum confirmado no catalogo nao decide por RSSI - fica DESCONHECIDO`() {
        val redes = listOf(
            rede(ssid = "CasaSilva", bssid = "11:22:AA:00:00:01", oui = "1122AA", rssiDbm = -40),
            rede(ssid = "CasaSilva", bssid = "33:44:55:00:00:01", oui = "334455", rssiDbm = -85),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.DESCONHECIDO })
        assertTrue(resultado.none { it.classificacao.papelProvavel == PapelTopologia.ROTEADOR })
    }

    @Test
    fun `grupo com OUI diferente mas um deles confirmado gateway ISP - o outro vira REPETIDOR por hardware nao por RSSI`() {
        val redes = listOf(
            rede(ssid = "CasaSilva", bssid = "2C:26:C5:00:00:01", oui = "2C26C5", rssiDbm = -85), // ZTE, ROTEADOR confirmado, RSSI fraco
            rede(ssid = "CasaSilva", bssid = "33:44:55:00:00:01", oui = "334455", rssiDbm = -40), // OUI desconhecido, RSSI forte
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes)
        val roteador = resultado.first { it.rede.oui == "2C26C5" }
        val repetidor = resultado.first { it.rede.oui == "334455" }

        // O de RSSI mais forte NÃO vira roteador só por isso — hardware decide.
        assertEquals(PapelTopologia.ROTEADOR, roteador.classificacao.papelProvavel)
        assertEquals(PapelTopologia.REPETIDOR, repetidor.classificacao.papelProvavel)
    }

    // ─── Conflito de curadoria Intelbras — isolado vs. agrupado ──────────────────────

    @Test
    fun `OUI ambiguo Intelbras isolado sem grupo resolve para ROTEADOR nao mesh - corrige bug conhecido`() {
        val redes = listOf(rede(ssid = "MinhaCasaIntelbras", bssid = "C4:6E:1F:00:00:01", oui = "C46E1F"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `OUI ambiguo Intelbras agrupado com banda repetida resolve para SISTEMA_MESH_PROVAVEL`() {
        val redes = listOf(
            rede(ssid = "CasaIntelbrasMesh", bssid = "C4:6E:1F:00:00:01", oui = "C46E1F", frequenciaMhz = 2412),
            rede(ssid = "CasaIntelbrasMesh", bssid = "C4:6E:1F:00:00:02", oui = "C46E1F", frequenciaMhz = 2412),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.SISTEMA_MESH_PROVAVEL })
    }

    // ─── Casos triviais ───────────────────────────────────────────────────────────────

    @Test
    fun `lista vazia retorna lista vazia sem excecao`() {
        assertTrue(TopologiaRedeEngine.classificar(redes = emptyList()).isEmpty())
    }

    @Test
    fun `rede isolada sem nenhum sinal retorna ROTEADOR confianca BAIXA`() {
        val redes = listOf(rede(ssid = "CasaDoZe", bssid = "AA:BB:CC:11:22:33", oui = "AABBCC"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
        assertEquals(NivelConfianca.BAIXA, resultado.first().classificacao.confianca)
    }
}
