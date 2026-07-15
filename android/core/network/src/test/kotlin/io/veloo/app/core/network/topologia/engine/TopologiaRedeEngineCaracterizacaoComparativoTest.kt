package io.signallq.app.core.network.topologia.engine

import io.signallq.app.core.network.contracts.topologia.NivelConfianca
import io.signallq.app.core.network.contracts.topologia.PapelTopologia
import io.signallq.app.core.network.contracts.wifi.RedeVizinha
import io.signallq.app.core.network.contracts.wifi.SegurancaWifi
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Roda os MESMOS fixtures de [io.signallq.app.feature.wifi.TopologiaCaracterizacaoTest] (Fase
 * Preparação, issue #976) contra o [TopologiaRedeEngine] NOVO (Fase 2A, issue #979), documentando
 * toda divergência de comportamento em relação ao motor antigo (`TopologiaWifiEngine`).
 *
 * **Nenhuma divergência aqui foi decidida como "regressão" ou "melhoria" por conta própria** —
 * são só relatadas, com o motivo técnico da mudança, pra revisão humana (ver comentário na issue
 * #979). Ver PR desta issue pro resumo consolidado das divergências.
 *
 * Resumo das divergências encontradas (5 cenários da Preparação + 1 cenário adicional de OUI
 * "mesmo fabricante do gateway" herdado de [io.signallq.app.core.network.topologia.oui.OuiCatalogTest]):
 *
 * 1. Mesh real (3 nós Deco, banda repetida, conectado) — DIVERGE. Motor antigo dava
 *    `ROTEADOR_MESH` (ALTA) pro BSSID conectado e `NO_MESH` (ALTA) pros outros — afirmava qual nó
 *    era "principal". Motor novo dá `SISTEMA_MESH_PROVAVEL` (ALTA) pros 3, uniformemente — é
 *    exatamente a correção exigida pela regra de segurança do item 3 da issue #979 (nunca
 *    sintetizar nó central sem 2ª rota IP). Mudança intencional, não é regressão.
 * 2. Roteador único dual-band (mesmo OUI, banda não repetida) — NÃO DIVERGE. Ambos os motores
 *    dão `ROTEADOR`, confiança MEDIA pros dois BSSIDs.
 * 3. Extensor (OUI diferente do principal, decidido por RSSI mais forte) — DIVERGE. Motor antigo
 *    usava o RSSI mais forte do grupo pra "adivinhar" qual é o roteador principal (`ROTEADOR`) e
 *    qual é o repetidor (`REPETIDOR`), ambos confiança MEDIA. Motor novo NUNCA decide papel por
 *    RSSI (aviso explícito da revisão do plano) — como nenhum dos dois OUIs sintéticos deste
 *    teste está confirmado no catálogo, os dois ficam `DESCONHECIDO` (BAIXA), com o RSSI só como
 *    evidência auxiliar registrada, não usada pra decisão. Mudança intencional.
 * 4. Múltiplos APs cabeados (SSIDs diferentes, não é mesh) — NÃO DIVERGE. Ambos os motores dão
 *    `ROTEADOR` (BAIXA) pros 3 isolados.
 * 5. Conflito de curadoria Intelbras (OUI isolado, cadastrado como mesh E gateway ISP) — DIVERGE.
 *    Motor antigo tinha o `BUG CONHECIDO` documentado explicitamente na caracterização:
 *    `ROTEADOR_MESH` (ALTA) pra um roteador Intelbras standalone, só por causa da ordem dos `if`s
 *    (checava `isMeshNo` antes de `isGatewayIsp`). Motor novo usa o contexto (nó isolado, sem
 *    evidência de grupo) pra resolver a ambiguidade do catálogo em `ROTEADOR` (MEDIA) — é
 *    exatamente o que o `OuiEntry`/`OuiCatalog` da Fase 1 foi desenhado pra permitir ("a decisão
 *    de qual papel vale em cada contexto pertence ao motor de topologia"). Corrige o bug
 *    documentado, mas é uma mudança de comportamento e por isso está sendo reportada, não
 *    decidida silenciosamente.
 * 6. "Mesmo fabricante do gateway, mas não é o gateway" (OUI Intelbras genérico 00E09F, sem papel
 *    de topologia no catálogo) — NÃO DIVERGE (motor antigo não tinha equivalente direto porque
 *    não existia um catálogo único; o resultado do motor novo é o fallback neutro de sempre —
 *    `ROTEADOR` BAIXA — sem nenhuma promoção de confiança por causa da marca).
 */
class TopologiaRedeEngineCaracterizacaoComparativoTest {

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

    // ─── 1. Mesh real: DIVERGE (correção intencional da regra de segurança) ─────────

    @Test
    fun `DIVERGENCIA - mesh real 3 nos mesmo OUI Deco banda repetida - todos ficam SISTEMA_MESH_PROVAVEL nenhum e central`() {
        val ouiDeco = "50C7BF"
        val bssidPrincipal = "50:C7:BF:00:00:01"
        val redes = listOf(
            rede(ssid = "CasaSilva", bssid = bssidPrincipal, oui = ouiDeco, frequenciaMhz = 2412, rssiDbm = -50),
            rede(ssid = "CasaSilva", bssid = "50:C7:BF:00:00:02", oui = ouiDeco, frequenciaMhz = 2412, rssiDbm = -65),
            rede(ssid = "CasaSilva", bssid = "50:C7:BF:00:00:03", oui = ouiDeco, frequenciaMhz = 2412, rssiDbm = -72),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes, connectedBssid = bssidPrincipal)

        assertEquals(3, resultado.size)
        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.SISTEMA_MESH_PROVAVEL })
        assertTrue(resultado.all { it.classificacao.confianca == NivelConfianca.ALTA })
        // Motor antigo (baseline): principal=ROTEADOR_MESH, secundarios=NO_MESH — ver
        // TopologiaCaracterizacaoTest para o comportamento documentado.
    }

    // ─── 2. Roteador dual-band: NÃO DIVERGE ─────────────────────────────────────────

    @Test
    fun `sem divergencia - roteador dual-band 2_4 e 5GHz mesmo OUI banda nao repetida retorna ROTEADOR MEDIA para as duas bandas`() {
        val ouiGenerico = "1122AA"
        val redes = listOf(
            rede(ssid = "CasaDual", bssid = "11:22:AA:00:00:01", oui = ouiGenerico, frequenciaMhz = 2412),
            rede(ssid = "CasaDual", bssid = "11:22:AA:00:00:02", oui = ouiGenerico, frequenciaMhz = 5180),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(2, resultado.size)
        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.ROTEADOR })
        assertTrue(resultado.all { it.classificacao.confianca == NivelConfianca.MEDIA })
    }

    // ─── 3. Extensor por RSSI: DIVERGE (RSSI nunca decide papel sozinho) ────────────

    @Test
    fun `DIVERGENCIA - extensor mesmo SSID OUI diferente sem confirmacao no catalogo - RSSI nao decide mais fica DESCONHECIDO`() {
        val ouiRoteador = "1122AA"
        val ouiExtensor = "334455"
        val bssidRoteador = "11:22:AA:00:00:01"
        val bssidExtensor = "33:44:55:00:00:01"
        val redes = listOf(
            rede(ssid = "CasaSilva", bssid = bssidRoteador, oui = ouiRoteador, rssiDbm = -50),
            rede(ssid = "CasaSilva", bssid = bssidExtensor, oui = ouiExtensor, rssiDbm = -70),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(2, resultado.size)
        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.DESCONHECIDO })
        assertTrue(resultado.all { it.classificacao.confianca == NivelConfianca.BAIXA })
        // Motor antigo (baseline): sinal mais forte (-50) vira ROTEADOR MEDIA, o outro
        // REPETIDOR MEDIA — decisão só por RSSI, exatamente o padrão que a revisão do plano
        // veta explicitamente ("o de maior RSSI deve ser o central" é proibido).
    }

    // ─── 4. Múltiplos APs cabeados: NÃO DIVERGE ─────────────────────────────────────

    @Test
    fun `sem divergencia - multiplos APs cabeados com SSIDs diferentes cada um vira ROTEADOR isolado`() {
        val redes = listOf(
            rede(ssid = "Escritorio-A", bssid = "AA:AA:AA:00:00:01", oui = "AAAAAA"),
            rede(ssid = "Escritorio-B", bssid = "BB:BB:BB:00:00:01", oui = "BBBBBB"),
            rede(ssid = "Escritorio-C", bssid = "CC:CC:CC:00:00:01", oui = "CCCCCC"),
        )

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(3, resultado.size)
        assertTrue(resultado.none {
            it.classificacao.papelProvavel == PapelTopologia.SISTEMA_MESH_PROVAVEL ||
                it.classificacao.papelProvavel == PapelTopologia.REPETIDOR
        })
        assertTrue(resultado.all { it.classificacao.papelProvavel == PapelTopologia.ROTEADOR })
        assertTrue(resultado.all { it.classificacao.confianca == NivelConfianca.BAIXA })
    }

    // ─── 5. Conflito Intelbras isolado: DIVERGE (corrige BUG CONHECIDO) ─────────────

    @Test
    fun `DIVERGENCIA - roteador Intelbras isolado C46E1F resolve para ROTEADOR nao mais o bug ROTEADOR_MESH`() {
        val redes = listOf(rede(ssid = "MinhaCasaIntelbras", bssid = "C4:6E:1F:00:00:01", oui = "C46E1F"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(1, resultado.size)
        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
        // Motor antigo (baseline, documentado como BUG CONHECIDO em TopologiaCaracterizacaoTest):
        // ROTEADOR_MESH ALTA — causado pela ordem dos ifs (isMeshNo checado antes de
        // isGatewayIsp). Motor novo resolve pelo contexto: sem grupo, sem evidência de múltiplos
        // nós, o papel único possível dado o que se vê é ROTEADOR.
    }

    @Test
    fun `DIVERGENCIA - roteador Intelbras isolado 6C5AB0 tambem resolve para ROTEADOR`() {
        val redes = listOf(rede(ssid = "OutraCasaIntelbras", bssid = "6C:5A:B0:00:00:01", oui = "6C5AB0"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
    }

    // ─── 6. Mesmo fabricante do gateway, mas não é o gateway: NÃO DIVERGE ───────────

    @Test
    fun `sem divergencia - OUI Intelbras generico 00E09F sem papel no catalogo nao e promovido a gateway`() {
        // 00E09F é um bloco Intelbras que NÃO está em papeisPossiveis nenhum papel de topologia
        // (ver OuiCatalogTest, Fase 1) — dispositivo comum da marca, não roteador/mesh.
        val redes = listOf(rede(ssid = "RedeGenerica", bssid = "00:E0:9F:AA:BB:CC", oui = "00E09F"))

        val resultado = TopologiaRedeEngine.classificar(redes = redes)

        assertEquals(PapelTopologia.ROTEADOR, resultado.first().classificacao.papelProvavel)
        assertEquals(NivelConfianca.BAIXA, resultado.first().classificacao.confianca)
        assertTrue(resultado.first().classificacao.evidencias.isEmpty())
    }
}
