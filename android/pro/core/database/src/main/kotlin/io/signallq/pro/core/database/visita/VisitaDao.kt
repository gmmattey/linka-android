package io.signallq.pro.core.database.visita

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface VisitaDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvar(entidade: VisitaEntity)

    @Query("SELECT * FROM visita WHERE id = :id LIMIT 1")
    fun observarPorId(id: String): Flow<VisitaEntity?>

    @Query("SELECT * FROM visita WHERE id = :id LIMIT 1")
    suspend fun buscarPorId(id: String): VisitaEntity?

    /** Visita interrompida mais recente -- usada para retomada ao reabrir o app (issue #1119). */
    @Query(
        "SELECT * FROM visita WHERE status = 'EM_ANDAMENTO' OR status = 'INTERROMPIDA' " +
            "ORDER BY atualizadaEmEpochMs DESC LIMIT 1",
    )
    suspend fun buscarEmAndamento(): VisitaEntity?

    @Query(
        "SELECT * FROM visita WHERE status = 'EM_ANDAMENTO' OR status = 'INTERROMPIDA' " +
            "ORDER BY atualizadaEmEpochMs DESC LIMIT 1",
    )
    fun observarEmAndamento(): Flow<VisitaEntity?>

    @Query("SELECT * FROM visita ORDER BY atualizadaEmEpochMs DESC LIMIT :limite")
    fun observarRecentes(limite: Int): Flow<List<VisitaEntity>>

    @Query("UPDATE visita SET status = :status, atualizadaEmEpochMs = :atualizadaEmEpochMs WHERE id = :id")
    suspend fun atualizarStatus(
        id: String,
        status: StatusVisita,
        atualizadaEmEpochMs: Long,
    )

    @Query("UPDATE visita SET etapaAtual = :etapa, atualizadaEmEpochMs = :atualizadaEmEpochMs WHERE id = :id")
    suspend fun atualizarEtapa(
        id: String,
        etapa: EtapaVisita,
        atualizadaEmEpochMs: Long,
    )
}
