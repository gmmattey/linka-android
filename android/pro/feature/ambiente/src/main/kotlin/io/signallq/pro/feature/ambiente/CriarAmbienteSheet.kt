package io.signallq.pro.feature.ambiente

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/** Tela 2.6 -- criar ambiente. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CriarAmbienteSheet(
    onConfirmar: (String) -> Unit,
    onDismiss: () -> Unit,
) {
    var nome by remember { mutableStateOf("") }

    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text("Novo ambiente")
            OutlinedTextField(
                value = nome,
                onValueChange = { nome = it },
                label = { Text("Nome (ex.: Sala, Quarto 1)") },
                modifier = Modifier.fillMaxWidth(),
            )
            Button(
                onClick = { if (nome.isNotBlank()) onConfirmar(nome.trim()) },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Criar")
            }
        }
    }
}
