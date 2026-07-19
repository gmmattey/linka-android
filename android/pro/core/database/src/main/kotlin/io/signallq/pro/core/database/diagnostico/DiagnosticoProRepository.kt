package io.signallq.pro.core.database.diagnostico

import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject

data class AchadoParaSalvar(
    val titulo: String,
    val mensagem: String,
    val recomendacao: String?,
    val status: String,
    val principal: Boolean,
)

class DiagnosticoProRepository
    @Inject
    constructor(
        private val dao: DiagnosticoProDao,
    ) {
        fun observarUltimo(ambienteId: String): Flow<DiagnosticoProEntity?> = dao.observarUltimoPorAmbiente(ambienteId)

        fun observarAchados(diagnosticoId: String): Flow<List<DiagnosticoAchadoProEntity>> = dao.observarAchados(diagnosticoId)

        suspend fun salvarResultado(
            ambienteId: String,
            medicaoId: String?,
            veredito: String,
            scoreConexao: Int,
            decisaoTitulo: String,
            decisaoMensagem: String,
            achados: List<AchadoParaSalvar>,
        ): String {
            val diagnosticoId = UUID.randomUUID().toString()
            val diagnostico =
                DiagnosticoProEntity(
                    id = diagnosticoId,
                    ambienteId = ambienteId,
                    medicaoId = medicaoId,
                    veredito = veredito,
                    scoreConexao = scoreConexao,
                    decisaoTitulo = decisaoTitulo,
                    decisaoMensagem = decisaoMensagem,
                    geradoEmEpochMs = System.currentTimeMillis(),
                )
            val achadosEntities =
                achados.map { achado ->
                    DiagnosticoAchadoProEntity(
                        id = UUID.randomUUID().toString(),
                        diagnosticoId = diagnosticoId,
                        titulo = achado.titulo,
                        mensagem = achado.mensagem,
                        recomendacao = achado.recomendacao,
                        status = achado.status,
                        principal = achado.principal,
                    )
                }
            dao.salvarComAchados(diagnostico, achadosEntities)
            return diagnosticoId
        }
    }
