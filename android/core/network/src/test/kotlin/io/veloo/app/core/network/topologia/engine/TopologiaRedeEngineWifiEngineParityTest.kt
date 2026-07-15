package io.signallq.app.core.network.topologia.engine

import io.signallq.app.core.network.contracts.topologia.NivelConfianca
import io.signallq.app.core.network.contracts.topologia.PapelTopologia
import io.signallq.app.core.network.contracts.wifi.RedeVizinha
import io.signallq.app.core.network.contracts.wifi.SegurancaWifi
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Porta os fixtures de `TopologiaWifiEngineTest.kt` (`feature/wifi`) pro [TopologiaRedeEngine]
 * novo — Fase 2A do plano de unificação (issue #975/#979).
 *
 * **Divergência documentada e intencional** nos testes 2/3/3c: o motor antigo (`TopologiaWifiEngine`)
 * atribuía `ROTEADOR_MESH` ao BSSID conectado (afirmando que ele é o "nó principal" do sistema
 * mesh) e `NO_MESH` aos demais. Isso é exatamente o padrão que a regra de segurança do item 3 da
 * issue #979 proíbe: sem uma 2ª rota IP visível (que este motor não recebe — só scan Wi-Fi), não
 * há como confirmar qual nó é central. O motor novo dá [PapelTopologia.SISTEMA_MESH_PROVAVEL]
 * pra TODOS os nós do grupo em evidência de mesh, uniformemente — nunca promove o conectado (nem
 * o de maior RSSI) a um papel afirmativo de roteador. Este é o motivo #1 de existir a Fase 2A;
 * não é um bug, é a correção que o épico pede. Os testes 1/3b/4 não divergem.
 */
class TopologiaRedeEngineWifiEngineParityTest {

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

    // ─── Teste 1 — rede única sem OUI mesh → ROTEADOR (sem divergência) ─────────────

    @Test
    fun `sem divergencia - classificar rede unica sem OUI mesh retorna ROTEADOR`() {
        val redes = listOf(rede(ssid = "CasaDoZe", bssid = "AA:BB:CC:11:22:33", oui = "AABBCC"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = null)

        assertEquals(1, resultado.size)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    // ─── Teste 2 — DIVERGE: OUI mesh + conectado NÃO vira mais papel "central" ──────

    @Test
    fun `DIVERGENCIA - OUI Google Nest WiFi conectado nao vira mais ROTEADOR_MESH - vira SISTEMA_MESH_PROVAVEL`() {
        val bssidConectado = "F4:F5:D8:AA:BB:CC"
        val redes = listOf(rede(ssid = "GoogleHome", bssid = bssidConectado, oui = "F4F5D8"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = bssidConectado)

        assertEquals(1, resultado.size)
        assertEquals(PapelTopologia.SISTEMA_MESH_PROVAVEL, resultado.first().classificacao.papelProvavel)
        assertEquals(NivelConfianca.MEDIA, resultado.first().classificacao.confianca)
        // Baseline antigo: ROTEADOR_MESH, ALTA — enum nem existe mais no contrato novo.
    }

    // ─── Teste 3 — DIVERGE: OUI mesh não conectado também não sobra como NO_MESH puro ──

    @Test
    fun `DIVERGENCIA - OUI TP-Link Deco nao conectado tambem vira SISTEMA_MESH_PROVAVEL nao mais NO_MESH`() {
        val bssidConectado = "AA:BB:CC:00:00:01"
        val redes = listOf(rede(ssid = "DecoRede", bssid = "50:C7:BF:AA:BB:CC", oui = "50C7BF"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = bssidConectado)

        assertEquals(1, resultado.size)
        assertEquals(PapelTopologia.SISTEMA_MESH_PROVAVEL, resultado.first().classificacao.papelProvavel)
        // Baseline antigo: NO_MESH, ALTA.
    }

    // ─── Teste 3b — dual-band único (sem divergência) ────────────────────────────────

    @Test
    fun `sem divergencia - dual-band do mesmo AP nao retorna mesh`() {
        val oui = "AABBCC"
        val redes = listOf(
            rede(ssid = "CasaDual", bssid = "AA:BB:CC:00:00:01", oui = oui, frequenciaMhz = 2412),
            rede(ssid = "CasaDual", bssid = "AA:BB:CC:00:00:02", oui = oui, frequenciaMhz = 5180),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = null)

        assertEquals(2, resultado.size)
        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.ROTEADOR })
    }

    // ─── Teste 3c — DIVERGE: mesh com banda repetida vira SISTEMA_MESH_PROVAVEL uniforme ─

    @Test
    fun `DIVERGENCIA - mesmo OUI com banda repetida retorna SISTEMA_MESH_PROVAVEL para os dois nao mais NO_MESH`() {
        val oui = "AABBCC"
        val redes = listOf(
            rede(ssid = "CasaMesh", bssid = "AA:BB:CC:00:00:01", oui = oui, frequenciaMhz = 2412),
            rede(ssid = "CasaMesh", bssid = "AA:BB:CC:00:00:02", oui = oui, frequenciaMhz = 2412),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = null)

        assertEquals(2, resultado.size)
        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.SISTEMA_MESH_PROVAVEL })
        // Baseline antigo: NO_MESH, ALTA, pros dois — direção igual (mesh), granularidade
        // (enum) diferente por causa da correção da regra de segurança.
    }

    // ─── Teste 4 — lista vazia (sem divergência) ─────────────────────────────────────

    @Test
    fun `sem divergencia - classificar lista vazia retorna lista vazia sem lancar excecao`() {
        val resultado = TopologiaRedeEngine.classificar(redes = emptyList(), connectedBssid = null)
        assertTrue(resultado.isEmpty())
    }

    // Nota: `TopologiaWifiEngine.agrupar()` (agrupamento por SSID pra exibição, ordenado por
    // RSSI) não foi portado — é lógica de apresentação/UI (`GrupoRedeWifi`), não de
    // classificação de topologia, e a Fase 2A não tem nenhum consumidor de UI ainda (critério de
    // saída explícito da fase). Fica pra quando a Fase 2B definir a necessidade real de
    // agrupamento de cada tela consumidora.
}
