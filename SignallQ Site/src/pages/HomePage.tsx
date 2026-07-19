import { AdSlot } from '../components/AdSlot'
import { SiteFooter } from '../components/SiteFooter'
import { SiteNav } from '../components/SiteNav'
import { DownloadAppCallout } from '../components/speedtest/DownloadAppCallout'
import { ProblemPanel } from '../components/speedtest/ProblemPanel'
import { ResultPanel } from '../components/speedtest/ResultPanel'
import { SpeedGauge } from '../components/speedtest/SpeedGauge'
import { StepRow, type StepInfo } from '../components/speedtest/StepRow'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { type FasePainel, type ProblemPhase, useSpeedTest } from '../hooks/useSpeedTest'
import { classifyDownload } from '../lib/classification'
import { fractionForLatency, fractionForThroughput } from '../lib/gaugeMath'

const RUNNING_PHASES: FasePainel[] = ['preparando', 'latencia', 'download', 'upload', 'processando']
const PROBLEM_PHASES: ProblemPhase[] = ['sem-conexao', 'conexao-interrompida', 'endpoint-indisponivel', 'erro-inesperado', 'cancelado', 'bloqueado-outra-aba']
const STEP_ORDER: Array<'latencia' | 'download' | 'upload'> = ['latencia', 'download', 'upload']
const STEP_LABELS: Record<'latencia' | 'download' | 'upload', string> = { latencia: 'Latência', download: 'Download', upload: 'Upload' }
const PHASE_LABELS: Record<string, string> = {
  preparando: 'Preparando conexão',
  latencia: 'Medindo latência',
  download: 'Medindo download',
  upload: 'Medindo upload',
  processando: 'Processando resultado',
}

const DIFERENCIAIS = [
  'Entenda se sua conexão está estável',
  'Descubra o que pode estar prejudicando seu Wi-Fi',
  'Receba recomendações em linguagem simples no aplicativo',
]

function phaseColorVar(phase: FasePainel): string {
  if (phase === 'latencia') return 'var(--phase-latencia)'
  if (phase === 'download') return 'var(--phase-download)'
  if (phase === 'upload') return 'var(--phase-upload)'
  return 'var(--accent)'
}

