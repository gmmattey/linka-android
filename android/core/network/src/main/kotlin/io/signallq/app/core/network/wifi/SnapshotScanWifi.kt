package io.signallq.app.core.network.wifi

import io.signallq.app.core.network.contracts.wifi.RedeVizinha

enum class EstadoScanWifi { idle, scanning, concluido, erro }

data class SnapshotScanWifi(
    val estado: EstadoScanWifi,
    val redes: List<RedeVizinha>,
    val erroMensagem: String?,
)
