import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { HistoryChartView } from '../components/historico/HistoryChartView'
import { HistoryTable } from '../components/historico/HistoryTable'
import { SiteFooter } from '../components/SiteFooter'
import { SiteNav } from '../components/SiteNav'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { buildHistoryChart } from '../lib/historyChart'
import { clearAll, deleteRecord, listRecords, type MedicaoRegistro } from '../lib/historyStore'

type Status = 'loading' | 'loaded' | 'unavailable'
type Metrica = 'download' | 'upload'

async function shareRecord(record: MedicaoRegistro) {
  const text = `Meu teste de velocidade SignallQ (${new Date(record.timestamp).toLocaleString('pt-BR')}): Download ${record.download.toFixed(1)} Mbps · Upload ${record.upload.toFixed(1)} Mbps · Latência ${Math.round(record.latency)} ms.`
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Meu teste de velocidade SignallQ', text })
      return
    } catch {
      // cancelado — cai no fallback de cópia
    }
  }
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    window.prompt('Copie o resumo:', text)
  }
}

export default function HistoricoPage() {
  useDocumentMeta({
    title: 'Histórico de medições — SignallQ',
    description: 'Veja o histórico local das suas medições de velocidade. Armazenado somente neste navegador.',
    path: '/historico',
  })
  const navigate = useNavigate()

  const [status, setStatus] = useState<Status>('loading')
  const [records, setRecords] = useState<MedicaoRegistro[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [justDeleted, setJustDeleted] = useState(false)
  const [metric, setMetric] = useState<Metrica>('download')

  const load = async () => {
    setStatus('loading')
    try {
      const r = await listRecords()
      setRecords(r)
      setStatus('loaded')
    } catch {
      setStatus('unavailable')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (id: string) => {
    await deleteRecord(id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
    setJustDeleted(true)
    setTimeout(() => setJustDeleted(false), 2500)
  }

  const handleClearAll = async () => {
    await clearAll()
    setRecords([])
    setConfirmOpen(false)
  }

  const isEmpty = status === 'loaded' && records.length === 0
  const hasRecords = status === 'loaded' && records.length > 0
  const chronological = [...records].sort((a, b) => a.timestamp - b.timestamp)
  const chart = buildHistoryChart(chronological.map((r) => ({ timestamp: r.timestamp, value: metric === 'download' ? r.download : r.upload })))

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <SiteNav active="historico" />

      <div className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-5 px-5 pb-20 pt-10 box-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="overline">Histórico</div>
            <div className="headline-large mt-1">Suas medições</div>
          </div>
          {hasRecords && (
            <button onClick={() => setConfirmOpen(true)} className="flex h-10 items-center gap-1.5 border-none bg-transparent">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--accent)' }}>
                delete_sweep
              </span>
              <span className="label-large" style={{ color: 'var(--accent)' }}>
                Limpar histórico
              </span>
            </button>
          )}
        </div>

        <div className="body-small">Seu histórico fica armazenado somente neste navegador — não sincroniza entre aparelhos.</div>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-3 py-16">
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--text-tertiary)' }}>
              hourglass_top
            </span>
            <div className="body-large">Carregando histórico…</div>
          </div>
        )}

        {status === 'unavailable' && (
          <div className="flex flex-col items-center gap-2.5 rounded-2xl p-6 text-center" style={{ background: 'var(--bg-card)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--error)' }}>
              storage
            </span>
            <div className="headline-small">Histórico indisponível</div>
            <div className="body-medium max-w-[360px]">Não foi possível ler o armazenamento local deste navegador agora.</div>
            <button onClick={load} className="mt-1 h-10 rounded-[var(--radius-button)] border px-4 label-large" style={{ borderColor: 'var(--border)' }}>
              Tentar novamente
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--text-tertiary)' }}>
              speed
            </span>
            <div className="headline-small">Nenhuma medição ainda</div>
            <div className="body-medium max-w-[320px]">Faça seu primeiro teste de velocidade para ver o histórico aqui.</div>
            <button onClick={() => navigate('/')} className="mt-1 flex h-11 items-center gap-2 rounded-[var(--radius-button)] px-5 text-white">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                speed
              </span>
              <span className="label-large" style={{ color: '#fff' }}>
                Testar velocidade
              </span>
            </button>
          </div>
        )}

        {hasRecords && (
          <div className="flex flex-col gap-6">
            <HistoryChartView chart={chart} metric={metric} onSelectMetric={setMetric} />
            <HistoryTable records={records} onShare={shareRecord} onRemove={remove} />
            <div className="body-small">
              {records.length} medição{records.length === 1 ? '' : 'ões'} salva{records.length === 1 ? '' : 's'}
            </div>
          </div>
        )}

        {justDeleted && <div className="label-medium">Medição excluída.</div>}
      </div>

      <SiteFooter />

      {confirmOpen && (
        <ConfirmDialog
          icon="delete_sweep"
          title="Limpar todo o histórico?"
          description="Essa ação remove permanentemente todas as medições salvas neste navegador. Não é possível desfazer."
          confirmLabel="Limpar tudo"
          cancelLabel="Cancelar"
          danger
          onConfirm={handleClearAll}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  )
}
