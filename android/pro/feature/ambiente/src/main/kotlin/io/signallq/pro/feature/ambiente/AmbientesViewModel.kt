package io.signallq.pro.feature.ambiente

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.signallq.pro.core.database.ambiente.AmbienteRepository
import io.signallq.pro.core.database.medicao.MedicaoProRepository
import io.signallq.pro.core.database.visita.VisitaRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AmbienteUiState(
    val id: String,
    val nome: String,
)

data class AmbientesUiState(
    val itens: List<AmbienteUiState> = emptyList(),
    val erroExclusaoBloqueada: String? = null,
)

/** Telas 2.6-2.9 -- lista de ambientes da visita + criar/renomear/excluir. */
@HiltViewModel
class AmbientesViewModel
    @Inject
    constructor(
        savedStateHandle: SavedStateHandle,
        private val ambienteRepository: AmbienteRepository,
        private val medicaoProRepository: MedicaoProRepository,
        private val visitaRepository: VisitaRepository,
    ) : ViewModel() {
        val visitaId: String = checkNotNull(savedStateHandle["visitaId"])

        private val erroExclusaoFlow = MutableStateFlow<String?>(null)

        val uiState: StateFlow<AmbientesUiState> =
            combine(
                ambienteRepository.observarPorVisita(visitaId),
                erroExclusaoFlow,
            ) { ambientes, erro ->
                AmbientesUiState(
                    itens = ambientes.map { AmbienteUiState(it.id, it.nome) },
                    erroExclusaoBloqueada = erro,
                )
            }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AmbientesUiState())

        fun criarAmbiente(nome: String) {
            viewModelScope.launch { ambienteRepository.criarAmbiente(visitaId, nome) }
        }

        fun renomearAmbiente(
            id: String,
            novoNome: String,
        ) {
            viewModelScope.launch { ambienteRepository.renomear(id, novoNome) }
        }

        fun excluirAmbiente(ambienteId: String) {
            viewModelScope.launch {
                if (medicaoProRepository.temMedicaoValida(ambienteId)) {
                    erroExclusaoFlow.value =
                        "Este ambiente tem medicoes registradas e nao pode ser excluido."
                    return@launch
                }
                val ambiente = ambienteRepository.buscarPorId(ambienteId) ?: return@launch
                ambienteRepository.excluir(ambiente)
            }
        }

        fun limparErroExclusao() {
            erroExclusaoFlow.value = null
        }

        fun concluirVisita() {
            viewModelScope.launch { visitaRepository.concluirVisita(visitaId) }
        }
    }
