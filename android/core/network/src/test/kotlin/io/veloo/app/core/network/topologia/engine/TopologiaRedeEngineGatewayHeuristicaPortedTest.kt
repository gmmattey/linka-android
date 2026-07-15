package io.signallq.app.core.network.topologia.engine

import io.signallq.app.core.network.contracts.topologia.PapelTopologia
import io.signallq.app.core.network.contracts.wifi.RedeVizinha
import io.signallq.app.core.network.contracts.wifi.SegurancaWifi
import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Porta os 14 casos de `InferirTipoGatewayTest.kt` (`app/GatewayHeuristica.kt`) pro
 * [TopologiaRedeEngine] novo — Fase 2A do plano de unificação (issue #975/#979).
 *
 * `GatewayHeuristica.inferirTipoGatewayPorScan` retorna um `ConnectionNodeType` (enum de UI,
 * `app/ui/ConnectionNodeType.kt`) por SSID; `TopologiaRedeEngine.classificar` retorna uma
 * [PapelTopologia] por BSSID ([io.signallq.app.core.network.contracts.topologia.ClassificacaoTopologia]).
 * A equivalência semântica usada nesta portagem é:
 * - `ConnectionNodeType.WifiRouter`   ~ [PapelTopologia.ROTEADOR]
 * - `ConnectionNodeType.WifiMesh`     ~ [PapelTopologia.SISTEMA_MESH_PROVAVEL]
 * - `ConnectionNodeType.WifiExtender` ~ [PapelTopologia.REPETIDOR]
 *
 * Threshold de RSSI (-75dBm, inclusive) e os falsos positivos de keyword (ORANGE/GRANGE/EXTERIOR)
 * são replicados sem alteração de comportamento — cobertos pelos casos (e)/(f)/(g)/(j) abaixo.
 * Os testes de `bssidCurto` do arquivo original não são portados aqui — são utilitário de
 * formatação de UI (`ui/screen/bssidCurto`), sem relação com a classificação de topologia.
 */
class TopologiaRedeEngineGatewayHeuristicaPortedTest {

    private fun rede(
        ssid: String?,
        bssid: String,
        rssi: Int,
        oui: String = "",
    ) = RedeVizinha(
        ssid = ssid,
        bssid = bssid,
        rssiDbm = rssi,
        frequenciaMhz = 2412,
        seguranca = SegurancaWifi.wpa2,
        larguraCanalMhz = null,
        oui = oui,
    )

    // ─── Testes originais ────────────────────────────────────────────────────────

    @Test
    fun `(a) 1 BSSID SSID generico retorna ROTEADOR`() {
        val redes = listOf(rede("MinhaCasa", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(b) 2 BSSIDs distintos mesmo SSID RSSI forte sem dado de OUI retorna SISTEMA_MESH_PROVAVEL`() {
        val redes = listOf(
            rede("MinhaCasa", "AA:BB:CC:DD:EE:01", -60),
            rede("MinhaCasa", "AA:BB:CC:DD:EE:02", -60),
        )
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(
            setOf(PapelTopologia.SISTEMA_MESH_PROVAVEL),
            resultado.map { it.classificacao.papelProvavel }.toSet(),
        )
    }

    @Test
    fun `(c) 2 BSSIDs distintos mesmo SSID RSSI fraco retorna ROTEADOR`() {
        val redes = listOf(
            rede("MinhaCasa", "AA:BB:CC:DD:EE:01", -80),
            rede("MinhaCasa", "AA:BB:CC:DD:EE:02", -80),
        )
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(
            setOf(PapelTopologia.ROTEADOR),
            resultado.map { it.classificacao.papelProvavel }.toSet(),
        )
    }

    @Test
    fun `(d) SSID com DECO retorna SISTEMA_MESH_PROVAVEL pela keyword de nome`() {
        val redes = listOf(rede("DECO_SALA", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.SISTEMA_MESH_PROVAVEL, resultado.first().classificacao.papelProvavel)
    }

    // ─── M3: threshold RSSI exatamente em -75 dBm ────────────────────────────────

    @Test
    fun `(e) 2 BSSIDs mesmo SSID RSSI exatamente -75 retorna SISTEMA_MESH_PROVAVEL (inclusivo)`() {
        val redes = listOf(
            rede("MinhaCasa", "AA:BB:CC:DD:EE:01", -75),
            rede("MinhaCasa", "AA:BB:CC:DD:EE:02", -75),
        )
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(
            setOf(PapelTopologia.SISTEMA_MESH_PROVAVEL),
            resultado.map { it.classificacao.papelProvavel }.toSet(),
        )
    }

    // ─── M2: falsos positivos de heurística de SSID ──────────────────────────────

    @Test
    fun `(f) SSID ORANGE nao deve ser confundido com RANGE retorna ROTEADOR`() {
        val redes = listOf(rede("ORANGE", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(g) SSID GRANGE nao deve ser confundido com RANGE retorna ROTEADOR`() {
        val redes = listOf(rede("GRANGE", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(h) SSID WIFI-RANGE-5G com token RANGE isolado retorna REPETIDOR`() {
        val redes = listOf(rede("WIFI-RANGE-5G", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.REPETIDOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(i) SSID WIFI-EXT-SALA com token EXT isolado retorna REPETIDOR`() {
        val redes = listOf(rede("WIFI-EXT-SALA", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.REPETIDOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(j) SSID EXTERIOR nao deve ser confundido com EXT retorna ROTEADOR`() {
        val redes = listOf(rede("EXTERIOR", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    // ─── Edge cases ───────────────────────────────────────────────────────────────

    @Test
    fun `(k) SSID vazio retorna ROTEADOR sem crash`() {
        val redes = listOf(rede("", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(l) SSID generico rede isolada retorna ROTEADOR`() {
        val redes = listOf(rede("MinhaCasa", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(m) SSID com keyword de extensor rede isolada retorna REPETIDOR`() {
        val redes = listOf(rede("WIFI-EXT-SALA", "AA:BB:CC:DD:EE:01", -60))
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(PapelTopologia.REPETIDOR, resultado.first().classificacao.papelProvavel)
    }

    @Test
    fun `(n) 2 entradas BSSID identico mesma rede RSSI forte retorna ROTEADOR (bssid unico nao atinge o minimo de 2)`() {
        val redes = listOf(
            rede("MinhaCasa", "AA:BB:CC:DD:EE:01", -60),
            rede("MinhaCasa", "AA:BB:CC:DD:EE:01", -60),
        )
        val resultado = TopologiaRedeEngine.classificar(redes)
        assertEquals(
            setOf(PapelTopologia.ROTEADOR),
            resultado.map { it.classificacao.papelProvavel }.toSet(),
        )
    }
}
