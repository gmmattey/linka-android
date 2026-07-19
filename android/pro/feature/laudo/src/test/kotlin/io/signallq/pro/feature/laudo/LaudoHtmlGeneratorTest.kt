package io.signallq.pro.feature.laudo

import io.signallq.pro.core.database.diagnostico.DiagnosticoAchadoProEntity
import io.signallq.pro.core.database.diagnostico.DiagnosticoProEntity
import io.signallq.pro.core.database.evidencia.EvidenciaEntity
import io.signallq.pro.core.database.evidencia.TipoEvidencia
import io.signallq.pro.core.database.medicao.MedicaoProEntity
import io.signallq.pro.core.database.visita.TipoVisita
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * [LaudoHtmlGenerator.gerarHtml] é função pura -- sem dependência de Android/Context,
 * testada diretamente em JVM (mesma estratégia do `ExportadorHistoricoPDFTest` do
 * consumidor). Testa o caso feliz (ambiente com dado completo) e o caso negativo
 * (ambiente sem medição/diagnóstico -- laudo não pode quebrar nem esconder a ausência).
 */
class LaudoHtmlGeneratorTest {
    private fun medicao() =
        MedicaoProEntity(
            id = "medicao-1",
            ambienteId = "ambiente-1",
            modo = "wifi",
            downloadMbps = 120.5,
            uploadMbps = 40.2,
            latenciaMs = 12.0,
            jitterMs = 3.0,
            perdaPercentual = 0.5,
            criadoEmEpochMs = 1_716_000_000_000L,
        )

    private fun diagnostico() =
        DiagnosticoProEntity(
            id = "diagnostico-1",
            ambienteId = "ambiente-1",
            medicaoId = "medicao-1",
            veredito = "Bom",
            scoreConexao = 82,
            decisaoTitulo = "Conexão estável",
            decisaoMensagem = "Sem problemas relevantes.",
            geradoEmEpochMs = 1_716_000_000_000L,
        )

    private fun achadoCritico() =
        DiagnosticoAchadoProEntity(
            id = "achado-1",
            diagnosticoId = "diagnostico-1",
            titulo = "Latência elevada",
            mensagem = "Latência acima do esperado para o ambiente.",
            recomendacao = "Reposicionar o roteador.",
            status = "critical",
            principal = true,
        )

    @Test
    fun `gera html com dados completos do ambiente`() {
        val dados =
            LaudoDados(
                visitaId = "visita-1",
                profissionalNome = "João Técnico",
                clienteNome = "Maria Cliente",
                clienteTelefone = "11999999999",
                localNome = "Principal",
                localEndereco = "Rua das Flores, 123",
                tipoVisita = TipoVisita.INSTALACAO,
                dataVisitaEpochMs = 1_716_000_000_000L,
                ambientes =
                    listOf(
                        LaudoAmbienteDados(
                            nome = "Sala",
                            medicao = medicao(),
                            diagnostico = diagnostico(),
                            achados = listOf(achadoCritico()),
                            evidencias =
                                listOf(
                                    EvidenciaEntity(
                                        id = "evidencia-1",
                                        ambienteId = "ambiente-1",
                                        tipo = TipoEvidencia.NOTA,
                                        nota = "Roteador atras da TV",
                                        criadoEmEpochMs = 1_716_000_000_000L,
                                    ),
                                ),
                        ),
                    ),
            )

        val html = LaudoHtmlGenerator.gerarHtml(dados)

        assertTrue(html.contains("Maria Cliente"))
        assertTrue(html.contains("João Técnico"))
        assertTrue(html.contains("Sala"))
        assertTrue(html.contains("120.5 Mbps"))
        assertTrue(html.contains("Bom"))
        assertTrue(html.contains("Latência elevada"))
        assertTrue(html.contains("Reposicionar o roteador."))
        assertTrue(html.contains("Crítico"))
        assertTrue(html.contains("Rua das Flores, 123"))
    }

    @Test
    fun `gera html sem quebrar quando ambiente nao tem medicao nem diagnostico`() {
        val dados =
            LaudoDados(
                visitaId = "visita-2",
                profissionalNome = "João Técnico",
                clienteNome = "Cliente Sem Dado",
                clienteTelefone = null,
                localNome = "Principal",
                localEndereco = "",
                tipoVisita = TipoVisita.VISTORIA,
                dataVisitaEpochMs = 1_716_000_000_000L,
                ambientes =
                    listOf(
                        LaudoAmbienteDados(
                            nome = "Quarto",
                            medicao = null,
                            diagnostico = null,
                            achados = emptyList(),
                            evidencias = emptyList(),
                        ),
                    ),
            )

        val html = LaudoHtmlGenerator.gerarHtml(dados)

        assertTrue(html.contains("Quarto"))
        assertTrue(html.contains("Nenhuma medição registrada"))
        assertTrue(html.contains("Nenhum problema relevante identificado"))
        assertTrue(html.contains("Endereço não informado"))
        assertFalse(html.contains("null"))
    }
}
