package io.signallq.pro.core.database.cliente

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ClienteDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvar(entidade: ClienteEntity)

    @Query("SELECT * FROM cliente ORDER BY nome ASC")
    fun observarTodos(): Flow<List<ClienteEntity>>

    @Query("SELECT * FROM cliente WHERE id = :id LIMIT 1")
    suspend fun buscarPorId(id: String): ClienteEntity?
}
