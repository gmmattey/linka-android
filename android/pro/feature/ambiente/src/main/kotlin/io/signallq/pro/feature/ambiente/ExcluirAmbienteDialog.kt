package io.signallq.pro.feature.ambiente

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable

/**
 * Tela 2.9 -- confirmar exclusao. A recusa por medicao associada e mostrada como erro
 * na propria [AmbientesScreen] (StateCard/erro), nao neste dialogo de confirmacao --
 * o bloqueio so e conhecido depois de tentar excluir (handoff Fase 2, #1161).
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
