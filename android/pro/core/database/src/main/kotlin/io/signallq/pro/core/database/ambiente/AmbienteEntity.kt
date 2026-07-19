package io.signallq.pro.core.database.ambiente

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "ambiente")
data class AmbienteEntity(
    @PrimaryKey val id: String,
    val visitaId: String,
    val nome: String,
    val criadoEmEpochMs: Long,
)
