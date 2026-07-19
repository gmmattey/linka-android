package io.signallq.pro.feature.ambiente

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable

/**
 * Tela 2.9 -- confirmar exclusão. A recusa por medição associada é mostrada como erro
 * na própria [AmbientesScreen] (StateCard/erro), não neste diálogo de confirmação --
 * o bloqueio só é conhecido depois de tentar excluir (handoff Fase 2, #1161).
 */
@Composable
fun ExcluirAmbienteDialog(
    nomeAmbiente: String,
    onConfirmar: () -> Unit,
    onDismiss: () -> Unit,
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Excluir ambiente") },
        text = { Text("Tem certeza que deseja excluir \"$nomeAmbiente\"?") },
        confirmButton = {
            TextButton(onClick = onConfirmar) { Text("Excluir") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar") }
        },
    )
}
