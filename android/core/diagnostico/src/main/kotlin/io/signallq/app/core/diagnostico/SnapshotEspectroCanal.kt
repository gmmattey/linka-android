package io.signallq.app.core.diagnostico

data class SnapshotEspectroCanal(
    val dadosPorCanal: List<DadoCanal>,
    val canalAtual: Int?,
    val canalRecomendado: Int?,
    val motivoRecomendacao: String?,
    val banda: String,
)
