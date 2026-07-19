package io.signallq.pro.core.database.profissional

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ProfissionalDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun salvar(entidade: ProfissionalEntity)

    @Query("SELECT * FROM profissional WHERE id = ${ProfissionalEntity.ID_PERFIL_LOCAL} LIMIT 1")
    fun observar(): Flow<ProfissionalEntity?>

    @Query("SELECT * FROM profissional WHERE id = ${ProfissionalEntity.ID_PERFIL_LOCAL} LIMIT 1")
    suspend fun buscar(): ProfissionalEntity?
}
