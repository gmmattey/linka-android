package io.signallq.app.core.network.contracts.topologia

/** Origem/natureza do sinal que compõe uma [Evidencia]. */
enum class TipoEvidencia {
    OUI,
    SSID,
    RSSI,
    CLIENT_SNAPSHOT,
    CORRELACAO,
}
