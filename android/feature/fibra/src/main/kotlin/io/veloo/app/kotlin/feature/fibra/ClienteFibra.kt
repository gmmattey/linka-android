package io.signallq.app.feature.fibra

/**
 * Um cliente conectado reportado pelo próprio roteador Nokia (`device_cfg`,
 * tela "Home Networking", `lan_status.cgi?wlan`) — GH#839/#865 Fase 2. Ver
 * `docs_ai/technical/NOKIA_GPON_FIELD_MAP.md`.
 */
data class ClienteFibra(
    val mac: String?,
    val ip: String?,
    val hostname: String?,
    val tipoConexao: String?,
)
