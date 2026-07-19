package io.signallq.pro.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import io.signallq.pro.R

// Escala tipográfica oficial do SignallQ Pro -- snapshot 2026-07-19 do projeto Claude Design
// "SignallQ PRO - Design System" (CSS real, não mais descrição textual do handoff anterior
// que causou o app ficar "0% a ver com o protótipo"). Fonte física reaproveitada do
// consumidor (Google Sans Flex, mesmos arquivos .ttf em pro/app/src/main/res/font/).
//
// lineHeight/letterSpacing de cada slot não vieram no snapshot (só size+weight por nível) --
// inferidos seguindo a mesma proporção usada pelo SignallQTheme.kt do consumidor. titleSmall
// também não veio no snapshot (a escala pulou de titleLarge pra titleMedium); usado
// 14sp/SemiBold pra manter a hierarquia entre titleLarge (seção) e titleMedium (corpo) --
// reavaliar se/quando o CSS real cobrir esse slot.
private val proFontFamily =
    FontFamily(
        Font(R.font.google_sans_flex_regular, weight = FontWeight.Normal),
        Font(R.font.google_sans_flex_medium, weight = FontWeight.Medium),
        Font(R.font.google_sans_flex_semibold, weight = FontWeight.SemiBold),
        Font(R.font.google_sans_flex_bold, weight = FontWeight.Bold),
    )

private fun proTextStyle(
    fontSize: Int,
    lineHeight: Int,
    fontWeight: FontWeight,
    letterSpacing: Float,
) = TextStyle(
    fontFamily = proFontFamily,
    fontSize = fontSize.sp,
    lineHeight = lineHeight.sp,
    fontWeight = fontWeight,
    letterSpacing = letterSpacing.sp,
)

val signallQProTypography =
    Typography(
        // display: 32sp/600
        displayLarge = proTextStyle(32, 40, FontWeight.SemiBold, 0f),
        displayMedium = proTextStyle(32, 40, FontWeight.SemiBold, 0f),
        displaySmall = proTextStyle(32, 40, FontWeight.SemiBold, 0f),
        // title: 24sp/600
        headlineLarge = proTextStyle(24, 30, FontWeight.SemiBold, 0f),
        headlineMedium = proTextStyle(24, 30, FontWeight.SemiBold, 0f),
        headlineSmall = proTextStyle(24, 30, FontWeight.SemiBold, 0f),
        // section: 18sp/600
        titleLarge = proTextStyle(18, 24, FontWeight.SemiBold, 0f),
        // inferido -- ver nota acima
        titleSmall = proTextStyle(14, 20, FontWeight.SemiBold, 0.1f),
        // body: 16sp/400
        titleMedium = proTextStyle(16, 22, FontWeight.Normal, 0.15f),
        bodyLarge = proTextStyle(16, 24, FontWeight.Normal, 0.15f),
        // support: 14sp/400
        bodyMedium = proTextStyle(14, 20, FontWeight.Normal, 0.2f),
        labelLarge = proTextStyle(14, 20, FontWeight.Normal, 0.1f),
        // label: 12sp/500
        bodySmall = proTextStyle(12, 16, FontWeight.Medium, 0.3f),
        labelMedium = proTextStyle(12, 16, FontWeight.Medium, 0.3f),
        labelSmall = proTextStyle(12, 16, FontWeight.Medium, 0.4f),
    )
