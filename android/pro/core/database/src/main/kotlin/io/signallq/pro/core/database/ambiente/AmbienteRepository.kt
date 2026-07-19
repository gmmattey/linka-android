package io.signallq.pro.core.database.ambiente

import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject

class AmbienteRepository
    @Inject
    constructor(
        private val dao: AmbienteDao,
    ) {
        fun observarPorVisita(visitaId: String): Flow<List<AmbienteEntity>> = dao.observarPorVisita(visitaId)

        suspend fun buscarPorId(id: String): AmbienteEntity? = dao.buscarPorId(id)

        suspend fun criarAmbiente(
            visitaId: String,
            nome: String,
        ): String {
            val entidade =
                AmbienteEntity(
                    id = UUID.randomUUID().toString(),
                    visitaId = visitaId,
                    nome = nome,
                    criadoEmEpochMs = System.currentTimeMillis(),
                )
            dao.salvar(entidade)
            return entidade.id
        }

        suspend fun renomear(
            id: String,
            novoNome: String,
        ) {
            val atual = dao.buscarPorId(id) ?: return
            dao.atualizar(atual.copy(nome = novoNome))
        }

        suspend fun excluir(ambiente: AmbienteEntity) {
            dao.excluir(ambiente)
        }
    }
