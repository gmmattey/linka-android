package io.signallq.app.ui.component

import androidx.compose.animation.core.EaseInOut
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import io.signallq.app.ui.LkRadius
import io.signallq.app.ui.LocalLkTokens
import io.signallq.app.ui.SignallQTheme

/**
 * Bloco de carregamento "esqueleto" do design system SignallQ — usado enquanto o
 * conteúdo real ainda não chegou (ex.: tela 1a Análise detalhada aguardando
 * resposta do serviço de diagnóstico, tela 5b Equipamento de internet).
 *
 * Fonte de verdade: Fluxo de Telas To-Be — fundo `surfaceContainerHigh`, radius
 * 10px, animação de opacidade .45↔1 em loop ~1.1-1.4s.
 */
@Composable
fun Skeleton(
    modifier: Modifier = Modifier,
    height: Dp = 16.dp,
) {
    val c = LocalLkTokens.current
    val transicao = rememberInfiniteTransition(label = "skeleton")
    val alpha by transicao.animateFloat(
        initialValue = 0.45f,
        targetValue = 1f,
        animationSpec =
            infiniteRepeatable(
                animation = tween(durationMillis = 1250, easing = EaseInOut),
                repeatMode = RepeatMode.Reverse,
            ),
        label = "skeletonAlpha",
    )
    Box(
        modifier =
            modifier
                .fillMaxWidth()
                .height(height)
                .alpha(alpha)
                .clip(RoundedCornerShape(10.dp))
                .background(c.onSurfaceVariant.copy(alpha = 0.16f)),
    )
}

/** Card "esqueleto" — mesmo formato dos cards `surfaceContainer` radius 16px do
 *  design system, preenchido só com blocos [Skeleton]. */
@Composable
fun SkeletonCard(modifier: Modifier = Modifier) {
    val c = LocalLkTokens.current
    Column(
        modifier =
            modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(LkRadius.card))
                .background(c.bgSecondary)
                .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Skeleton(height = 14.dp, modifier = Modifier.fillMaxWidth(0.4f))
        Skeleton(height = 18.dp)
        Skeleton(height = 18.dp, modifier = Modifier.fillMaxWidth(0.75f))
    }
}

@Preview(name = "Skeleton — claro", showBackground = true)
@Composable
private fun SkeletonPreview() {
    SignallQTheme {
        Column(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.padding(16.dp),
        ) {
            SkeletonCard()
            SkeletonCard()
        }
    }
}
