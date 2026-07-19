package io.signallq.pro.core.database.medicao

import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject

class MedicaoProRepository
    @Inject
    constructor(
        private val dao: MedicaoProDao,
    ) {
        fun observarPorAmbiente(ambienteId: String): Flow<List<MedicaoProEntity>> = dao.observarPorAmbiente(ambienteId)

        suspend fun buscarUltima(ambienteId: String): MedicaoProEntity? = dao.buscarUltimaPorAmbiente(ambienteId)

        suspend fun temMedicaoValida(ambienteId: String): Boolean = dao.contarPorAmbiente(ambienteId) > 0

        /** @return id da medição salva. Nunca salva resultado inválido/contaminado como válido
         *  (handoff Fase 2, #1161: "medição inválida não salva como resultado válido"). */
        suspend fun salvarMedicaoValida(
            ambienteId: String,
            modo: String,
            downloadMbps: Double,
            uploadMbps: Double,
            latenciaMs: Double,
            jitterMs: Double,
            perdaPercentual: Double,
        ): String {
            val entidade =
                MedicaoProEntity(
                    id = UUID.randomUUID().toString(),
                    ambienteId = ambienteId,
                    modo = modo,
                    downloadMbps = downloadMbps,
                    uploadMbps = uploadMbps,
                    latenciaMs = latenciaMs,
                    jitterMs = jitterMs,
                    perdaPercentual = perdaPercentual,
                    criadoEmEpochMs = System.currentTimeMillis(),
                )
            dao.salvar(entidade)
            return entidade.id
        }
    }
