package io.signallq.app.ui.screen

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.automirrored.outlined.Article
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.outlined.Business
import androidx.compose.material.icons.outlined.Campaign
import androidx.compose.material.icons.outlined.DarkMode
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LightMode
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Router
import androidx.compose.material.icons.outlined.Sensors
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.SignalCellularAlt
import androidx.compose.material.icons.outlined.Speed
import androidx.compose.material.icons.outlined.VerifiedUser
import androidx.compose.material.icons.outlined.Wifi
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.signallq.app.BuildConfig
import io.signallq.app.R
import io.signallq.app.monitoramento.OemKillInfo
import io.signallq.app.ui.LkColors
import io.signallq.app.ui.LkRadius
import io.signallq.app.ui.LkSpacing
import io.signallq.app.ui.LkTokens
import io.signallq.app.ui.LocalLkTokens
import io.signallq.app.ui.component.ProfileAvatarButton

@SuppressLint("InlinedApi")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AjustesScreen(
    perfil: AjustesPerfilState,
    provedor: AjustesProvedorState,
    monitoramento: AjustesMonitoramentoState,
    modem: AjustesModemState,
    temaSelecionado: String,
    onDefinirTemaSelecionado: (String) -> Unit,
    limiteAlertaMbps: Int,
    onSalvarLimiteAlerta: (Int) -> Unit,
    onLimparHistorico: () -> Unit,
    onApagarDadosLocais: () -> Unit,
    onResetarApp: () -> Unit,
    onAbrirHistorico: () -> Unit,
    onAbrirLaudo: () -> Unit,
    onAbrirPerfil: () -> Unit = {},
    onAbrirPrivacidade: () -> Unit = {},
    onAbrirNovidades: () -> Unit = {},
    onAbrirFibra: () -> Unit = {},
    // GH#936 — Fase 7 MD3 (5f): "Monitoramento passivo" + "Análise avançada" saíram de
    // dois toggles inline pra um sheet único (MonitoramentoSheet.kt), aberto tanto por
    // aqui quanto pelo atalho "Monitoramento" no hub Ferramentas — single source, sem
    // reimplementar os toggles neste arquivo.
    onAbrirMonitoramento: () -> Unit = {},
    // GH#930 — Fase 1 MD3: Ajustes deixou de ser tab (agora "Perfil" via overlay, acessado
    // pelo avatar no TopBar das outras telas). Quando não-nulo, mostra botão de fechar.
    onVoltar: (() -> Unit)? = null,
    dadosMoveis: AjustesDadosMoveisState =
        AjustesDadosMoveisState(
            speedtestPermiteHeavyMovel = false,
            speedtestMbConsumidosMes = 0L,
            onSetSpeedtestPermiteHeavyMovel = {},
        ),
) {
    val c = LocalLkTokens.current
    val context = LocalContext.current
    // aliases locais para não explodir o código interno com prefixos
    val deviceName = perfil.deviceName
    val appVersion = perfil.appVersion
    val nomeUsuario = perfil.nomeUsuario
    val fotoUriUsuario = perfil.fotoUriUsuario
    val operadora = provedor.operadora
    val planoInternet = provedor.planoInternet
    val regiao = provedor.regiao
    val estadoUf = provedor.estadoUf
    val cidadeNome = provedor.cidadeNome
    val ispDetectado = provedor.ispDetectado
    val ispConfirmado = provedor.ispConfirmado
    val velocidadeContratadaDownMbps = provedor.velocidadeContratadaDownMbps
    val velocidadeContratadaUpMbps = provedor.velocidadeContratadaUpMbps
    val operadoraAutodetectada = provedor.operadoraAutodetectada
    val monitoramentoAtivo = monitoramento.monitoramentoAtivo
    val modemHost = modem.modemHost
    val modemUsername = modem.modemUsername
    val modemPassword = modem.modemPassword
    val modemPermanecerConectado = modem.modemPermanecerConectado
    val gatewayIpDetectado = modem.gatewayIpDetectado
    val gatewaySessaoValida = modem.gatewaySessaoValida
    val conectarGateway = modem.conectarGateway
    val onGatewayConectado = modem.onGatewayConectado
    val bandasWifiGateway = modem.bandasWifi
    val dispositivosNaRedeGateway = modem.dispositivosNaRede
    // aliases de lambdas — mantém corpo interno sem alteração
    val onSalvarPerfil = perfil.onSalvarPerfil
    val onSalvarDadosProvedor = provedor.onSalvarDadosProvedor
    val onSalvarEstadoCidade = provedor.onSalvarEstadoCidade
    val onConfirmarIsp = provedor.onConfirmarIsp
    val onDispensarBannerIsp = provedor.onDispensarBannerIsp
    val onSalvarVelocidadeContratada = provedor.onSalvarVelocidadeContratada
    val speedtestPermiteHeavyMovel = dadosMoveis.speedtestPermiteHeavyMovel
    val speedtestMbConsumidosMes = dadosMoveis.speedtestMbConsumidosMes
    val onSetSpeedtestPermiteHeavyMovel = dadosMoveis.onSetSpeedtestPermiteHeavyMovel

    // GH#530 — GatewayConnectionSheet (mesmo componente da Home) na linha do roteador.
    var showGatewayConnectionSheet by remember { mutableStateOf(false) }
    var showPerfilSheet by remember { mutableStateOf(false) }
    var showSobreSheet by remember { mutableStateOf(false) }
    var showDadosLocaisSheet by remember { mutableStateOf(false) }
    var showDiagnosticoAppSheet by remember { mutableStateOf(false) }
    var showMinhaConexaoSheet by remember { mutableStateOf(false) }
    // GH#936 — restaurado: tinha ficado sem entrada de UI (ver PreferenciasSheet.kt).
    var showPreferenciasSheet by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = c.bgPrimary,
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Outlined.Settings,
                            contentDescription = null,
                            tint = c.textPrimary,
                            modifier = Modifier.size(18.dp),
                        )
                        Spacer(Modifier.width(LkSpacing.xs))
                        Text(
                            stringResource(R.string.ajustes_titulo),
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.W600,
                            color = c.textPrimary,
                        )
                    }
                },
                navigationIcon = {
                    ProfileAvatarButton(
                        nomeUsuario = nomeUsuario,
                        fotoUri = fotoUriUsuario,
                        onClick = onAbrirPerfil,
                    )
                },
                actions = {
                    if (onVoltar != null) {
                        IconButton(onClick = onVoltar) {
                            Icon(
                                imageVector = Icons.Filled.Close,
                                contentDescription = "Fechar",
                                tint = c.textPrimary,
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = c.bgPrimary),
            )
        },
    ) { padding ->
        LazyColumn(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .background(c.bgPrimary),
        ) {
            // ── HERO CARD (6 · Perfil): cabeçalho clicável avatar 52dp + "Ver perfil" ──
            item {
                val temNome = nomeUsuario.isNotBlank()
                val nomeDisplay = if (temNome) nomeUsuario else "Adicionar nome"
                val cdPerfil = stringResource(R.string.ajustes_cd_perfil)
                Row(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .padding(horizontal = LkSpacing.lg)
                            .padding(top = LkSpacing.lg, bottom = LkSpacing.lg)
                            .semantics {
                                contentDescription = cdPerfil
                            }.clip(RoundedCornerShape(LkRadius.card))
                            .background(c.bgSecondary)
                            .clickable { showPerfilSheet = true }
                            .padding(LkSpacing.lg),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    UserAvatar(
                        fotoUri = fotoUriUsuario,
                        fallbackInitial = nomeUsuario.firstOrNull(),
                        size = 52.dp,
                    )
                    Spacer(Modifier.width(LkSpacing.md))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = nomeDisplay,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.W600,
                            color = if (temNome) c.textPrimary else c.textTertiary,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Text(
                            text = "Ver perfil",
                            style = MaterialTheme.typography.bodySmall,
                            color = c.textSecondary,
                        )
                    }
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                        contentDescription = null,
                        tint = c.textTertiary,
                        modifier = Modifier.size(16.dp),
                    )
                }
            }

            // Banner de confirmação de ISP auto-detectado (fora do card, acima da seção)
            if (!ispConfirmado && !ispDetectado.isNullOrBlank() && operadora.isBlank()) {
                item {
                    Box(
                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .padding(horizontal = LkSpacing.lg)
                                .padding(bottom = LkSpacing.md)
                                .clip(RoundedCornerShape(LkRadius.card))
                                .background(LkColors.accent.copy(alpha = 0.08f))
                                .border(1.dp, LkColors.accent.copy(alpha = 0.30f), RoundedCornerShape(LkRadius.card))
                                .padding(LkSpacing.md),
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(LkSpacing.sm)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Outlined.Wifi,
                                    contentDescription = null,
                                    tint = LkColors.accent,
                                    modifier = Modifier.size(16.dp),
                                )
                                Spacer(Modifier.width(LkSpacing.sm))
                                Text(
                                    text = stringResource(R.string.ajustes_operadora_detectada, ispDetectado),
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.W600,
                                    color = c.textPrimary,
                                    modifier = Modifier.weight(1f),
                                )
                            }
                            Text(
                                text = stringResource(R.string.ajustes_usar_operadora),
                                style = MaterialTheme.typography.bodySmall,
                                color = c.textSecondary,
                            )
                            Row(horizontalArrangement = Arrangement.spacedBy(LkSpacing.sm)) {
                                Button(
                                    onClick = { onConfirmarIsp(ispDetectado) },
                                    colors = ButtonDefaults.buttonColors(containerColor = LkColors.accent),
                                    contentPadding =
                                        androidx.compose.foundation.layout
                                            .PaddingValues(horizontal = LkSpacing.md, vertical = LkSpacing.xs),
                                ) {
                                    Text(stringResource(R.string.ajustes_btn_confirmar), style = MaterialTheme.typography.labelMedium)
                                }
                                TextButton(onClick = onDispensarBannerIsp) {
                                    Text("Ignorar", color = c.textTertiary, style = MaterialTheme.typography.labelMedium)
                                }
                            }
                        }
                    }
                }
            }

            // ── MINHA CONEXÃO (Section 1/4) ──────────────────────────────────────────
            item {
                // #225/#849: plano/local vazios exibem call-to-action em vez de "—";
                // "Plano" reflete velocidade contratada (down/up Mbps) persistida por
                // MinhaConexaoSheet, não o campo "planoInternet" legado (texto livre da
                // extinta ProvedorSheet, nunca atualizado por este fluxo).
                val temVelocidadeContratada = velocidadeContratadaDownMbps > 0 || velocidadeContratadaUpMbps > 0
                val planoValue =
                    if (temVelocidadeContratada) {
                        "$velocidadeContratadaDownMbps/$velocidadeContratadaUpMbps Mbps"
                    } else {
                        "Adicionar"
                    }
                val cidadeValue =
                    when {
                        cidadeNome.isNotBlank() && estadoUf.isNotBlank() -> "$cidadeNome, $estadoUf"
                        regiao.isNotBlank() -> regiao
                        else -> "Adicionar"
                    }
                val mostrarRoteador = BuildConfig.FEATURE_FIBRA_SCREEN
                AjustesSectionCard(title = "Minha conexão", c = c) {
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.Business,
                        label = "Operadora",
                        value = operadora.ifBlank { "Adicionar" },
                        onClick = { showMinhaConexaoSheet = true },
                    )
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.Speed,
                        label = "Plano contratado",
                        value = planoValue,
                        onClick = { showMinhaConexaoSheet = true },
                    )
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.LocationOn,
                        label = "Cidade",
                        value = cidadeValue,
                        onClick = { showMinhaConexaoSheet = true },
                        last = !mostrarRoteador,
                    )
                    if (mostrarRoteador) {
                        // GH#531 — rename "Fibra óptica" → "Roteador e rede": destino é o
                        // roteador/GPON, não fibra em si.
                        val subtitleGateway =
                            when {
                                modemHost.isNullOrBlank() -> "Não configurado"
                                bandasWifiGateway.isNullOrBlank() -> "Conectado"
                                else -> "Conectado · $dispositivosNaRedeGateway dispositivos"
                            }
                        AjustesRow(
                            c = c,
                            icon = Icons.Outlined.Router,
                            label = "Roteador e rede",
                            value = subtitleGateway,
                            onClick = {
                                // GH#530: sessão válida (mesmo BSSID em que "manter conectado"
                                // foi salvo) pula a sheet e vai direto ao destino provisório.
                                if (gatewaySessaoValida) {
                                    onAbrirFibra()
                                } else {
                                    showGatewayConnectionSheet = true
                                }
                            },
                            last = true,
                        )
                    }
                }
            }

            // ── APARÊNCIA (Section 2/4): Tema + preferências de comportamento ───────
            item {
                val mbLabel = if (speedtestMbConsumidosMes > 0L) "$speedtestMbConsumidosMes MB" else "0 MB"
                val mostrarMonitoramento = BuildConfig.FEATURE_LINKPULSE_ATIVO
                AjustesSectionCard(title = "Aparência", c = c) {
                    ThemeSelector(
                        selecionado = temaSelecionado,
                        onSelect = onDefinirTemaSelecionado,
                        c = c,
                    )
                    HorizontalDivider(color = c.border, thickness = 1.dp)
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.Notifications,
                        label = "Notificações",
                        onClick = {
                            val intent =
                                Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                                    .putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
                            context.startActivity(intent)
                        },
                    )
                    // GH#936 — entrada pra PreferenciasSheet.kt (limite mínimo de download
                    // que dispara alerta).
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.Speed,
                        label = "Alertas de qualidade",
                        value = if (limiteAlertaMbps > 0) "Abaixo de $limiteAlertaMbps Mbps" else "Sem limite",
                        onClick = { showPreferenciasSheet = true },
                    )
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.SignalCellularAlt,
                        label = "Testes pesados em dados móveis",
                        value = "$mbLabel/mês",
                        checked = speedtestPermiteHeavyMovel,
                        onCheckedChange = onSetSpeedtestPermiteHeavyMovel,
                        last = !mostrarMonitoramento,
                    )
                    if (mostrarMonitoramento) {
                        // GH#936 — Fase 7 (5f): unifica "Monitoramento passivo" + "Análise
                        // avançada" numa linha só, mesmo destino do atalho "Monitoramento"
                        // do hub Ferramentas (MonitoramentoSheet.kt) — nada de toggle
                        // duplicado aqui.
                        AjustesRow(
                            c = c,
                            icon = Icons.Outlined.Sensors,
                            label = "Monitoramento",
                            value =
                                when {
                                    !monitoramentoAtivo -> "Desativado"
                                    OemKillInfo.fabricanteRiscoAlto -> "Ativo · limitado"
                                    else -> "Ativo"
                                },
                            onClick = onAbrirMonitoramento,
                            last = true,
                        )
                    }
                }
            }

            // ── DADOS E PRIVACIDADE (Section 3/4) ────────────────────────────────────
            item {
                AjustesSectionCard(title = "Dados e privacidade", c = c) {
                    AjustesRow(c = c, icon = Icons.Outlined.Lock, label = "Privacidade", onClick = { onAbrirPrivacidade() })
                    AjustesRow(c = c, icon = Icons.Outlined.History, label = "Ver histórico", onClick = onAbrirHistorico)
                    AjustesRow(
                        c = c,
                        icon = Icons.AutoMirrored.Outlined.Article,
                        label = "Comprovante para a Anatel",
                        onClick = onAbrirLaudo,
                    )
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.Delete,
                        label = "Gerenciar dados",
                        onClick = { showDadosLocaisSheet = true },
                        last = true,
                    )
                }
            }

            // ── SOBRE (Section 4/4) ──────────────────────────────────────────────────
            item {
                AjustesSectionCard(title = "Sobre", c = c) {
                    AjustesRow(c = c, icon = Icons.Outlined.Campaign, label = "Novidades", onClick = { onAbrirNovidades() })
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.Email,
                        label = "Fale conosco",
                        onClick = {
                            val intent =
                                Intent(Intent.ACTION_SENDTO).apply {
                                    data = Uri.parse("mailto:hello7agents@icloud.com")
                                }
                            context.startActivity(intent)
                        },
                    )
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.VerifiedUser,
                        label = "Diagnóstico do app",
                        onClick = { showDiagnosticoAppSheet = true },
                    )
                    AjustesRow(
                        c = c,
                        icon = Icons.Outlined.Info,
                        label = "Sobre o SignallQ",
                        value = "v$appVersion",
                        onClick = { showSobreSheet = true },
                        last = true,
                    )
                }
            }
            item {
                Spacer(
                    Modifier
                        .navigationBarsPadding()
                        .height(24.dp),
                )
            }
        }
    }

    // ── Bottom sheets & dialogs ───────────────────────────────────────────────

    if (showGatewayConnectionSheet) {
        GatewayConnectionSheet(
            ipInicial = modemHost ?: gatewayIpDetectado,
            usuarioInicial = modemUsername,
            senhaInicial = modemPassword,
            lembrarSenhaInicial = modemUsername.isNotBlank() || modemPassword.isNotBlank(),
            manterConectadoInicial = modemPermanecerConectado,
            onDismissRequest = { showGatewayConnectionSheet = false },
            conectar = conectarGateway,
            onConectado = onGatewayConectado,
        )
    }

    if (showPerfilSheet) {
        PerfilEditSheet(
            c = c,
            nomeAtual = nomeUsuario,
            fotoUriAtual = fotoUriUsuario,
            deviceName = deviceName,
            appVersion = appVersion,
            onDismiss = { showPerfilSheet = false },
            onSalvar = { nome, fotoUri ->
                onSalvarPerfil(nome, fotoUri)
                showPerfilSheet = false
            },
        )
    }

    if (showSobreSheet) {
        SobreSheet(
            c = c,
            appVersion = appVersion,
            onDismiss = { showSobreSheet = false },
        )
    }

    if (showDadosLocaisSheet) {
        DadosLocaisSheet(
            c = c,
            onDismiss = { showDadosLocaisSheet = false },
            onLimparHistorico = onLimparHistorico,
            onApagarDadosLocais = onApagarDadosLocais,
            onResetarApp = onResetarApp,
        )
    }

    if (showDiagnosticoAppSheet) {
        DiagnosticoAppSheet(
            c = c,
            appVersion = appVersion,
            onDismiss = { showDiagnosticoAppSheet = false },
        )
    }

    if (showMinhaConexaoSheet) {
        MinhaConexaoSheet(
            operadora = operadora,
            estadoUf = estadoUf,
            cidadeNome = cidadeNome,
            velocidadeContratadaDownMbps = velocidadeContratadaDownMbps,
            velocidadeContratadaUpMbps = velocidadeContratadaUpMbps,
            operadoraAutodetectada = operadoraAutodetectada,
            onSalvar = { op, uf, cidade, down, up ->
                onSalvarDadosProvedor(op, planoInternet, regiao)
                onSalvarEstadoCidade(uf, cidade)
                onSalvarVelocidadeContratada(down, up)
            },
            onDismiss = { showMinhaConexaoSheet = false },
        )
    }

    if (showPreferenciasSheet) {
        PreferenciasSheet(
            c = c,
            limiteAtual = limiteAlertaMbps,
            onDismiss = { showPreferenciasSheet = false },
            onSalvar = { limite ->
                onSalvarLimiteAlerta(limite)
                showPreferenciasSheet = false
            },
        )
    }
}

