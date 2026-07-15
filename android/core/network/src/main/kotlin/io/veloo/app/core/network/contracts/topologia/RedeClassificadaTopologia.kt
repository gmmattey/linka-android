package io.signallq.app.core.network.contracts.topologia

import io.signallq.app.core.network.contracts.wifi.RedeVizinha

/**
 * Uma [RedeVizinha] (um BSSID observado no scan Wi-Fi) associada à [ClassificacaoTopologia]
 * estruturada que o [io.signallq.app.core.network.topologia.engine.TopologiaRedeEngine] atribuiu
 * a ela.
 *
 * Fase 2A do plano de unificação de topologia (issue #975/#979) — motor novo roda em paralelo,
 * este contrato ainda não tem nenhum consumidor de UI.
 */
data class RedeClassificadaTopologia(
    val rede: RedeVizinha,
    val classificacao: ClassificacaoTopologia,
)
