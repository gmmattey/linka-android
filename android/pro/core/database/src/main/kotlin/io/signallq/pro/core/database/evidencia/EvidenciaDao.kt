package io.signallq.pro.core.database.evidencia

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface EvidenciaDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvar(entidade: EvidenciaEntity)

    @Delete
    suspend fun excluir(entidade: EvidenciaEntity)

    @Query("SELECT * FROM evidencia WHERE ambienteId = :ambienteId ORDER BY criadoEmEpochMs ASC")
    fun observarPorAmbiente(ambienteId: String): Flow<List<EvidenciaEntity>>
}
