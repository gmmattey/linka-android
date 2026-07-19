package io.signallq.pro.core.database.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Local de atendimento de um cliente (residência, filial, loja etc.) -- entidade própria no
 * dicionário canônico (`00_CANONICO_v5.md`): um cliente pode ter mais de um local. O MVP0
 * (issue #1119/#1166) cria exatamente um local "Principal" junto com o cadastro rápido do
 * cliente (`NovoClienteScreen`) -- múltiplos locais por cliente e edição de local ficam para
 * uma fase futura, sem editor dedicado por ora.
 */
@Entity(tableName = "local")
data class LocalEntity(
    @PrimaryKey val id: String,
    val clienteId: String,
    val nome: String,
    val endereco: String,
    val criadoEmEpochMs: Long,
)
