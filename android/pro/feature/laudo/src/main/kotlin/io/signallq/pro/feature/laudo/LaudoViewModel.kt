package io.signallq.pro.feature.laudo

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.signallq.app.core.relatorio.exportarHtmlComoPdf
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.io.File
import javax.inject.Inject

enum class LaudoEstado { CARREGANDO, PRONTO, ERRO }

data class LaudoUiState(
    val estado: LaudoEstado = LaudoEstado.CARREGANDO,
    val dados: LaudoDados? = null,
    val gerandoPdf: Boolean = false,
    val pdfUri: Uri? = null,
    val mensagemErro: String? = null,
)

/**
 * Tela 3.2 -- monta o laudo a partir dos dados já persistidos da visita (cliente, ambientes,
 * medições, diagnósticos, evidências, via [LaudoAgregador]) e gera o PDF via
 * [exportarHtmlComoPdf] (`:core:relatorio`). Sem entidade Room própria para o laudo em si
 * (nenhuma `LaudoEntity`) -- o PDF é efêmero, regenerado sob demanda a cada "Gerar PDF"
 * (decisão de escopo do MVP0: versionar/historiar laudos é feature de MVP1, doc 09 linha 238
 * do pacote de plataforma).
 */
@HiltViewModel
class LaudoViewModel
    @Inject
    constructor(
        savedStateHandle: SavedStateHandle,
        private val laudoAgregador: LaudoAgregador,
        @ApplicationContext private val context: Context,
    ) : ViewModel() {
        private val ambienteId: String = checkNotNull(savedStateHandle["ambienteId"])

        private val _uiState = MutableStateFlow(LaudoUiState())
        val uiState: StateFlow<LaudoUiState> = _uiState

        init {
            carregarLaudo()
        }

        fun carregarLaudo() {
            viewModelScope.launch {
                _uiState.update { LaudoUiState(estado = LaudoEstado.CARREGANDO) }

                val dados = laudoAgregador.montar(ambienteId)
                if (dados == null) {
                    _uiState.update {
                        it.copy(estado = LaudoEstado.ERRO, mensagemErro = "Não foi possível localizar os dados da visita.")
                    }
                    return@launch
                }

                _uiState.update { it.copy(estado = LaudoEstado.PRONTO, dados = dados) }
            }
        }

        fun gerarPdf() {
            val dados = _uiState.value.dados ?: return
            viewModelScope.launch {
                _uiState.update { it.copy(gerandoPdf = true, mensagemErro = null) }

                val html = LaudoHtmlGenerator.gerarHtml(dados)
                val diretorio = File(context.filesDir, "laudos").apply { mkdirs() }
                val arquivo = File(diretorio, "laudo_${dados.visitaId}_${System.currentTimeMillis()}.pdf")
                val sucesso = exportarHtmlComoPdf(html = html, arquivo = arquivo, context = context)
                val uri =
                    if (sucesso) {
                        FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", arquivo)
                    } else {
                        null
                    }

                _uiState.update {
                    it.copy(
                        gerandoPdf = false,
                        pdfUri = uri,
                        mensagemErro = if (!sucesso) "Não foi possível gerar o PDF do laudo. Tente novamente." else null,
                    )
                }
            }
        }

        fun compartilhar() {
            val uri = _uiState.value.pdfUri ?: return
            val intent =
                Intent(Intent.ACTION_SEND).apply {
                    type = "application/pdf"
                    putExtra(Intent.EXTRA_STREAM, uri)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
            context.startActivity(
                Intent.createChooser(intent, "Compartilhar laudo").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
            )
        }
    }
