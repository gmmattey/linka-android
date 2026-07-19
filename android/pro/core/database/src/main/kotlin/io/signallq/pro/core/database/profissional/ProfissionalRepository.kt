package io.signallq.pro.core.database.profissional

import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class ProfissionalRepository
    @Inject
    constructor(
        private val dao: ProfissionalDao,
    ) {
        fun observarPerfil(): Flow<ProfissionalEntity?> = dao.observar()

        suspend fun buscarPerfil(): ProfissionalEntity? = dao.buscar()

        suspend fun salvarPerfil(
            nome: String,
            logoUri: String?,
        ) {
            val agora = System.currentTimeMillis()
            val existente = dao.buscar()
            dao.salvar(
                ProfissionalEntity(
                    nome = nome,
                    logoUri = logoUri,
                    criadoEmEpochMs = existente?.criadoEmEpochMs ?: agora,
                    atualizadoEmEpochMs = agora,
                ),
            )
        }
    }
