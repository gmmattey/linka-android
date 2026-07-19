package io.signallq.pro.core.database.cliente

import kotlinx.coroutines.flow.Flow
import java.util.UUID
import javax.inject.Inject

class ClienteRepository
    @Inject
    constructor(
        private val dao: ClienteDao,
    ) {
        fun observarClientes(): Flow<List<ClienteEntity>> = dao.observarTodos()

        suspend fun buscarPorId(id: String): ClienteEntity? = dao.buscarPorId(id)

        /** @return id do cliente criado. */
        suspend fun criarCliente(
            nome: String,
            telefone: String?,
        ): String {
            val entidade =
                ClienteEntity(
                    id = UUID.randomUUID().toString(),
                    nome = nome,
                    telefone = telefone,
                    criadoEmEpochMs = System.currentTimeMillis(),
                )
            dao.salvar(entidade)
            return entidade.id
        }
    }
