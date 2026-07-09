package io.signallq.app.core.database.recommendation

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Persistencia local de uma exibicao do `RecommendationEngine` (modulo `coreRecommendation`,
 * issue #790), usada para alimentar cooldown/limite diario/limite semanal/feedback do
 * usuario a cada nova chamada do engine (issue #812).
 *
 * Tabela: recommendation_history
 *
 * @param id chave primaria -- usa o mesmo valor de `RecommendationDecision.trackingId`
 *   (`"$recommendationId-$shownAtEpochMs"`), assim o feedback do usuario pode atualizar
 *   exatamente a exibicao correspondente sem ambiguidade entre chamadas.
 * @param recommendationId id do `Recommendation.id` do catalogo (coreRecommendation).
 * @param feedback nome do `RecommendationFeedbackType` (util/nao util/ocultar/clicou/dispensou),
 *   nulo enquanto o usuario nao deu feedback.
 */
@Entity(
    tableName = "recommendation_history",
    indices = [
        Index(value = ["shownAtEpochMs"]),
        Index(value = ["recommendationId"]),
    ],
)
data class RecommendationHistoryEntity(
    @PrimaryKey
    val id: String,
    val recommendationId: String,
    val shownAtEpochMs: Long,
    val feedback: String? = null,
    val feedbackAtEpochMs: Long? = null,
)
