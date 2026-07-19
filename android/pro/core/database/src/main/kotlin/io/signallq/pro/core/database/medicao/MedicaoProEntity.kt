package io.signallq.pro.core.database.medicao

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Medicao de speedtest do Pro, associada a um ambiente. Nome com sufixo "Pro" para nao
 * colidir mentalmente com `MedicaoEntity` do consumidor (`:coreDatabase`) -- bancos
 * totalmente separados, mas mesmo dominio de conceito.
 */
@Entity(tableName = "medicao_pro")
data class MedicaoProEntity(
    @PrimaryKey val id: String,
    val ambienteId: String,
    val modo: String,
    val downloadMbps: Double,
    val uploadMbps: Double,
    val latenciaMs: Double,
    val jitterMs: Double,
    val perdaPercentual: Double,
    val criadoEmEpochMs: Long,
)
