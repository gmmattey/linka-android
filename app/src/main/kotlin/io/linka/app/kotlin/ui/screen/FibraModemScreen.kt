package io.linka.app.kotlin.ui.screen

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.linka.app.kotlin.feature.diagnostico.DiagnosticResult
import io.linka.app.kotlin.feature.diagnostico.DiagnosticStatus
import io.linka.app.kotlin.feature.diagnostico.FibraDiagnosticInput
import io.linka.app.kotlin.feature.diagnostico.FibraSignalQualityEngine
import io.linka.app.kotlin.feature.fibra.DeviceInfoFibra
import io.linka.app.kotlin.feature.fibra.GponStatus
import io.linka.app.kotlin.feature.fibra.WanStatus
import io.linka.app.kotlin.ui.LkColors
import io.linka.app.kotlin.ui.LkSpacing
import io.linka.app.kotlin.ui.LkTokens
import io.linka.app.kotlin.ui.LinkaTheme

// ─── Entry point ──────────────────────────────────────────────────────────────

@Composable
fun FibraModemScreen(
    uiState: FibraModemUiState,
    onConectar: () -> Unit,
    onAbrirAjustes: () -> Unit,
    c: LkTokens,
) {
    val isRefresh = uiState is FibraModemUiState.Conectando

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(c.bgSecondary),
    ) {
        // LinearProgressIndicator no topo apenas no refresh (Conectando com snapshot anterior)
        if (isRefresh) {
            LinearProgressIndicator(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.TopCenter),
                color = LkColors.accent,
                trackColor = c.border,
            )
        }

        when (uiState) {
            is FibraModemUiState.SemWifi -> FibraEstadoSemWifi(c = c)
            is FibraModemUiState.SemCredenciais -> FibraEstadoSemCredenciais(
                c = c,
                onAbrirAjustes = onAbrirAjustes,
            )
            is FibraModemUiState.Conectando -> FibraEstadoConectando(c = c)
            is FibraModemUiState.Erro -> FibraEstadoErro(
                c = c,
                onTentarNovamente = onConectar,
                onAbrirAjustes = onAbrirAjustes,
            )
            is FibraModemUiState.Concluido -> FibraEstadoConcluido(
                estado = uiState,
                c = c,
            )
        }
    }
}

// ─── Estado 1: Sem Wi-Fi ──────────────────────────────────────────────────────

@Composable
private fun FibraEstadoSemWifi(c: LkTokens) {
    FibraEstadoVazio(
        icone = {
            Icon(
                imageVector = Icons.Filled.WifiOff,
                contentDescription = null,
                tint = c.textTertiary,
                modifier = Modifier.size(48.dp),
            )
        },
        titulo = "Análise indisponível",
        texto = "A análise do modem só funciona quando você está na rede local (Wi-Fi).",
        c = c,
    )
}

// ─── Estado 2: Sem Credenciais ────────────────────────────────────────────────

@Composable
private fun FibraEstadoSemCredenciais(
    c: LkTokens,
    onAbrirAjustes: () -> Unit,
) {
    FibraEstadoVazio(
        icone = {
            Icon(
                imageVector = Icons.Filled.Settings,
                contentDescription = null,
                tint = c.textTertiary,
                modifier = Modifier.size(48.dp),
            )
        },
        titulo = "Configure o acesso ao modem",
        texto = "Informe o IP, usuário e senha do modem nos ajustes para consultar os dados da fibra.",
        c = c,
        cta = {
            Button(
                onClick = onAbrirAjustes,
                colors = ButtonDefaults.buttonColors(containerColor = LkColors.accent),
                shape = RoundedCornerShape(LkSpacing.md),
            ) {
                Text("Configurar modem", fontSize = 14.sp, color = Color.White)
            }
        },
    )
}

// ─── Estado 3: Conectando ─────────────────────────────────────────────────────