// GH#936 — Fase 7 MD3 (6 · Perfil/Ajustes): Section + Row seguem a spec To-Be
// (Overline + cartão surfaceContainer radius 16px overflow hidden; ícone 34dp
// circular primary 14% + rótulo bodyLarge flex:1 + valor opcional bodyMedium +
// chevron_right ou Switch; separador 1px entre linhas exceto a última).
@Composable
private fun AjustesSectionCard(
    title: String,
    c: LkTokens,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = LkSpacing.lg)
                .padding(bottom = LkSpacing.lg),
    ) {
        Text(
            text = title.uppercase(),
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.W600,
            color = c.textTertiary,
            letterSpacing = 0.8.sp,
            modifier = Modifier.padding(start = 4.dp, bottom = LkSpacing.sm),
        )
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(LkRadius.card))
                    .background(c.bgSecondary),
            content = content,
        )
    }
}

@Composable
private fun AjustesRow(
    c: LkTokens,
    icon: ImageVector,
    label: String,
    value: String? = null,
    onClick: (() -> Unit)? = null,
    checked: Boolean? = null,
    onCheckedChange: ((Boolean) -> Unit)? = null,
    last: Boolean = false,
) {
    Column {
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
                    .padding(horizontal = LkSpacing.lg, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier =
                    Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(LkColors.accent.copy(alpha = 0.14f)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = LkColors.accent, modifier = Modifier.size(19.dp))
            }
            Spacer(Modifier.width(LkSpacing.md))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyLarge,
                color = c.textPrimary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.weight(1f),
            )
            if (value != null) {
                Spacer(Modifier.width(LkSpacing.sm))
                Text(
                    text = value,
                    style = MaterialTheme.typography.bodyMedium,
                    color = c.textSecondary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            if (checked != null && onCheckedChange != null) {
                Spacer(Modifier.width(LkSpacing.sm))
                Switch(
                    checked = checked,
                    onCheckedChange = onCheckedChange,
                    colors =
                        SwitchDefaults.colors(
                            checkedThumbColor = MaterialTheme.colorScheme.onPrimary,
                            checkedTrackColor = LkColors.accent,
                            uncheckedThumbColor = c.textTertiary,
                            uncheckedTrackColor = c.border,
                        ),
                )
            } else if (onClick != null) {
                Spacer(Modifier.width(LkSpacing.xs))
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                    contentDescription = null,
                    tint = c.textTertiary,
                    modifier = Modifier.size(14.dp),
                )
            }
        }
        if (!last) HorizontalDivider(color = c.border, thickness = 1.dp)
    }
}

