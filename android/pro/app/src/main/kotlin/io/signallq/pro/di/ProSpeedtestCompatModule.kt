package io.signallq.pro.di

import android.content.Context
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.signallq.app.core.datastore.PreferenciasAppRepository
import io.signallq.app.core.network.AnalyticsHelper
import io.signallq.app.core.network.AnalyticsTracker
import io.signallq.app.core.network.CoreNetworkModulo
import io.signallq.app.core.network.DefaultDispatcherProvider
import io.signallq.app.core.network.DispatcherProvider
import io.signallq.app.core.network.MonitorRede
import io.signallq.app.core.network.NetworkCapabilitiesProvider
import io.signallq.app.core.network.NoOpAnalyticsHelper
import io.signallq.app.core.telephony.CoreTelephonyModulo
import io.signallq.app.core.telephony.MonitorTelephony
import io.signallq.app.feature.speedtest.ExecutorSpeedtest
import io.signallq.app.feature.speedtest.FeatureSpeedtestModulo
import javax.inject.Singleton

/**
 * Compatibilidade de DI para reaproveitar `:featureSpeedtest` no Pro (issue #1161, Fase 2).
 *
 * `:featureSpeedtest` expõe `SpeedtestViewModel` (`@HiltViewModel`) — o processador de
 * agregacao do Hilt inclui esse ViewModel no grafo de QUALQUER app que tenha o modulo no
 * classpath, mesmo que o Pro nunca chame `hiltViewModel<SpeedtestViewModel>()` (o Pro usa o
 * motor via `FeatureSpeedtestModulo.criarExecutorSpeedtest()` direto, sem Hilt). Sem estes
 * bindings o `:pro:app` nao compila (`Dagger/MissingBinding`).
 *
 * `MonitorRede`/`NetworkCapabilitiesProvider`/`MonitorTelephony`/`DispatcherProvider` sao
 * infra genuinamente reutilizavel (`:coreNetwork`/`:coreTelephony`, zero acoplamento ao
 * consumidor) — instanciados de verdade, escopados ao processo do Pro.
 * `PreferenciasAppRepository` tambem e reutilizavel (`:coreDatastore`), mas grava num
 * DataStore proprio do processo do Pro -- nao compartilha arquivo com o consumidor (apps
 * diferentes, processos diferentes).
 * `AnalyticsHelper`/`AnalyticsTracker` usam no-op: o Pro ainda nao tem projeto Firebase
 * proprio configurado (pendente, issue #1158) -- `NoOpAnalyticsHelper` ja e o padrao oficial
 * do proprio `:coreNetwork` para uso fora do grafo Hilt do consumidor.
 */
@Module
@InstallIn(SingletonComponent::class)
object ProSpeedtestCompatModule {
    @Provides
    @Singleton
    fun provideDispatcherProvider(): DispatcherProvider = DefaultDispatcherProvider()

    @Provides
    @Singleton
    fun providePreferenciasAppRepository(
        @ApplicationContext context: Context,
        dispatchers: DispatcherProvider,
    ): PreferenciasAppRepository = PreferenciasAppRepository(context, dispatchers.io)

    @Provides
    @Singleton
    fun provideMonitorRede(
        @ApplicationContext context: Context,
    ): MonitorRede = CoreNetworkModulo.criarMonitorRede(context)

    @Provides
    @Singleton
    fun provideNetworkCapabilitiesProvider(
        @ApplicationContext context: Context,
    ): NetworkCapabilitiesProvider = CoreNetworkModulo.criarNetworkCapabilitiesProvider(context)

    @Provides
    @Singleton
    fun provideMonitorTelephony(
        @ApplicationContext context: Context,
    ): MonitorTelephony = CoreTelephonyModulo.criarMonitorTelephony(context)

    @Provides
    @Singleton
    fun provideAnalyticsHelper(): AnalyticsHelper = NoOpAnalyticsHelper

    @Provides
    @Singleton
    fun provideAnalyticsTracker(): AnalyticsTracker = NoOpAnalyticsTrackerPro

    /** [SpeedtestViewModel] em si nunca e chamado pelo Pro -- so satisfaz o grafo agregado
     *  do Hilt. `:pro:feature:medicao-diagnostico` cria seu proprio executor via
     *  [FeatureSpeedtestModulo] diretamente, sem depender deste binding. */
    @Provides
    fun provideExecutorSpeedtest(): ExecutorSpeedtest = FeatureSpeedtestModulo.criarExecutorSpeedtest()
}

/** Sem equivalente oficial em `:coreNetwork` (so [NoOpAnalyticsHelper] existe la) --
 *  no-op minimo proprio do Pro, mesmo espirito. */
private object NoOpAnalyticsTrackerPro : AnalyticsTracker {
    override fun registrarFeatureUsada(
        featureId: String,
        sessionIdOverride: String?,
    ) = Unit

    override fun registrarScreenView(screenName: String) = Unit

    override fun registrarSessionStart() = Unit

    override fun registrarFeatureCrash(
        featureId: String,
        errorType: String,
    ) = Unit

    override fun registrarBatterySnapshot(
        level: Int,
        charging: Boolean,
    ) = Unit
}
