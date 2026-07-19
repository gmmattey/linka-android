package io.signallq.pro.core.designsystem

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

enum class RecommendationPriority { INFO, ATENCAO, CRITICO }

/**
 * Bloco problema/impacto/acao/prioridade -- usado pelo resultado de diagnostico (2.16).
 * Substitui card ad-hoc: mapeia direto de `DiagnosticResult` (:core:diagnostico).
 */
@Composable
fun RecommendationBlock(
    problema: String,
    impacto: String,
    acao: String?,
    prioridade: RecommendationPriority,
    modifier: Modifier = Modifier,
) {
    val tone =
        when (prioridade) {
            RecommendationPriority.CRITICO -> StatusChipTone.CRITICO
            RecommendationPriority.ATENCAO -> StatusChipTone.ATENCAO
            RecommendationPriority.INFO -> StatusChipTone.NEUTRO
        }
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                StatusChip(texto = rotuloPrioridade(prioridade), tone = tone)
            }
            Text(text = problema, style = MaterialTheme.typography.titleSmall)
            Text(
                text = impacto,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            if (!acao.isNullOrBlank()) {
                Text(
                    text = acao,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary,
                )
            }
        }
    }
}

private fun rotuloPrioridade(prioridade: RecommendationPriority): String =
    when (prioridade) {
        RecommendationPriority.CRITICO -> "Critico"
        RecommendationPriority.ATENCAO -> "Atencao"
        RecommendationPriority.INFO -> "Informativo"
    }