@Composable
private fun FibraEstadoConectando(c: LkTokens) {
    // Skeleton inicial — quando snapshotFibra nunca chegou
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(LkSpacing.xl)
            .navigationBarsPadding(),
        verticalArrangement = Arrangement.spacedBy(LkSpacing.md),
    ) {
        Spacer(Modifier.height(LkSpacing.xl))
        FibraSkeletonBloco(c = c, largura = 120.dp, altura = 18.dp)
        Spacer(Modifier.height(LkSpacing.sm))
        FibraSkeletonCard(c = c)
        Spacer(Modifier.height(LkSpacing.sm))
        FibraSkeletonCard(c = c)
    }
}

// ─── Estado 4: Erro ───────────────────────────────────────────────────────────

@Composable
private fun FibraEstadoErro(
    c: LkTokens,
    onTentarNovamente: () -> Unit,
    onAbrirAjustes: () -> Unit,
) {
    FibraEstadoVazio(
        icone = {
            Icon(
                imageVector = Icons.Filled.ErrorOutline,
                contentDescription = null,
                tint = LkColors.error,
                modifier = Modifier.size(48.dp),
            )
        },
        titulo = "Não consegui acessar o modem",
        texto = "Verifique o IP, o usuário e a senha nas configurações do modem.",
        c = c,
        cta = {
            Column(
                verticalArrangement = Arrangement.spacedBy(LkSpacing.sm),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Button(
                    onClick = onTentarNovamente,
                    colors = ButtonDefaults.buttonColors(containerColor = LkColors.accent),
                    shape = RoundedCornerShape(LkSpacing.md),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Tentar novamente", fontSize = 14.sp, color = Color.White)
                }
                OutlinedButton(
                    onClick = onAbrirAjustes,
                    shape = RoundedCornerShape(LkSpacing.md),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Revisar configurações", fontSize = 14.sp, color = c.textSecondary)
                }
            }
        },
    )
}

// ─── Estado 5: Concluido ──────────────────────────────────────────────────────

@Composable
private fun FibraEstadoConcluido(
    estado: FibraModemUiState.Concluido,
    c: LkTokens,
) {
    // Deriva interpretações localmente a partir do GponStatus — sem importar ViewModel
    val interpretacoes = remember(estado.gpon) {
        val input = FibraDiagnosticInput(
            rxPowerDbm = estado.gpon.rxPowerDbm,
            txPowerDbm = estado.gpon.txPowerDbm,
            temperatureCelsius = estado.gpon.temperatureCelsius,
            isUp = estado.gpon.isUp,
        )
        FibraSignalQualityEngine.avaliar(input)
    }

    val statusGeral = calcularStatusGeral(interpretacoes, estado.gpon.isUp)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = LkSpacing.xl)
            .padding(top = LkSpacing.xl, bottom = LkSpacing.xxl)
            .navigationBarsPadding(),
        verticalArrangement = Arrangement.spacedBy(LkSpacing.lg),
    ) {
        // ── Topo: chip de status geral ─────────────────────────────────────
        FibraChipStatusGeral(status = statusGeral, c = c)

        // ── Bloco valores ──────────────────────────────────────────────────
        FibraBlocoValores(
            gpon = estado.gpon,
            deviceInfo = estado.deviceInfo,
            wan = estado.wan,
            c = c,
        )

        // ── Bloco interpretação ────────────────────────────────────────────
        if (interpretacoes.isNotEmpty()) {
            FibraBlocoInterpretacoes(interpretacoes = interpretacoes, c = c)
        }
    }
}

// ─── Chip de status geral ─────────────────────────────────────────────────────

@Composable
private fun FibraChipStatusGeral(
    status: StatusGeral,
    c: LkTokens,
) {
    val (label, cor) = when (status) {
        StatusGeral.Boa -> "Boa" to LkColors.success
        StatusGeral.Regular -> "Regular" to LkColors.warning
        StatusGeral.Ruim -> "Ruim" to LkColors.error
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(LkSpacing.sm),
    ) {
        Text(
            "Status da fibra",
            fontSize = 14.sp,
            fontWeight = FontWeight.W500,
            color = c.textSecondary,
        )
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(LkSpacing.sm))
                .background(cor.copy(alpha = 0.14f))
                .padding(horizontal = LkSpacing.md, vertical = LkSpacing.xs),
        ) {
            Text(
                label,
                fontSize = 13.sp,
                fontWeight = FontWeight.W700,
                color = cor,
            )
        }
    }
}

