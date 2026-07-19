package io.signallq.pro.core.database.checklist

import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class ChecklistItemRepository
    @Inject
    constructor(
        private val dao: ChecklistItemDao,
    ) {
        fun observarPorVisita(visitaId: String): Flow<List<ChecklistItemEntity>> = dao.observarPorVisita(visitaId)

        suspend fun marcarConcluido(
            id: String,
            concluido: Boolean,
        ) {
            dao.atualizarConcluido(id, concluido)
        }
    }
