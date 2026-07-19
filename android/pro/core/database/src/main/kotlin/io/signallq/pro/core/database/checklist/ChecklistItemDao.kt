package io.signallq.pro.core.database.checklist

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ChecklistItemDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvarTodos(itens: List<ChecklistItemEntity>)

    @Query("UPDATE checklist_item SET concluido = :concluido WHERE id = :id")
    suspend fun atualizarConcluido(
        id: String,
        concluido: Boolean,
    )

    @Query("SELECT * FROM checklist_item WHERE visitaId = :visitaId ORDER BY ordem ASC")
    fun observarPorVisita(visitaId: String): Flow<List<ChecklistItemEntity>>
}
