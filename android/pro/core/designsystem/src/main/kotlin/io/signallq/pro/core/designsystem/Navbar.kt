package io.signallq.pro.core.designsystem

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp

data class NavbarItem(
    val id: String,
    val titulo: String,
    val icone: ImageVector? = null,
)

/**
 * Conteudo do menu do Pro (tela 2.2) -- lista de itens de navegacao usando [ListRow].
 * Sem drawer/scaffold custom: quem posiciona (modal, tela cheia) e a feature chamadora.
 */
@Composable
fun Navbar(
    itens: List<NavbarItem>,
    onItemClick: (NavbarItem) -> Unit,
    modifier: Modifier = Modifier,
    tituloSecao: String? = null,
) {
    Column(modifier = modifier.fillMaxWidth()) {
        if (tituloSecao != null) {
            Text(
                text = tituloSecao.uppercase(),
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            )
        }
        itens.forEach { item ->
            ListRow(
                titulo = item.titulo,
                icone = item.icone,
                onClick = { onItemClick(item) },
            )
        }
    }
}
