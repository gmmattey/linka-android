package io.veloo.app.feature.diagnostico.di

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.veloo.app.feature.diagnostico.BuildConfig
import io.veloo.app.feature.diagnostico.ai.AiDiagnosisRepository
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DiagnosticoModule {
    /**
     * Provê a instância única de AiDiagnosisRepository no grafo Hilt.
     *
     * Antes desta mudança, AiDiagnosisRepository era instanciada manualmente em dois locais:
     *  - MainViewModel (diagAiRepository by lazy { AiDiagnosisRepository(...) })
     *  - SignallQOrchestrator (private val aiRepository = AiDiagnosisRepository(...))
     *
     * Resultado anterior: dois caches ConcurrentHashMap independentes e a URL duplicada
     * em dois arquivos. Agora há uma única instância com um único cache.
     */
    @Provides
    @Singleton
    fun provideAiDiagnosisRepository(): AiDiagnosisRepository =
        AiDiagnosisRepository(
            baseUrl = BuildConfig.AI_WORKER_URL,
            isAuthorized = { true },
        )
}
