package io.signallq.pro.feature.visita

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.signallq.pro.core.database.cliente.ClienteRepository
import io.signallq.pro.core.database.local.LocalRepository
import io.signallq.pro.core.database.visita.StatusVisita
import io.signallq.pro.core.database.visita.VisitaEntity
import io.signallq.pro.core.database.visita.VisitaRepository
import io.signallq.pro.core.designsystem.StatusChipTone
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject

data class AtendimentoResumoUiState(
    val visitaId: String,
    val clienteNome: String,
    val nomeLocal: String,
    val tipo: String,
    val horario: String,
    val statusLabel: String,
    val statusTone: StatusChipTone,
    val emAndamento: Boolean,
)

private val FORMATADOR_HORARIO = SimpleDateFormat("dd/MM/yyyy 'as' HH:mm", Locale("pt", "BR"))

private fun statusParaLabelETone(status: StatusVisita): Pair<String, StatusChipTone> =
    when (status) {
        StatusVisita.EM_ANDAMENTO -> "Em andamento" to StatusChipTone.ATENCAO
        StatusVisita.CONCLUIDA -> "Concluída" to StatusChipTone.POSITIVO
        StatusVisita.INTERROMPIDA -> "Interrompida" to StatusChipTone.CRITICO
    }

data class PainelUiState(
    val carregando: Boolean = true,
    val visitaEmAndamento: AtendimentoResumoUiState? = null,
    val proximosAtendimentos: List<AtendimentoResumoUiState> = emptyList(),
) {
    val vazio: Boolean get() = !carregando && visitaEmAndamento == null && proximosAtendimentos.isEmpty()
}

/**
 * Tela 2.1 -- painel do Pro. NÃO replica os 3 cards de métrica de vaidade do protótipo
 * (Atendimentos hoje/Clientes/Laudos emitidos, ver handoff Fase 2 #1161). Lidera com
 * "Próximos atendimentos" (lista) + as 4 ações rápidas (ver [PainelScreen]).
 */
@HiltViewModel
class PainelViewModel
    @Inject
    constructor(
        visitaRepository: VisitaRepository,
        clienteRepository: ClienteRepository,
        localRepository: LocalRepository,
    ) : ViewModel() {
        val uiState: StateFlow<PainelUiState> =
            combine(
                visitaRepository.observarRecentes(limite = 10),
                clienteRepository.observarClientes(),
                localRepository.observarTodos(),
            ) { visitas, clientes, locais ->
                val nomesPorId = clientes.associate { it.id to it.nome }
                val locaisPorId = locais.associate { it.id to it.nome }

                fun paraResumo(visita: VisitaEntity): AtendimentoResumoUiState {
                    val (statusLabel, statusTone) = statusParaLabelETone(visita.status)
                    return AtendimentoResumoUiState(
                        visitaId = visita.id,
                        clienteNome = nomesPorId[visita.clienteId] ?: "Cliente",
                        nomeLocal = locaisPorId[visita.localId] ?: "Local",
                        tipo = visita.tipo.name,
                        horario = FORMATADOR_HORARIO.format(Date(visita.iniciadaEmEpochMs)),
                        statusLabel = statusLabel,
                        statusTone = statusTone,
                        emAndamento = visita.status != StatusVisita.CONCLUIDA,
                    )
                }
                val emAndamento =
                    visitas.firstOrNull { it.status == StatusVisita.EM_ANDAMENTO || it.status == StatusVisita.INTERROMPIDA }
                PainelUiState(
                    carregando = false,
                    visitaEmAndamento = emAndamento?.let(::paraResumo),
                    proximosAtendimentos =
                        visitas.filter { it.id != emAndamento?.id }.map(::paraResumo),
                )
            }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), PainelUiState())
    }
