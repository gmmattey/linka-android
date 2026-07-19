package io.signallq.pro.core.designsystem

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

/**
 * Chip semantico -- uso restrito a status real (tipo de visita, veredito de medicao,
 * prioridade de recomendacao). Nunca decorativo (handoff Fase 2, #1161).
 */
enum class StatusChipTone { NEUTRO, POSITIVO, ATENCAO, CRITICO }

@Composable
fun StatusChip(
    texto: String,
    tone: StatusChipTone,
    modifier: Modifier = Modifier,
) {
    val (container, content) = tonalidade(tone)
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(999.dp),
        color = container,
    ) {
        Text(
            text = texto,
            style = MaterialTheme.typography.labelMedium,
            color = content,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
        )
    }
}

@Composable
private fun tonalidade(tone: StatusChipTone): Pair<Color, Color> =
    when (tone) {
        StatusChipTone.NEUTRO ->
            MaterialTheme.colorScheme.surfaceContainerHigh to MaterialTheme.colorScheme.onSurfaceVariant
        StatusChipTone.POSITIVO ->
            MaterialTheme.colorScheme.primaryContainer to MaterialTheme.colorScheme.primary
        StatusChipTone.ATENCAO ->
            MaterialTheme.colorScheme.tertiaryContainer to MaterialTheme.colorScheme.tertiary
        StatusChipTone.CRITICO ->
            MaterialTheme.colorScheme.errorContainer to MaterialTheme.colorScheme.error
    }
