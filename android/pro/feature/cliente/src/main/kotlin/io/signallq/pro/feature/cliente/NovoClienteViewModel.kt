package io.signallq.pro.feature.cliente

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.signallq.pro.core.database.cliente.ClienteRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class NovoClienteUiState(
    val nome: String = "",
    val telefone: String = "",
    val erroNomeVazio: Boolean = false,
    val clienteIdCriado: String? = null,
)

/** Tela 2.3 -- so o nome e obrigatorio (doc 09 §11: cadastro rapido). */
@HiltViewModel
class NovoClienteViewModel
    @Inject
    constructor(
        private val clienteRepository: ClienteRepository,
    ) : ViewModel() {
        private val _uiState = MutableStateFlow(NovoClienteUiState())
        val uiState: StateFlow<NovoClienteUiState> = _uiState

        fun atualizarNome(nome: String) {
            _uiState.update { it.copy(nome = nome, erroNomeVazio = false) }
        }

        fun atualizarTelefone(telefone: String) {
            _uiState.update { it.copy(telefone = telefone) }
        }

        fun salvar() {
            val nome = _uiState.value.nome.trim()
            if (nome.isEmpty()) {
                _uiState.update { it.copy(erroNomeVazio = true) }
                return
            }
            viewModelScope.launch {
                val telefone =
                    _uiState.value.telefone
                        .trim()
                        .ifBlank { null }
                val id = clienteRepository.criarCliente(nome = nome, telefone = telefone)
                _uiState.update { it.copy(clienteIdCriado = id) }
            }
        }
    }
