package io.signallq.pro.core.designsystem

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp

private val TAMANHO_CONTAINER_LEADING = 40.dp
private val TAMANHO_ICONE_LEADING = 20.dp

/**
 * Linha de lista densa (ícone + texto + conteúdo final) -- padrão para permissões,
 * checklist e itens de menu do Pro. Preferida a "1 card por item" (handoff Fase 2, #1161)
 * porque técnico rola muitas listas em campo. Leading icon vem num container circular
 * 40x40dp (secondaryContainer/onSecondaryContainer) -- snapshot 2026-07-19 do CSS real do
 * design system, não ícone solto sem fundo.
 */
@Composable
fun ListRow(
    titulo: String,
    modifier: Modifier = Modifier,
    subtitulo: String? = null,
    icone: ImageVector? = null,
    onClick: (() -> Unit)? = null,
    trailing: @Composable (() -> Unit)? = null,
) {
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .let { if (onClick != null) it.clickable(onClick = onClick) else it }
                .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (icone != null) {
            Box(
                modifier =
                    Modifier
                        .size(TAMANHO_CONTAINER_LEADING)
                        .background(MaterialTheme.colorScheme.secondaryContainer, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = icone,
                    contentDescription = null,
                    modifier = Modifier.size(TAMANHO_ICONE_LEADING),
                    tint = MaterialTheme.colorScheme.onSecondaryContainer,
                )
            }
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(text = titulo, style = MaterialTheme.typography.bodyLarge)
            if (subtitulo != null) {
                Text(
                    text = subtitulo,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        trailing?.invoke()
    }
}
