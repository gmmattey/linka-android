package io.signallq.pro.core.database.evidencia

import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject

class EvidenciaRepository
    @Inject
    constructor(
        private val dao: EvidenciaDao,
    ) {
        fun observarPorAmbiente(ambienteId: String): Flow<List<EvidenciaEntity>> = dao.observarPorAmbiente(ambienteId)

        suspend fun adicionarFoto(
            ambienteId: String,
            uriFoto: String,
        ) {
            dao.salvar(
                EvidenciaEntity(
                    id = UUID.randomUUID().toString(),
                    ambienteId = ambienteId,
                    tipo = TipoEvidencia.FOTO,
                    uriFoto = uriFoto,
                    criadoEmEpochMs = System.currentTimeMillis(),
                ),
            )
        }

        suspend fun adicionarNota(
            ambienteId: String,
            nota: String,
        ) {
            dao.salvar(
                EvidenciaEntity(
                    id = UUID.randomUUID().toString(),
                    ambienteId = ambienteId,
                    tipo = TipoEvidencia.NOTA,
                    nota = nota,
                    criadoEmEpochMs = System.currentTimeMillis(),
                ),
            )
        }

        suspend fun excluir(evidencia: EvidenciaEntity) {
            dao.excluir(evidencia)
        }
    }
