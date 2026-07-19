package io.signallq.pro.core.database.checklist

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "checklist_item")
data class ChecklistItemEntity(
    @PrimaryKey val id: String,
    val visitaId: String,
    val descricao: String,
    val concluido: Boolean = false,
    val ordem: Int,
)
