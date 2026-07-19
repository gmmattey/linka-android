package io.signallq.pro.feature.laudo

import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavType
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import androidx.navigation.navArgument

private const val ARG_AMBIENTE_ID = "ambienteId"

object LaudoRoutes {
    const val GRAFO = "laudo"
    const val LAUDO = "laudo/{$ARG_AMBIENTE_ID}"

    fun laudo(ambienteId: String) = "laudo/$ambienteId"
}

/**
 * Grafo da tela 3.2 (laudo tecnico). Recebe o mesmo `ambienteId` do Grupo 2 -- o
 * [LaudoViewModel] deriva a visita a partir do ambiente e agrega todos os ambientes da
 * mesma visita, entao o laudo cobre a visita inteira, nao so o ambiente de origem.
 */
fun NavGraphBuilder.laudoGraph() {
    navigation(startDestination = LaudoRoutes.LAUDO, route = LaudoRoutes.GRAFO) {
        composable(
            LaudoRoutes.LAUDO,
            arguments = listOf(navArgument(ARG_AMBIENTE_ID) { type = NavType.StringType }),
        ) {
            LaudoScreen()
        }
    }
}
