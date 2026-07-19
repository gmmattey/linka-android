package io.signallq.pro.core.database.ambiente

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface AmbienteDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvar(entidade: AmbienteEntity)

    @Update
    suspend fun atualizar(entidade: AmbienteEntity)

    @Delete
    suspend fun excluir(entidade: AmbienteEntity)

    @Query("SELECT * FROM ambiente WHERE visitaId = :visitaId ORDER BY criadoEmEpochMs ASC")
    fun observarPorVisita(visitaId: String): Flow<List<AmbienteEntity>>

    @Query("SELECT * FROM ambiente WHERE id = :id LIMIT 1")
    suspend fun buscarPorId(id: String): AmbienteEntity?
}
