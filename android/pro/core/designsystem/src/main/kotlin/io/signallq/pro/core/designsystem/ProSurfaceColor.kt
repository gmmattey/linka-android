package io.signallq.pro.core.designsystem

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Nivel 3 de profundidade (issue #1170 item 3, doc 10_SignallQ_Pro_Design_System_v5.md secao
// 4.1: dialog/bottom sheet/menu/tooltip). Valores 1:1 com ProSurfaceOverlay/ProDarkSurfaceOverlay
// (io.signallq.pro.ui.theme.SignallQProColor, :pro:app) -- duplicados aqui porque
// :pro:core:designsystem nao pode depender de :pro:app (lei de dependencia, ver
// .claude/rules/higiene-e-padronizacao-repositorio.md, secao 5), mesmo padrao ja usado em
// ProStatusColor.kt para ProSuccess/ProWarning.
private val ProSurfaceOverlayClaro = Color(0xFFFFFFFF)
private val ProSurfaceOverlayEscuro = Color(0xFF20262E)

/** Cor de fundo de dialog/bottom sheet/menu -- Nivel 3 de profundidade, nunca em card comum. */
@Composable
fun corSurfaceOverlay(): Color = if (isSystemInDarkTheme()) ProSurfaceOverlayEscuro else ProSurfaceOverlayClaro
