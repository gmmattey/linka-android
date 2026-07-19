package io.signallq.pro.feature.ambiente

import androidx.compose.material3.AlertDialog
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import io.signallq.pro.core.designsystem.corSurfaceOverlay

/** Tela 2.7 -- renomear ambiente. */
@Composable
fun RenomearAmbienteDialog(
    nomeAtual: String,
    onConfirmar: (String) -> Unit,
    onDismiss: () -> Unit,
) {
    var nome by remember { mutableStateOf(nomeAtual) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = corSurfaceOverlay(),
        title = { Text("Renomear ambiente") },
        text = {
            OutlinedTextField(value = nome, onValueChange = { nome = it })
        },
        confirmButton = {
            TextButton(onClick = { if (nome.isNotBlank()) onConfirmar(nome.trim()) }) {
                Text("Salvar")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancelar") }
        },
    )
}
