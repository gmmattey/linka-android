package io.signallq.pro.core.database.diagnostico

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import kotlinx.coroutines.flow.Flow

data class DiagnosticoProComAchados(
    val diagnostico: DiagnosticoProEntity,
    val achados: List<DiagnosticoAchadoProEntity>,
)

@Dao
interface DiagnosticoProDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvar(entidade: DiagnosticoProEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvarAchados(achados: List<DiagnosticoAchadoProEntity>)

    @Transaction
    suspend fun salvarComAchados(
        diagnostico: DiagnosticoProEntity,
        achados: List<DiagnosticoAchadoProEntity>,
    ) {
        salvar(diagnostico)
        salvarAchados(achados)
    }

    @Query("SELECT * FROM diagnostico_pro WHERE ambienteId = :ambienteId ORDER BY geradoEmEpochMs DESC LIMIT 1")
    fun observarUltimoPorAmbiente(ambienteId: String): Flow<DiagnosticoProEntity?>

    @Query("SELECT * FROM diagnostico_achado_pro WHERE diagnosticoId = :diagnosticoId")
    fun observarAchados(diagnosticoId: String): Flow<List<DiagnosticoAchadoProEntity>>
}
