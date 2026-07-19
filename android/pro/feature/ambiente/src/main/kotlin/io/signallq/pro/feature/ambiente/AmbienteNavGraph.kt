package io.signallq.pro.feature.ambiente

import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavType
import androidx.navigation.compose.composable
import androidx.navigation.navArgument

private const val ARG_VISITA_ID = "visitaId"

object AmbienteRoutes {
    const val AMBIENTES = "ambiente/lista/{$ARG_VISITA_ID}"

    fun ambientes(visitaId: String) = "ambiente/lista/$visitaId"
}

fun NavGraphBuilder.ambienteGraph(
    onAbrirAmbiente: (ambienteId: String) -> Unit,
    onConcluirVisita: () -> Unit,
) {
    composable(
        AmbienteRoutes.AMBIENTES,
        arguments = listOf(navArgument(ARG_VISITA_ID) { type = NavType.StringType }),
    ) {
        AmbientesScreen(
            onAbrirAmbiente = onAbrirAmbiente,
            onConcluirVisita = onConcluirVisita,
        )
    }
}
