package io.signallq.app.core.database.recommendation

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface RecommendationHistoryDao {

    /** Registra a exibicao de uma recomendacao. REPLACE por id evita duplicar a mesma decisao. */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun registrarExibicao(entrada: RecommendationHistoryEntity)

    /**
     * Historico recente, suficiente para o `RecommendationEngine` aplicar cooldown/
     * maxPerDay/maxPerWeek do catalogo atual (o maior hoje e 7 dias).
     */
    @Query("SELECT * FROM recommendation_history WHERE shownAtEpochMs >= :desdeEpochMs ORDER BY shownAtEpochMs DESC")
    suspend fun buscarRecente(desdeEpochMs: Long): List<RecommendationHistoryEntity>

    @Query(
        "UPDATE recommendation_history SET feedback = :feedback, feedbackAtEpochMs = :feedbackAtEpochMs " +
            "WHERE id = :id",
    )
    suspend fun atualizarFeedback(id: String, feedback: String, feedbackAtEpochMs: Long)
}