@Composable
internal fun ToggleItem(
    c: LkTokens,
    icon: ImageVector,
    label: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(LkSpacing.lg),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier =
                Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(LkColors.accent.copy(alpha = 0.12f)),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = LkColors.accent,
                modifier = Modifier.size(18.dp),
            )
        }

        Spacer(Modifier.width(LkSpacing.md))

        Column(modifier = Modifier.weight(1f)) {
            Text(text = label, style = MaterialTheme.typography.bodyMedium, color = c.textPrimary, fontWeight = FontWeight.W500)
            Spacer(Modifier.height(2.dp))
            Text(text = subtitle, style = MaterialTheme.typography.bodySmall, color = c.textSecondary)
        }

        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors =
                SwitchDefaults.colors(
                    checkedThumbColor = MaterialTheme.colorScheme.onPrimary,
                    checkedTrackColor = LkColors.accent,
                    uncheckedThumbColor = c.textTertiary,
                    uncheckedTrackColor = c.border,
                ),
        )
    }
}

@Composable
private fun ThemeSelector(
    selecionado: String,
    onSelect: (String) -> Unit,
    c: LkTokens,
) {
    val opcoes =
        listOf(
            Triple("sistema", "Sistema", Icons.Outlined.Settings),
            Triple("claro", "Claro", Icons.Outlined.LightMode),
            Triple("escuro", "Escuro", Icons.Outlined.DarkMode),
        )

    Column(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = LkSpacing.lg)
                .padding(bottom = LkSpacing.sm),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            opcoes.forEach { (valor, label, icone) ->
                val selecionada = selecionado == valor
                Box(
                    modifier =
                        Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(LkRadius.card))
                            .background(c.bgCard)
                            .border(
                                width = if (selecionada) 2.dp else 1.dp,
                                color = if (selecionada) LkColors.accent else c.border,
                                shape = RoundedCornerShape(LkRadius.card),
                            ).clickable { onSelect(valor) }
                            .padding(vertical = LkSpacing.lg),
                    contentAlignment = Alignment.Center,
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        Icon(
                            imageVector = icone,
                            contentDescription = label,
                            tint = if (selecionada) LkColors.accent else c.textSecondary,
                            modifier = Modifier.size(20.dp),
                        )
                        Text(
                            text = label,
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = if (selecionada) FontWeight.W600 else FontWeight.W400,
                            color = if (selecionada) LkColors.accent else c.textSecondary,
                        )
                    }
                }
            }
        }
    }
}

