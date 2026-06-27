import type { HistoryEntry } from '@shared/contracts';
import { historyRepository } from '@/shared/storage/historyRepository';
import type { Report, ReportStatus } from './reportTypes';

function mapStatus(entry: HistoryEntry): ReportStatus {
  switch (entry.diagnosis.quality) {
    case 'good':
      return 'good';
    case 'attention':
      return 'attention';
    case 'bad':
      return 'critical';
    case 'unknown':
      return 'inconclusive';
  }
}

function formatMetric(value: number | null, unit: string): string {
  return value == null ? 'Não medido' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${unit}`;
}

export function createReportFromHistoryEntry(entry: HistoryEntry): Report {
  const actions = entry.diagnosis.actions
    .slice(0, 3)
    .map((action) => `${action.priority}. ${action.title}: ${action.description}`)
    .join('\n');

  return {
    historyEntryId: entry.id,
    id: entry.id,
    localOnly: true,
    sections: [
      {
        title: 'Medição',
        body: [
          `Download: ${formatMetric(entry.speedTest.download.mbps, 'Mbps')}`,
          `Upload: ${formatMetric(entry.speedTest.upload.mbps, 'Mbps')}`,
          `Latência HTTP: ${formatMetric(entry.speedTest.latency.ms, 'ms')}`,
          `Jitter HTTP: ${formatMetric(entry.speedTest.jitter.ms, 'ms')}`,
        ].join('\n'),
      },
      {
        title: 'Ações recomendadas',
        body: actions || 'Nenhuma ação recomendada foi gerada para este diagnóstico.',
      },
      {
        title: 'Limitações do laudo web',
        body: 'Este laudo usa dados locais do navegador. Ele não mede RSSI, scan Wi-Fi, sinal móvel ou ping ICMP real.',
      },
    ],
    sourceDataRefs: [entry.speedTest.id, entry.diagnosis.id],
    status: mapStatus(entry),
    summary: entry.diagnosis.summary,
    timestampEpochMs: new Date(entry.createdAt).getTime(),
    title: 'Laudo de conexão SignallQ',
  };
}

export async function getLocalReport(reportId: string): Promise<Report | null> {
  const entry = await historyRepository.getById(reportId);
  return entry ? createReportFromHistoryEntry(entry) : null;
}
