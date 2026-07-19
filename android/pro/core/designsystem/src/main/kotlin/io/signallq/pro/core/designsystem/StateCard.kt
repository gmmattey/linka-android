package io.signallq.pro.core.designsystem

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.CloudOff
import androidx.compose.material.icons.outlined.ErrorOutline
import androidx.compose.material.icons.outlined.Inbox
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp

/**
 * Variante semantica do [StateCard] -- cobre os 4 estados transversais do Grupo 6 do
 * prototipo do Pro (vazio / carregando / erro recuperavel/offline / sucesso). Toda feature
 * consome este componente em vez de reimplementar o proprio estado (handoff Fase 2, #1161).
 */
enum class StateCardVariant { VAZIO, CARREGANDO, ERRO, SUCESSO }

/**
 * Card unico para representar um estado transversal (vazio/erro/carregando/sucesso).
 * Nunca duplicar com banner/ilustracao adicional na mesma tela para o mesmo estado.
 */
@Composable
fun StateCard(
    variant: StateCardVariant,
    titulo: String,
    mensagem: String,
    modifier: Modifier = Modifier,
    acaoTexto: String? = null,
    onAcaoClick: (() -> Unit)? = null,
    icone: ImageVector? = null,
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceContainerHigh,
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            when (variant) {
                StateCardVariant.CARREGANDO ->
                    CircularProgressIndicator(modifier = Modifier.size(32.dp))
                else ->
                    Icon(
                        imageVector = icone ?: iconePadrao(variant),
                        contentDescription = null,
                        modifier = Modifier.size(32.dp),
                        tint = corIcone(variant),
                    )
            }
            Text(text = titulo, style = MaterialTheme.typography.titleMedium)
            Text(
                text = mensagem,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            if (acaoTexto != null && onAcaoClick != null) {
                Button(onClick = onAcaoClick) {
                    Text(acaoTexto)
                }
            }
        }
    }
}

private fun iconePadrao(variant: StateCardVariant): ImageVector =
    when (variant) {
        StateCardVariant.VAZIO -> Icons.Outlined.Inbox
        StateCardVariant.ERRO -> Icons.Outlined.ErrorOutline
        StateCardVariant.SUCESSO -> Icons.Outlined.CheckCircle
        StateCardVariant.CARREGANDO -> Icons.Outlined.CloudOff
    }

@Composable
private fun corIcone(variant: StateCardVariant) =
    when (variant) {
        StateCardVariant.ERRO -> MaterialTheme.colorScheme.error
        StateCardVariant.SUCESSO -> MaterialTheme.colorScheme.primary
        else -> MaterialTheme.colorScheme.onSurfaceVariant
    }
