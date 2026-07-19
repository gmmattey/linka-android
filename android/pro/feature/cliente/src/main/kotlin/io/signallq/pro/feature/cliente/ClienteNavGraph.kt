package io.signallq.pro.feature.cliente

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable

object ClienteRoutes {
    const val NOVO_CLIENTE = "cliente/novo"
}

fun NavGraphBuilder.clienteGraph(onClienteCriado: (String) -> Unit) {
    composable(ClienteRoutes.NOVO_CLIENTE) {
        NovoClienteScreen(onClienteCriado = onClienteCriado)
    }
}
