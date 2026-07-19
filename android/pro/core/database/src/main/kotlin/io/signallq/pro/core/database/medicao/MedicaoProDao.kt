package io.signallq.pro.core.database.medicao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface MedicaoProDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvar(entidade: MedicaoProEntity)

    @Query("SELECT * FROM medicao_pro WHERE ambienteId = :ambienteId ORDER BY criadoEmEpochMs DESC")
    fun observarPorAmbiente(ambienteId: String): Flow<List<MedicaoProEntity>>

    @Query("SELECT * FROM medicao_pro WHERE ambienteId = :ambienteId ORDER BY criadoEmEpochMs DESC LIMIT 1")
    suspend fun buscarUltimaPorAmbiente(ambienteId: String): MedicaoProEntity?

    @Query("SELECT COUNT(*) FROM medicao_pro WHERE ambienteId = :ambienteId")
    suspend fun contarPorAmbiente(ambienteId: String): Int
}
