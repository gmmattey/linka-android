package io.signallq.pro.core.database.cliente

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cliente")
data class ClienteEntity(
    @PrimaryKey val id: String,
    val nome: String,
    val telefone: String? = null,
    val criadoEmEpochMs: Long,
)
