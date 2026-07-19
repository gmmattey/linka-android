import { useEffect, useState } from 'react'
import { classifyJitter, classifyLatency, classifyUpload, interpretUseCases, type Classificacao } from '../../lib/classification'
import { listRecords } from '../../lib/historyStore'
import { buildRecommendations, type Recommendation } from '../../lib/recommendations'
import { FEATURE_SPEEDTEST_COMPARTILHOU, trackFeatureUsed } from '../../lib/telemetry'
import type { SpeedTestResult } from '../../lib/speedEngine'
import { RecommendationsCard } from './RecommendationsCard'

const NIVEL_COR: Record<string, string> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  indisponivel: 'var(--text-tertiary)',
}

function formattedSummary(result: SpeedTestResult): string {
  const when = new Date(result.timestamp).toLocaleString('pt-BR')
  return `Meu teste de velocidade SignallQ (${when}): Download ${result.download.mbps.toFixed(1)} Mbps · Upload ${result.upload.mbps.toFixed(1)} Mbps · Latência ${Math.round(result.latency.ms)} ms. Teste a sua em ${location.origin}${location.pathname}`
}

const USE_CASE_ICONS: Record<keyof ReturnType<typeof interpretUseCases>, string> = {
  navegacao: 'travel_explore',
  streaming: 'movie',
  videochamada: 'videocam',
  jogosOnline: 'sports_esports',
}

const USE_CASE_LABELS: Record<keyof ReturnType<typeof interpretUseCases>, string> = {
  navegacao: 'Navegação',
  streaming: 'Streaming',
  videochamada: 'Videochamadas',
  jogosOnline: 'Jogos online',
}

interface ResultPanelProps {
  result: SpeedTestResult
  downloadVerdict: Classificacao
  onRetry: () => void
}