// ─── Bloco valores GPON ───────────────────────────────────────────────────────

@Composable
private fun FibraBlocoValores(
    gpon: GponStatus,
    deviceInfo: DeviceInfoFibra?,
    wan: WanStatus?,
    c: LkTokens,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(c.bgCard)
            .padding(LkSpacing.cardContent),
        verticalArrangement = Arrangement.spacedBy(LkSpacing.md),
    ) {
        Text(
            "Dados do sinal óptico",
            fontSize = 12.sp,
            fontWeight = FontWeight.W600,
            color = c.textTertiary,
            modifier = Modifier.padding(bottom = LkSpacing.xs),
        )

        FibraValorRow(
            label = "RX Power",
            valor = if (gpon.rxPowerDbm != 0.0) "${"%.2f".format(gpon.rxPowerDbm)} dBm" else "--",
            c = c,
        )
        FibraValorRow(
            label = "TX Power",
            valor = if (gpon.txPowerDbm != 0.0) "${"%.2f".format(gpon.txPowerDbm)} dBm" else "--",
            c = c,
        )
        FibraValorRow(
            label = "Temperatura",
            valor = if (gpon.temperatureCelsius != 0.0) "${"%.1f".format(gpon.temperatureCelsius)} °C" else "--",
            c = c,
        )
        FibraValorRow(
            label = "Status óptico",
            valor = if (gpon.isUp) "Ativo" else "Inativo",
            c = c,
            valorCor = if (gpon.isUp) LkColors.success else LkColors.error,
        )
        FibraValorRow(
            label = "Modelo",
            valor = deviceInfo?.model?.ifBlank { null } ?: "--",
            c = c,
        )

        if (wan != null && wan.connectionType.isNotBlank()) {
            FibraValorRow(
                label = "Tipo de conexão",
                valor = wan.connectionType,
                c = c,
            )
        }
    }
}

@Composable
private fun FibraValorRow(
    label: String,
    valor: String,
    c: LkTokens,
    valorCor: Color? = null,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            label,
            fontSize = 13.sp,
            color = c.textSecondary,
            modifier = Modifier.weight(1f),
        )
        Spacer(Modifier.width(LkSpacing.sm))
        Text(
            valor,
            fontSize = 13.sp,
            fontWeight = FontWeight.W600,
            color = valorCor ?: c.textPrimary,
        )
    }
}

// ─── Bloco interpretações ─────────────────────────────────────────────────────

@Composable
private fun FibraBlocoInterpretacoes(
    interpretacoes: List<DiagnosticResult>,
    c: LkTokens,
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(LkSpacing.sm),
    ) {
        Text(
            "Interpretação do sinal",
            fontSize = 12.sp,
            fontWeight = FontWeight.W600,
            color = c.textTertiary,
        )

        interpretacoes.forEach { resultado ->
            FibraCardInterpretacao(resultado = resultado, c = c)
        }
    }
}

@Composable
private fun FibraCardInterpretacao(
    resultado: DiagnosticResult,
    c: LkTokens,
) {
    val cor = when (resultado.status) {
        DiagnosticStatus.ok -> LkColors.success
        DiagnosticStatus.attention -> LkColors.warning
        DiagnosticStatus.critical -> LkColors.error
        DiagnosticStatus.info -> LkColors.accentBlue
        DiagnosticStatus.inconclusive -> c.textTertiary
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(cor.copy(alpha = 0.08f))
            .padding(LkSpacing.md),
        verticalArrangement = Arrangement.spacedBy(LkSpacing.xs),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(LkSpacing.sm),
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(cor),
            )
            Text(
                resultado.titulo,
                fontSize = 13.sp,
                fontWeight = FontWeight.W600,
                color = cor,
            )
        }
        Text(
            resultado.mensagemUsuario,
            fontSize = 12.sp,
            color = c.textSecondary,
        )
        val recomendacao = resultado.recomendacao
        if (!recomendacao.isNullOrBlank()) {
            Text(
                recomendacao,
                fontSize = 11.sp,
                color = c.textTertiary,
            )
        }
        val evidencia = resultado.evidencia
        if (!evidencia.isNullOrBlank()) {
            Text(
                evidencia,
                fontSize = 10.sp,
                color = c.textTertiary,
            )
        }
    }
}

