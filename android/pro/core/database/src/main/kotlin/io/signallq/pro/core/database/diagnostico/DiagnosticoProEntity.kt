package io.signallq.pro.core.database.diagnostico

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "diagnostico_pro")
data class DiagnosticoProEntity(
    @PrimaryKey val id: String,
    val ambienteId: String,
    val medicaoId: String?,
    val veredito: String,
    val scoreConexao: Int,
    val decisaoTitulo: String,
    val decisaoMensagem: String,
    val geradoEmEpochMs: Long,
)

/** Um achado individual do relatorio (decisao principal ou secundaria). */
@Entity(tableName = "diagnostico_achado_pro")
data class DiagnosticoAchadoProEntity(
    @PrimaryKey val id: String,
    val diagnosticoId: String,
    val titulo: String,
    val mensagem: String,
    val recomendacao: String?,
    val status: String,
    val principal: Boolean,
)