export default function HomePage() {
  useDocumentMeta({
    title: 'Teste de velocidade real — SignallQ',
    description:
      'Meça agora a velocidade real da sua internet: download, upload e latência, com veredito claro para navegação, streaming, videochamadas e jogos.',
    path: '/',
  })

  const { phase, liveValue, phaseResults, result, cancelTest, retry, forceStart } = useSpeedTest()

  const isRunning = RUNNING_PHASES.includes(phase)
  const isResult = phase === 'concluido' || phase === 'parcial'
  const isProblem = PROBLEM_PHASES.includes(phase as ProblemPhase)
  const showGauge = isRunning || isResult
  const stepIdx = RUNNING_PHASES.indexOf(phase)
  const phaseColor = phaseColorVar(phase)

  const downloadVerdict = result ? classifyDownload(result.download.mbps) : null
  const verdictColorVar: Record<string, string> = { success: 'var(--success)', warning: 'var(--warning)', error: 'var(--error)', indisponivel: 'var(--text-tertiary)' }

  let fraction = 0
  let gaugeCenterValue = ''
  let gaugeCenterUnit = ''
  let gaugeColor = phaseColor

  if (isResult && result) {
    fraction = fractionForThroughput(result.download.mbps)
    gaugeCenterValue = result.download.mbps.toFixed(1)
    gaugeCenterUnit = 'Mbps'
    gaugeColor = downloadVerdict ? verdictColorVar[downloadVerdict.nivel] : phaseColor
  } else if (phase === 'latencia') {
    fraction = fractionForLatency(liveValue)
    gaugeCenterValue = liveValue ? Math.round(liveValue).toString() : '—'
    gaugeCenterUnit = 'ms'
  } else if (phase === 'download' || phase === 'upload') {
    fraction = fractionForThroughput(liveValue)
    gaugeCenterValue = liveValue ? liveValue.toFixed(1) : '0.0'
    gaugeCenterUnit = 'Mbps'
  } else if (phase === 'processando') {
    fraction = 1
  }

  const steps: StepInfo[] = STEP_ORDER.map((key) => {
    const idx = RUNNING_PHASES.indexOf(key)
    const done = idx < stepIdx || phase === 'processando'
    const active = key === phase
    const val = phaseResults[key]
    const unit = key === 'latencia' ? 'ms' : 'Mbps'
    let value = 'Aguardando'
    if (active) value = liveValue ? `${key === 'latencia' ? Math.round(liveValue) : liveValue.toFixed(1)} ${unit}` : '…'
    else if (done && val != null) value = `${key === 'latencia' ? Math.round(val) : val.toFixed(1)} ${unit}`
    return {
      label: STEP_LABELS[key],
      value,
      color: active ? phaseColor : done ? 'var(--text-primary)' : 'var(--text-tertiary)',
    }
  })

  const heroGlow = isProblem ? 'var(--error)' : gaugeColor
  const heroBg = `radial-gradient(ellipse 900px 480px at 50% 0%, color-mix(in srgb, ${heroGlow} 14%, transparent), transparent 70%), var(--bg-primary)`

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="relative w-full overflow-hidden" style={{ background: heroBg }}>
        {isRunning && (
          <>
            <div
              className="sq-ring pointer-events-none absolute rounded-full"
              style={{ left: '50%', top: 260, width: 480, height: 480, marginLeft: -240, border: `1px solid color-mix(in srgb, ${phaseColor} 22%, transparent)` }}
            />
            <div
              className="sq-ring pointer-events-none absolute rounded-full"
              style={{
                left: '50%',
                top: 260,
                width: 660,
                height: 660,
                marginLeft: -330,
                marginTop: -90,
                border: `1px solid color-mix(in srgb, ${phaseColor} 14%, transparent)`,
                animationDelay: '1.2s',
              }}
            />
          </>
        )}

        <SiteNav active="home" heroMode />

        <div className="relative z-[1] mx-auto flex max-w-[980px] flex-col items-center gap-4 px-5 pb-14 pt-2 box-border">
          {showGauge && (
            <>
              {isRunning && (
                <div className="max-w-[420px] pt-2.5 text-center body-small">
                  Este teste usa dados da sua conexão para medir a velocidade — nenhum valor é simulado.
                </div>
              )}

              <SpeedGauge fraction={fraction} color={gaugeColor} centerValue={gaugeCenterValue} centerUnit={gaugeCenterUnit} showTicks={isRunning} pulse={isRunning} />

              {isRunning && (
                <>
                  <div className="overline">{PHASE_LABELS[phase] ?? ''}</div>
                  <StepRow steps={steps} />
                  <button onClick={cancelTest} className="flex h-10 items-center gap-1.5 border-none bg-transparent">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      close
                    </span>
                    <span className="label-large">Cancelar teste</span>
                  </button>
                </>
              )}

              {isResult && result && downloadVerdict && <ResultPanel result={result} downloadVerdict={downloadVerdict} onRetry={retry} />}
            </>
          )}

          {isProblem && <ProblemPanel phase={phase as ProblemPhase} onAction={phase === 'bloqueado-outra-aba' ? forceStart : retry} />}
        </div>
      </div>

      {isResult && (
        <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-8 px-5 py-10 box-border">
          <DownloadAppCallout />

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="title-large">Velocidade não conta a história toda.</div>
            <div className="flex max-w-[460px] flex-col gap-2.5">
              {DIFERENCIAIS.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-left">
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--accent)' }}>
                    check_circle
                  </span>
                  <div className="body-medium">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <AdSlot format="horizontal" />
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
