package io.signallq.pro.core.database.profissional

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Perfil local do profissional (tecnico) -- MVP0 sem backend/login (issue #1158, #1161).
 * Linha unica por dispositivo: [id] fixo em [ID_PERFIL_LOCAL].
 */
@Entity(tableName = "profissional")
data class ProfissionalEntity(
    @PrimaryKey val id: Int = ID_PERFIL_LOCAL,
    val nome: String,
    val logoUri: String? = null,
    val criadoEmEpochMs: Long,
    val atualizadoEmEpochMs: Long,
) {
    companion object {
        const val ID_PERFIL_LOCAL = 1
    }
}
