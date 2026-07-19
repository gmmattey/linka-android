package io.signallq.pro.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import io.signallq.pro.core.designsystem.ProShapes

// MVP0: só o esquema claro está implementado — o modo escuro oficial (paridade total de
// hierarquia com o claro, ver skill signallq-pro-design) fica pra fase de UI real (Fase 2+),
// não é foco do esqueleto.
private val ProLightColorScheme =
    lightColorScheme(
        primary = ProPrimary,
        primaryContainer = ProPrimaryContainer,
        secondary = ProSecondary,
        secondaryContainer = ProSecondaryContainer,
        tertiary = ProTertiary,
        tertiaryContainer = ProTertiaryContainer,
        error = ProError,
        errorContainer = ProErrorContainer,
        background = ProBackground,
        surface = ProSurface,
        surfaceContainerHigh = ProSurfaceContainerHigh,
        outline = ProOutline,
        inverseSurface = ProInverseSurface,
    )

@Composable
fun SignallQProTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ProLightColorScheme,
        typography = signallQProTypography,
        shapes = ProShapes,
        content = content,
    )
}
