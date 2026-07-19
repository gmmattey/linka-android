package io.signallq.pro.core.database

import android.content.Context
import androidx.room.Room
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.signallq.pro.core.database.ambiente.AmbienteDao
import io.signallq.pro.core.database.checklist.ChecklistItemDao
import io.signallq.pro.core.database.cliente.ClienteDao
import io.signallq.pro.core.database.diagnostico.DiagnosticoProDao
import io.signallq.pro.core.database.evidencia.EvidenciaDao
import io.signallq.pro.core.database.medicao.MedicaoProDao
import io.signallq.pro.core.database.profissional.ProfissionalDao
import io.signallq.pro.core.database.visita.VisitaDao
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object ProDatabaseModule {
    @Provides
    @Singleton
    fun provideSignallQProDatabase(
        @ApplicationContext context: Context,
    ): SignallQProDatabase =
        Room
            .databaseBuilder(context, SignallQProDatabase::class.java, SignallQProDatabase.NOME_ARQUIVO)
            .build()

    @Provides
    fun provideProfissionalDao(db: SignallQProDatabase): ProfissionalDao = db.profissionalDao()

    @Provides
    fun provideClienteDao(db: SignallQProDatabase): ClienteDao = db.clienteDao()

    @Provides
    fun provideVisitaDao(db: SignallQProDatabase): VisitaDao = db.visitaDao()

    @Provides
    fun provideAmbienteDao(db: SignallQProDatabase): AmbienteDao = db.ambienteDao()

    @Provides
    fun provideMedicaoProDao(db: SignallQProDatabase): MedicaoProDao = db.medicaoProDao()

    @Provides
    fun provideDiagnosticoProDao(db: SignallQProDatabase): DiagnosticoProDao = db.diagnosticoProDao()

    @Provides
    fun provideEvidenciaDao(db: SignallQProDatabase): EvidenciaDao = db.evidenciaDao()

    @Provides
    fun provideChecklistItemDao(db: SignallQProDatabase): ChecklistItemDao = db.checklistItemDao()
}