// ─── Esqueleto de carregamento ────────────────────────────────────────────────

@Composable
private fun FibraSkeletonCard(c: LkTokens) {
    val transition = rememberInfiniteTransition(label = "shimmer_fibra")
    val translateX by transition.animateFloat(
        initialValue = -400f,
        targetValue = 400f,
        animationSpec = infiniteRepeatable(
            animation = tween(1100, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "shimmer_x_fibra",
    )
    val shimmerBrush = Brush.linearGradient(
        colors = listOf(
            c.border.copy(alpha = 0.5f),
            Color.White.copy(alpha = 0.15f),
            c.border.copy(alpha = 0.5f),
        ),
        start = Offset(translateX, 0f),
        end = Offset(translateX + 400f, 0f),
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(80.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(shimmerBrush),
    )
}

@Composable
private fun FibraSkeletonBloco(
    c: LkTokens,
    largura: androidx.compose.ui.unit.Dp,
    altura: androidx.compose.ui.unit.Dp,
) {
    val transition = rememberInfiniteTransition(label = "shimmer_bloco")
    val translateX by transition.animateFloat(
        initialValue = -200f,
        targetValue = 200f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "shimmer_bloco_x",
    )
    val shimmerBrush = Brush.linearGradient(
        colors = listOf(
            c.border.copy(alpha = 0.5f),
            Color.White.copy(alpha = 0.15f),
            c.border.copy(alpha = 0.5f),
        ),
        start = Offset(translateX, 0f),
        end = Offset(translateX + 200f, 0f),
    )
    Box(
        modifier = Modifier
            .width(largura)
            .height(altura)
            .clip(RoundedCornerShape(6.dp))
            .background(shimmerBrush),
    )
}

// ─── Layout genérico de estado vazio ─────────────────────────────────────────

@Composable
private fun FibraEstadoVazio(
    icone: @Composable () -> Unit,
    titulo: String,
    texto: String,
    c: LkTokens,
    cta: (@Composable () -> Unit)? = null,
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = LkSpacing.xl)
            .navigationBarsPadding(),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(LkSpacing.md),
            modifier = Modifier.padding(bottom = LkSpacing.xxl),
        ) {
            icone()
            Spacer(Modifier.height(LkSpacing.sm))
            Text(
                titulo,
                fontSize = 17.sp,
                fontWeight = FontWeight.W700,
                color = c.textPrimary,
            )
            Text(
                texto,
                fontSize = 13.sp,
                color = c.textSecondary,
                modifier = Modifier.padding(horizontal = LkSpacing.lg),
            )
            if (cta != null) {
                Spacer(Modifier.height(LkSpacing.sm))
                cta()
            }
        }
    }
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

private enum class StatusGeral { Boa, Regular, Ruim }

private fun calcularStatusGeral(
    interpretacoes: List<DiagnosticResult>,
    isUp: Boolean,
): StatusGeral {
    if (!isUp) return StatusGeral.Ruim
    if (interpretacoes.any { it.status == DiagnosticStatus.critical }) return StatusGeral.Ruim
    if (interpretacoes.any { it.status == DiagnosticStatus.attention }) return StatusGeral.Regular
    return StatusGeral.Boa
}

// ─── Preview ─────────────────────────────────────────────────────────────────

@Preview(showBackground = true, name = "FibraModem — Concluido")
@Composable
private fun PreviewFibraModemConcluido() {
    LinkaTheme {
        val tokens = LkTokens(
            bgPrimary = LkColors.Light.bgPrimary,
            bgSecondary = LkColors.Light.bgSecondary,
            bgCard = LkColors.Light.bgCard,
            textPrimary = LkColors.Light.textPrimary,
            textSecondary = LkColors.Light.textSecondary,
            textTertiary = LkColors.Light.textTertiary,
            border = LkColors.Light.border,
            warningContainer = LkColors.Light.warningContainer,
            onWarningContainer = LkColors.Light.onWarningContainer,
            amberSurface = LkColors.Light.amberSurface,
            successContainer = LkColors.Light.successContainer,
            onSuccessContainer = LkColors.Light.onSuccessContainer,
        )
        FibraModemScreen(
            uiState = FibraModemUiState.Concluido(
                gpon = GponStatus(
                    status = "up",
                    mode = "gpon",
                    rxPowerDbm = -19.5,
                    txPowerDbm = 2.3,
                    temperatureCelsius = 48.0,
                    serial = "ZTEG00000001",
                    voltageV = 3.3,
                    laserCurrentMa = 22.0,
                ),
                deviceInfo = DeviceInfoFibra(
                    model = "ZTE F670L",
                    manufacturer = "ZTE",
                    serialNumber = "ZTEG00000001",
                    firmwareVersion = "V1.0.10P6N7",
                    hardwareVersion = "V1.0",
                    uptimeSeconds = 86400 * 3 + 3600 * 2,
                ),
                wan = WanStatus(
                    externalIp = "177.x.x.x",
                    gateway = "200.x.x.1",
                    primaryDns = "8.8.8.8",
                    secondaryDns = "8.8.4.4",
                    vlanId = "110",
                    interfaceName = "veip0.1",
                    pppoeConcentrator = "BRAS01",
                    connectionType = "PPPoE",
                    connectionUptimeSeconds = 86400 * 3,
                ),
                ppp = null,
                interpretacoes = emptyList(),
            ),
            onConectar = {},
            onAbrirAjustes = {},
            c = tokens,
        )
    }
}

@Preview(showBackground = true, name = "FibraModem — Erro")
@Composable
private fun PreviewFibraModemErro() {
    LinkaTheme {
        val tokens = LkTokens(
            bgPrimary = LkColors.Light.bgPrimary,
            bgSecondary = LkColors.Light.bgSecondary,
            bgCard = LkColors.Light.bgCard,
            textPrimary = LkColors.Light.textPrimary,
            textSecondary = LkColors.Light.textSecondary,
            textTertiary = LkColors.Light.textTertiary,
            border = LkColors.Light.border,
            warningContainer = LkColors.Light.warningContainer,
            onWarningContainer = LkColors.Light.onWarningContainer,
            amberSurface = LkColors.Light.amberSurface,
            successContainer = LkColors.Light.successContainer,
            onSuccessContainer = LkColors.Light.onSuccessContainer,
        )
        FibraModemScreen(
            uiState = FibraModemUiState.Erro("fibra.erro_acesso"),
            onConectar = {},
            onAbrirAjustes = {},
            c = tokens,
        )
    }
}

@Preview(showBackground = true, name = "FibraModem — SemWifi")
@Composable
private fun PreviewFibraModemSemWifi() {
    LinkaTheme {
        val tokens = LkTokens(
            bgPrimary = LkColors.Light.bgPrimary,
            bgSecondary = LkColors.Light.bgSecondary,
            bgCard = LkColors.Light.bgCard,
            textPrimary = LkColors.Light.textPrimary,
            textSecondary = LkColors.Light.textSecondary,
            textTertiary = LkColors.Light.textTertiary,
            border = LkColors.Light.border,
            warningContainer = LkColors.Light.warningContainer,
            onWarningContainer = LkColors.Light.onWarningContainer,
            amberSurface = LkColors.Light.amberSurface,
            successContainer = LkColors.Light.successContainer,
            onSuccessContainer = LkColors.Light.onSuccessContainer,
        )
        FibraModemScreen(
            uiState = FibraModemUiState.SemWifi,
            onConectar = {},
            onAbrirAjustes = {},
            c = tokens,
        )
    }
}