export function ResultPanel({ result, downloadVerdict, onRetry }: ResultPanelProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    let cancelled = false
    listRecords()
      .then((history) => {
        if (!cancelled) setRecommendations(buildRecommendations(result, history))
      })
      .catch(() => {
        // histórico é best-effort — sem ele, o motor ainda roda só com o resultado atual
        if (!cancelled) setRecommendations(buildRecommendations(result, []))
      })
    return () => {
      cancelled = true
    }
  }, [result])

  const upload = classifyUpload(result.upload.mbps)
  const latency = classifyLatency(result.latency.ms)
  const jitter = result.jitter ? classifyJitter(result.jitter.ms) : null
  const useCases = interpretUseCases({
    download: result.download.mbps,
    upload: result.upload.mbps,
    latency: result.latency.ms,
    jitter: result.jitter ? result.jitter.ms : null,
  })

  const copySummary = async (fromShareFallback: boolean) => {
    const text = formattedSummary(result)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
      trackFeatureUsed(FEATURE_SPEEDTEST_COMPARTILHOU)
    } catch {
      window.prompt('Copie o resumo abaixo:', text)
      if (!fromShareFallback) trackFeatureUsed(FEATURE_SPEEDTEST_COMPARTILHOU)
    }
  }

  const share = async () => {
    const text = formattedSummary(result)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Meu teste de velocidade SignallQ', text, url: location.href })
        trackFeatureUsed(FEATURE_SPEEDTEST_COMPARTILHOU)
        return
      } catch {
        // usuário cancelou o share nativo — cai no fallback de cópia
      }
    }
    await copySummary(true)
  }

  const secondaryRow = [
    { label: 'Upload', value: result.upload.mbps.toFixed(1), unit: 'Mbps', verdict: upload },
    { label: 'Latência', value: Math.round(result.latency.ms).toString(), unit: 'ms', verdict: latency },
    { label: 'Jitter', value: jitter ? result.jitter!.ms.toFixed(1) : '—', unit: 'ms', verdict: jitter ?? { label: 'Não disponível', nivel: 'indisponivel' as const } },
  ]

  const detailMetrics = [
    { label: 'Latência sob carga', value: result.loadedLatency ? `${Math.round(result.loadedLatency.ms)} ms` : 'Não disponível' },
    { label: 'Tipo de conexão', value: result.connectionType || 'Não disponível' },
    { label: 'Servidor', value: result.server },
    { label: 'Data e horário', value: new Date(result.timestamp).toLocaleString('pt-BR') },
  ]

  return (
    <div className="sq-fade-up flex w-full flex-col items-center gap-[22px]">
      <div className="title-medium">
        Download <span style={{ color: 'var(--text-tertiary)' }}>·</span>{' '}
        <span style={{ color: NIVEL_COR[downloadVerdict.nivel] }}>{downloadVerdict.label}</span>
      </div>

      {result.partial && (
        <div className="flex max-w-[560px] items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--warning)' }}>
            warning
          </span>
          <div className="body-small">
            <b style={{ color: 'var(--text-primary)' }}>Resultado parcial.</b> A conexão foi interrompida — os números refletem só a parte
            confiável do teste.
          </div>
        </div>
      )}

      <div className="flex w-full max-w-[560px] overflow-hidden rounded-2xl border" style={{ borderColor: 'color-mix(in srgb, var(--border) 18%, transparent)' }}>
        {secondaryRow.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-1 flex-col items-center gap-1 px-2 py-3.5"
            style={{ borderLeft: i === 0 ? 'none' : '1px solid color-mix(in srgb, var(--border) 18%, transparent)' }}
          >
            <div className="overline">{s.label}</div>
            <div className="title-large">
              {s.value} <span className="label-medium">{s.unit}</span>
            </div>
            <div className="label-small" style={{ color: NIVEL_COR[s.verdict.nivel] }}>
              {s.verdict.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex max-w-[640px] flex-wrap justify-center gap-x-8 gap-y-5">
        {(Object.keys(useCases) as (keyof typeof useCases)[]).map((key) => (
          <div key={key} className="flex w-[92px] flex-col items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: NIVEL_COR[useCases[key].nivel] }}>
              {USE_CASE_ICONS[key]}
            </span>
            <div className="body-small text-center">{USE_CASE_LABELS[key]}</div>
            <div className="label-medium text-center" style={{ color: NIVEL_COR[useCases[key].nivel] }}>
              {useCases[key].label}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setDetailsOpen((v) => !v)} className="flex items-center gap-1.5 border-none bg-transparent">
        <span className="label-large" style={{ color: 'var(--accent)' }}>
          Detalhes técnicos
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--accent)' }}>
          {detailsOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {detailsOpen && (
        <div className="-mt-2 flex max-w-[640px] flex-wrap justify-center gap-x-[22px] gap-y-1.5">
          {detailMetrics.map((d) => (
            <div key={d.label} className="body-small">
              <span style={{ color: 'var(--text-secondary)' }}>{d.label}:</span> {d.value}
            </div>
          ))}
        </div>
      )}

      <RecommendationsCard recommendations={recommendations} onRepeatTest={onRetry} />

      <div className="mt-1.5 flex w-full max-w-[460px] flex-col items-center gap-3.5">
        <button
          onClick={onRetry}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-white sm:w-auto sm:px-6"
          style={{ background: 'var(--accent)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            refresh
          </span>
          <span className="label-large" style={{ color: '#fff' }}>
            Testar novamente
          </span>
        </button>
        <div className="flex flex-wrap justify-center gap-2.5">
          <button onClick={share} className="flex h-10 items-center gap-1.5 border-none bg-transparent px-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--accent)' }}>
              share
            </span>
            <span className="label-large" style={{ color: 'var(--accent)' }}>
              Compartilhar
            </span>
          </button>
          <button onClick={() => copySummary(false)} className="flex h-10 items-center gap-1.5 border-none bg-transparent px-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--accent)' }}>
              content_copy
            </span>
            <span className="label-large" style={{ color: 'var(--accent)' }}>
              Copiar resumo
            </span>
          </button>
        </div>
        {copied && (
          <div className="label-medium" style={{ color: 'var(--success)' }}>
            Copiado!
          </div>
        )}
      </div>
    </div>
  )
}
