package io.signallq.pro.feature.laudo

import io.signallq.pro.core.database.ambiente.AmbienteEntity
import io.signallq.pro.core.database.ambiente.AmbienteRepository
import io.signallq.pro.core.database.cliente.ClienteRepository
import io.signallq.pro.core.database.diagnostico.DiagnosticoProRepository
import io.signallq.pro.core.database.evidencia.EvidenciaRepository
import io.signallq.pro.core.database.local.LocalRepository
import io.signallq.pro.core.database.medicao.MedicaoProRepository
import io.signallq.pro.core.database.profissional.ProfissionalRepository
import io.signallq.pro.core.database.visita.VisitaRepository
import kotlinx.coroutines.flow.first
import javax.inject.Inject

/**
 * Agrega os dados já persistidos da visita (cliente, local, ambientes, medições,
 * diagnósticos, evidências) num único [LaudoDados] para a tela 3.2. Extraído de
 * [LaudoViewModel] para não concentrar repositórios demais no construtor do ViewModel (detekt
 * `LongParameterList`) e para isolar a orquestração de montagem do laudo, no mesmo espírito de
 * `.claude/rules/higiene-e-padronizacao-repositorio.md` §4.2 (extrair orquestração do
 * ViewModel para componente próprio).
 */
class LaudoAgregador
    @Inject
    constructor(
        private val ambienteRepository: AmbienteRepository,
        private val visitaRepository: VisitaRepository,
        private val clienteRepository: ClienteRepository,
        private val localRepository: LocalRepository,
        private val profissionalRepository: ProfissionalRepository,
        private val medicaoProRepository: MedicaoProRepository,
        private val diagnosticoProRepository: DiagnosticoProRepository,
        private val evidenciaRepository: EvidenciaRepository,
    ) {
        /** @return `null` se o ambiente informado ou a visita associada não existirem mais. */
        suspend fun montar(ambienteId: String): LaudoDados? {
            val ambiente = ambienteRepository.buscarPorId(ambienteId)
            val visita = ambiente?.let { visitaRepository.buscarVisita(it.visitaId) }
            if (ambiente == null || visita == null) return null

            val cliente = clienteRepository.buscarPorId(visita.clienteId)
            val local = localRepository.buscarPorId(visita.localId)
            val profissional = profissionalRepository.buscarPerfil()
            val ambientesDaVisita = ambienteRepository.observarPorVisita(visita.id).first()
            val ambientesDados = ambientesDaVisita.map { ambienteDaVisita -> montarAmbiente(ambienteDaVisita) }

            return LaudoDados(
                visitaId = visita.id,
                profissionalNome = profissional?.nome ?: "Profissional SignallQ Pro",
                clienteNome = cliente?.nome ?: "Cliente",
                clienteTelefone = cliente?.telefone,
                localNome = local?.nome ?: "Local",
                localEndereco = local?.endereco.orEmpty(),
                tipoVisita = visita.tipo,
                dataVisitaEpochMs = visita.iniciadaEmEpochMs,
                ambientes = ambientesDados,
            )
        }

        private suspend fun montarAmbiente(ambiente: AmbienteEntity): LaudoAmbienteDados {
            val medicao = medicaoProRepository.buscarUltima(ambiente.id)
            val diagnostico = diagnosticoProRepository.observarUltimo(ambiente.id).first()
            val achados = diagnostico?.let { diagnosticoProRepository.observarAchados(it.id).first() } ?: emptyList()
            val evidencias = evidenciaRepository.observarPorAmbiente(ambiente.id).first()
            return LaudoAmbienteDados(
                nome = ambiente.nome,
                medicao = medicao,
                diagnostico = diagnostico,
                achados = achados,
                evidencias = evidencias,
            )
        }
    }
