package io.signallq.pro.core.designsystem

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// Tokens de raio oficiais do SignallQ Pro -- snapshot 2026-07-19 do projeto Claude Design
// "SignallQ PRO - Design System" (77a19317-ea64-4e47-b55c-578eca776c09), extraidos pela
// Claudete direto do CSS real (não mais descrição textual). Mesmo padrão do LkRadius do
// consumidor -- reler o projeto online antes de expandir.
object ProRadius {
    val extraSmall: Dp = 4.dp // campo de texto
    val small: Dp = 8.dp // chip
    val medium: Dp = 12.dp // controle/botao outline
    val large: Dp = 16.dp // card
    val extraLarge: Dp = 28.dp // sheet/dialog
    val pill: Dp = 999.dp // pill/botao primario/fab -- fora dos 5 slots de Shapes()
}

// Passado direto pro MaterialTheme(shapes = ProShapes, ...) em SignallQProTheme -- os
// componentes do design system consomem via MaterialTheme.shapes.*, nunca RoundedCornerShape
// chutado. O slot "pill" não existe em Shapes() (M3 só tem 5 slots) -- use
// RoundedCornerShape(ProRadius.pill) direto nesses casos (chip/botao primario/fab).
val ProShapes =
    Shapes(
        extraSmall = RoundedCornerShape(ProRadius.extraSmall),
        small = RoundedCornerShape(ProRadius.small),
        medium = RoundedCornerShape(ProRadius.medium),
        large = RoundedCornerShape(ProRadius.large),
        extraLarge = RoundedCornerShape(ProRadius.extraLarge),
    )
