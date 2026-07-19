package io.signallq.pro.core.database.evidencia

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class TipoEvidencia { FOTO, NOTA }

/** Evidencia por ambiente -- foto OU nota textual (nunca as duas obrigatorias). */
@Entity(tableName = "evidencia")
data class EvidenciaEntity(
    @PrimaryKey val id: String,
    val ambienteId: String,
    val tipo: TipoEvidencia,
    val uriFoto: String? = null,
    val nota: String? = null,
    val criadoEmEpochMs: Long,
)
