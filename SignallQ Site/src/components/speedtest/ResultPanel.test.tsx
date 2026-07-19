import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ResultPanel } from './ResultPanel'
import { classifyDownload } from '../../lib/classification'
import type { SpeedTestResult } from '../../lib/speedEngine'

function makeResult(overrides: Partial<{ download: number; upload: number; latency: number; jitter: number | null }> = {}): SpeedTestResult {
  const { download = 80, upload = 20, latency = 15, jitter = 5 } = overrides
  return {
    id: 'r1',
    timestamp: Date.now(),
    download: { mbps: download },
    upload: { mbps: upload },
    latency: { ms: latency },
    jitter: jitter == null ? null : { ms: jitter },
    loadedLatency: null,
    connectionType: null,
    server: 'teste',
    partial: false,
  }
}

describe('ResultPanel — card de recomendações', () => {
  it('resultado com download baixo -> mostra o card de recomendações', async () => {
    const result = makeResult({ download: 10 })
    render(<ResultPanel result={result} downloadVerdict={classifyDownload(result.download.mbps)} onRetry={vi.fn()} />)

    await waitFor(() => expect(screen.getByText('Recomendações')).toBeInTheDocument())
    expect(screen.getByText(/feche outros apps que usam internet/i)).toBeInTheDocument()
  })

  it('resultado excelente -> nenhum card de recomendações (motor nunca força card sem problema)', async () => {
    const result = makeResult()
    render(<ResultPanel result={result} downloadVerdict={classifyDownload(result.download.mbps)} onRetry={vi.fn()} />)

    // espera o efeito assíncrono (leitura de histórico) resolver antes de afirmar ausência
    await waitFor(() => expect(screen.getByText('Testar novamente')).toBeInTheDocument())
    expect(screen.queryByText('Recomendações')).not.toBeInTheDocument()
  })
})
