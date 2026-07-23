package io.signallq.app.ads

import io.signallq.app.BuildConfig

/**
 * Ad Unit IDs de anuncio nativo (AdMob) -- issue #555.
 *
 * Conta AdMob real criada pelo Luiz (App ID em producao no AndroidManifest desde
 * 2026-07-20). Cada slot tem seu proprio bloco de anuncio nativo real no console AdMob,
 * criado em 2026-07-20 -- granularidade de relatorio por tela, cada Ad Unit ID abaixo
 * mapeia 1:1 para um bloco.
 *
 * NUNCA clicar repetidamente em anuncio de producao durante teste manual (risco de
 * banimento da conta AdMob por trafego invalido).
 *
 * Issue #1330: conta AdMob esta em revisao no Console (conta nova) e nao veicula anuncio
 * real ainda -- efeito colateral, [para] sempre resolvia pra ID real mesmo em build de
 * teste, entao ninguem conseguia validar visualmente o carregamento/exibicao do anuncio
 * nativo enquanto a revisao nao sai. Build [BuildConfig.DEBUG] (mesmo mecanismo usado em
 * `SignallQApplication.onCreate()` e `AppModule.kt`) agora resolve pro ID de teste publico
 * do Google -- so build `release` (Play Console, qualquer trilha, incluindo alpha, que
 * compila com o build type `release`) usa o ID real.
 */
object AdUnitIds {
    /** Ad Unit ID real: tela ociosa do Speedtest (bloco "signallq_native_speedtest_idle"). */
    const val NATIVE_VELOCIDADE = "ca-app-pub-5542349230926522/8560335657"

    /** Ad Unit ID real: ResultadoVelocidadeScreen (bloco "signallq_native_resultado_velocidade"). */
    const val NATIVE_RESULTADO = "ca-app-pub-5542349230926522/6784365342"

    /** Ad Unit ID real: tela Dispositivos (bloco "signallq_native_dispositivos"). */
    const val NATIVE_DISPOSITIVOS = "ca-app-pub-5542349230926522/1723610350"

    /** Ad Unit ID real: tela Historico (bloco "signallq_native_historico"). */
    const val NATIVE_HISTORICO = "ca-app-pub-5542349230926522/1600055495"

    /** Ad Unit ID real: fluxo de Jogos (bloco "signallq_native_jogos"). */
    const val NATIVE_JOGOS = "ca-app-pub-5542349230926522/2573657593"

    /**
     * ID de app e Ad Unit ID de teste publicos do Google
     * (https://developers.google.com/admob/android/test-ads). Nao usados pelo fluxo de
     * producao -- mantidos so como referencia para debug manual local (ex.: testar
     * carregamento de anuncio sem gerar impressao/clique faturavel real). Nunca usar
     * em build de release publicado na Play Store.
     */
    const val APPLICATION_ID_TESTE = "ca-app-pub-3940256099942544~3347511713"

    /** Ver [APPLICATION_ID_TESTE]. */
    const val NATIVE_TESTE = "ca-app-pub-3940256099942544/2247696110"

    /**
     * Resolve o Ad Unit ID de anuncio nativo por slot. Em build `debug`
     * ([BuildConfig.DEBUG]), sempre resolve pro ID de teste publico do Google
     * ([NATIVE_TESTE]) -- nunca o ID real, mesmo que o slot exista em producao. Em build
     * `release` (assinado, qualquer trilha da Play Console), resolve pro ID real do slot.
     */
    fun para(slot: AdSlot): String {
        if (BuildConfig.DEBUG) return NATIVE_TESTE
        return when (slot) {
            AdSlot.VELOCIDADE -> NATIVE_VELOCIDADE
            AdSlot.RESULTADO -> NATIVE_RESULTADO
            AdSlot.DISPOSITIVOS -> NATIVE_DISPOSITIVOS
            AdSlot.HISTORICO -> NATIVE_HISTORICO
            AdSlot.JOGOS -> NATIVE_JOGOS
        }
    }
}
