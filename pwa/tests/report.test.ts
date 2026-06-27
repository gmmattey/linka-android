import { describe, expect, it } from 'vitest';
import { createReportFromHistoryEntry } from '../src/features/report/reportRepository';
import type { HistoryEntry } from '../shared/contracts';

const entry: HistoryEntry = {
  createdAt: '2026-06-27T12:00:00.000Z',
  diagnosis: {
    actions: [
      {
        category: 'retry',
        description: 'Teste em outro cômodo.',
        priority: 1,
        title: 'Repita perto do roteador',
      },
    ],
    confidence: 'high',
    generatedAt: '2026-06-27T12:00:05.000Z',
    id: 'diag_1',
    limitations: [{ code: 'http_latency_not_icmp_ping', message: 'Latência HTTP, não ICMP.' }],
    quality: 'attention',
    source: 'local',
    speed: 'ok',
    stability: 'stable',
    summary: 'Conexão adequada, com ressalvas do navegador.',
  },
  id: 'hist_1',
  speedTest: {
    availability: {
      failedRequests: 0,
      perceivedLossPercent: 0,
      status: 'inferred',
      totalRequests: 12,
    },
    browser: {},
    connection: { source: 'unavailable' },
    download: { bytes: 1_000_000, durationMs: 1000, mbps: 8, samples: 1, status: 'measured' },
    id: 'speed_1',
    jitter: { ms: 4, samples: 10, status: 'measured' },
    latency: { method: 'http_timing', ms: 20, samples: 10, status: 'measured' },
    limitations: ['http_latency_not_icmp_ping'],
    measuredAt: '2026-06-27T12:00:00.000Z',
    upload: { bytes: 500_000, durationMs: 1000, mbps: 4, samples: 1, status: 'measured' },
  },
};

describe('local report', () => {
  it('creates a local-only report from a saved history entry', () => {
    const report = createReportFromHistoryEntry(entry);

    expect(report).toMatchObject({
      historyEntryId: 'hist_1',
      id: 'hist_1',
      localOnly: true,
      status: 'attention',
      summary: 'Conexão adequada, com ressalvas do navegador.',
      title: 'Laudo de conexão SignallQ',
    });
    expect(report.sourceDataRefs).toEqual(['speed_1', 'diag_1']);
    expect(report.sections.map((section) => section.title)).toEqual([
      'Medição',
      'Ações recomendadas',
      'Limitações do laudo web',
    ]);
  });
});
