package io.signallq.pro.core.designsystem

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp

private const val ANGULO_INICIAL = 135f
private const val ANGULO_VARREDURA_MAXIMO = 270f
private const val ESPESSURA_TRACO_DP = 10

/**
 * Gauge circular para a metrica dominante de uma medicao (ex.: download em Mbps) --
 * substitui grid de 6-7 cards de metrica por 1 destaque + [ListRow] expansivel pras
 * secundarias (handoff Fase 2, #1161).
 */
@Composable
fun QualityGauge(
    valorFormatado: String,
    unidade: String,
    veredito: String,
    progresso: Float,
    modifier: Modifier = Modifier,
) {
    val progressoClamped = progresso.coerceIn(0f, 1f)
    val corAtiva =
        when {
            progressoClamped >= 0.7f -> MaterialTheme.colorScheme.primary
            progressoClamped >= 0.4f -> MaterialTheme.colorScheme.tertiary
            else -> MaterialTheme.colorScheme.error
        }
    val corTrilha = MaterialTheme.colorScheme.surfaceContainerHigh

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Box(modifier = Modifier.size(160.dp), contentAlignment = Alignment.Center) {
            Canvas(modifier = Modifier.size(160.dp)) {
                val stroke = Stroke(width = ESPESSURA_TRACO_DP.dp.toPx(), cap = StrokeCap.Round)
                drawArc(
                    color = corTrilha,
                    startAngle = ANGULO_INICIAL,
                    sweepAngle = ANGULO_VARREDURA_MAXIMO,
                    useCenter = false,
                    style = stroke,
                    size = Size(size.width - stroke.width, size.height - stroke.width),
                    topLeft = Offset(stroke.width / 2, stroke.width / 2),
                )
                drawArc(
                    color = corAtiva,
                    startAngle = ANGULO_INICIAL,
                    sweepAngle = ANGULO_VARREDURA_MAXIMO * progressoClamped,
                    useCenter = false,
                    style = stroke,
                    size = Size(size.width - stroke.width, size.height - stroke.width),
                    topLeft = Offset(stroke.width / 2, stroke.width / 2),
                )
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(text = valorFormatado, style = MaterialTheme.typography.headlineMedium)
                Text(
                    text = unidade,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        Text(text = veredito, style = MaterialTheme.typography.titleMedium, color = corAtiva)
    }
}

/** Cor exposta para composables que precisem sincronizar tonalidade com o gauge (ex.: chip). */
@Composable
fun corVereditoQualidade(progresso: Float): Color =
    when {
        progresso.coerceIn(0f, 1f) >= 0.7f -> MaterialTheme.colorScheme.primary
        progresso.coerceIn(0f, 1f) >= 0.4f -> MaterialTheme.colorScheme.tertiary
        else -> MaterialTheme.colorScheme.error
    }
