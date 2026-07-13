package io.signallq.app.ui.screen

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Construction
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import io.signallq.app.ui.LkSpacing
import io.signallq.app.ui.LocalLkTokens
import io.signallq.app.ui.component.ProfileAvatarButton

// TODO(#933): grid real de atalhos (Dispositivos, Equipamento de Internet, DNS, Ping,
// Laudo, Jogos, Monitoramento) — Fase 4 do plano MD3 To-Be. Placeholder criado na Fase 1
// (#930) só para a bottom nav ter destino navegável sem travar a fase de navegação
// esperando a Fase 4 ficar pronta.
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FerramentasScreen(
    nomeUsuario: String,
    fotoUri: String?,
    onAbrirPerfil: () -> Unit,
) {
    val c = LocalLkTokens.current

    Scaffold(
        containerColor = c.bgPrimary,
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = "Ferramentas",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.W600,
                        color = c.textPrimary,
                    )
                },
                navigationIcon = {
                    ProfileAvatarButton(
                        nomeUsuario = nomeUsuario,
                        fotoUri = fotoUri,
                        onClick = onAbrirPerfil,
                    )
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = c.bgPrimary),
            )
        },
    ) { padding ->
        Box(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(padding),
            contentAlignment = Alignment.Center,
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Outlined.Construction,
                    contentDescription = null,
                    tint = c.textTertiary,
                    modifier = Modifier.size(40.dp),
                )
                Spacer(Modifier.height(LkSpacing.md))
                Text(
                    text = "Em construção",
                    style = MaterialTheme.typography.bodyMedium,
                    color = c.textSecondary,
                )
            }
        }
    }
}
