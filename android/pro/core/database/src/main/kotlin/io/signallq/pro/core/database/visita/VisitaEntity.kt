package io.signallq.pro.core.database.visita

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class StatusVisita { EM_ANDAMENTO, CONCLUIDA, INTERROMPIDA }

enum class TipoVisita { INSTALACAO, MANUTENCAO, VISTORIA, SUPORTE }

/**
 * Etapa "macro" da visita, no nível do fluxo geral -- não confundir com o trabalho por
 * ambiente (medição/diagnóstico/evidências), que acontece dentro de AMBIENTES e é
 * rastreado por ambiente (`:pro:core:database` ambiente/medicao/diagnostico/evidencia),
 * não no nível da visita.
 */
enum class EtapaVisita { CHECKLIST, AMBIENTES, CONCLUSAO }

/**
 * Visita de um profissional a um cliente/local. [etapaAtual] é a chave da retomada de visita
 * interrompida (critério de saída do MVP0, issue #1119) -- ao reabrir o app, a visita com
 * [status] EM_ANDAMENTO mais recente retoma direto nessa etapa.
 */
@Entity(tableName = "visita")
data class VisitaEntity(
    @PrimaryKey val id: String,
    val clienteId: String,
    val localId: String,
    val tipo: TipoVisita,
    val status: StatusVisita,
    val etapaAtual: EtapaVisita,
    val modoRapido: Boolean = false,
    val iniciadaEmEpochMs: Long,
    val atualizadaEmEpochMs: Long,
)
