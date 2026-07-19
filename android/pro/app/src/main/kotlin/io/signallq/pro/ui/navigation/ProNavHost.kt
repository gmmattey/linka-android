package io.signallq.pro.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController
import io.signallq.pro.feature.ambiente.AmbienteRoutes
import io.signallq.pro.feature.ambiente.ambienteGraph
import io.signallq.pro.feature.auth.AuthRoutes
import io.signallq.pro.feature.auth.authGraph
import io.signallq.pro.feature.cliente.ClienteRoutes
import io.signallq.pro.feature.cliente.clienteGraph
import io.signallq.pro.feature.laudo.LaudoRoutes
import io.signallq.pro.feature.laudo.laudoGraph
import io.signallq.pro.feature.medicaodiagnostico.MedicaoDiagnosticoRoutes
import io.signallq.pro.feature.medicaodiagnostico.medicaoDiagnosticoGraph
import io.signallq.pro.feature.visita.VisitaRoutes
import io.signallq.pro.feature.visita.visitaGraph

/**
 * Compoe os grafos dos feature modules do Grupo 1 (trimmed) e Grupo 2 do prototipo
 * (issue #1161, Fase 2). So navegacao e wiring de callbacks entre features aqui -- nenhuma
 * regra de negocio, nenhum `:pro:feature:*` depende de outro diretamente.
 */
@Composable
fun ProNavHost() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = AuthRoutes.GRAFO) {
        authGraph(
            navController = navController,
            onAutenticado = { navegarLimpandoPilha(navController, VisitaRoutes.PAINEL, AuthRoutes.GRAFO) },
        )
        visitaGraph(
            navController = navController,
            onNovoCliente = { navController.navigate(ClienteRoutes.NOVO_CLIENTE) },
            onAbrirClientes = { navController.navigate(ClienteRoutes.NOVO_CLIENTE) },
            onAbrirFerramentas = {
                // Grupo 5 (Ferramentas) fora de escopo da Fase 2 -- sem destino ainda.
            },
            onAbrirCobranca = {
                // Grupo 3 (Entrega/Financeiro) fora de escopo da Fase 2, bloqueado por #1160.
            },
            onAbrirPerfil = { navController.navigate(AuthRoutes.CADASTRO_PROFISSIONAL) },
            onNavegarParaAmbientes = { visitaId -> navController.navigate(AmbienteRoutes.ambientes(visitaId)) },
            onNavegarParaConclusao = {
                navegarLimpandoPilha(navController, VisitaRoutes.PAINEL, VisitaRoutes.GRAFO)
            },
        )
        clienteGraph(
            onClienteCriado = { navController.popBackStack() },
        )
        ambienteGraph(
            onAbrirAmbiente = { ambienteId ->
                navController.navigate(MedicaoDiagnosticoRoutes.medicao(ambienteId))
            },
            onConcluirVisita = {
                navegarLimpandoPilha(navController, VisitaRoutes.PAINEL, VisitaRoutes.GRAFO)
            },
        )
        medicaoDiagnosticoGraph(
            navController = navController,
            onConcluirAmbiente = { navController.popBackStack(AmbienteRoutes.AMBIENTES, inclusive = false) },
            onVerLaudo = { ambienteId -> navController.navigate(LaudoRoutes.laudo(ambienteId)) },
        )
        laudoGraph()
    }
}

private fun navegarLimpandoPilha(
    navController: NavHostController,
    destino: String,
    grafoAntigo: String,
) {
    navController.navigate(destino) {
        popUpTo(grafoAntigo) { inclusive = true }
    }
}