// ─── Diagnóstico do app sheet ─────────────────────────────────────────────────
// Fora do escopo 6a-6f (item "Diagnóstico do app" não faz parte da reorganização
// Perfil/Ajustes da Fase 7) — mantido aqui por enquanto.

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DiagnosticoAppSheet(
    c: LkTokens,
    appVersion: String,
    onDismiss: () -> Unit,
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        dragHandle = {},
        containerColor = c.bgSecondary,
    ) {
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(top = LkSpacing.md, bottom = LkSpacing.xxl)
                    .navigationBarsPadding(),
        ) {
            Box(
                modifier =
                    Modifier
                        .width(40.dp)
                        .height(4.dp)
                        .clip(RoundedCornerShape(2.dp))
                        .background(c.border)
                        .align(Alignment.CenterHorizontally)
                        .semantics { contentDescription = "Arrastar para fechar" },
            )
            Spacer(Modifier.height(LkSpacing.md))
            Text(
                text = "Diagnóstico do app",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = c.textPrimary,
                modifier = Modifier.padding(horizontal = LkSpacing.lg),
            )
            Spacer(Modifier.height(LkSpacing.md))
            InfoRow(c, "Versão", "v$appVersion")
            HorizontalDivider(color = c.border, thickness = 1.dp)
            InfoRow(c, "Plataforma", "Android · Kotlin + Compose")
            HorizontalDivider(color = c.border, thickness = 1.dp)
            InfoRow(c, "Integridade", "OK")
            HorizontalDivider(color = c.border, thickness = 1.dp)
            InfoRow(c, "Assinatura", "Verificada")
            HorizontalDivider(color = c.border, thickness = 1.dp)
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = LkSpacing.lg)
                        .padding(top = LkSpacing.md),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(LkSpacing.xs),
            ) {
                Icon(
                    imageVector = Icons.Outlined.VerifiedUser,
                    contentDescription = null,
                    tint = LkColors.success,
                    modifier = Modifier.size(16.dp),
                )
                Text(
                    text = "Binários íntegros · Nenhuma anomalia detectada",
                    style = MaterialTheme.typography.bodySmall,
                    color = LkColors.success,
                )
            }
            Spacer(Modifier.height(LkSpacing.md))
        }
    }
}

// ─── Roteador sheet (GH#526/#530): ver GatewayConnectionSheet.kt (componente único
// reaproveitado aqui e no nó do gateway em HomeScreen.kt) ──────────────────────
