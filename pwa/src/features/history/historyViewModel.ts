import type { DiagnosisResult, HistoryEntry, SpeedTestResult } from '@shared/contracts';
import type { HistoryState, HistoryStatus } from './historyTypes';

export function buildHistoryState(entries: HistoryEntry[], status: HistoryStatus, error: string | null = null): HistoryState {
  return {
    entries,
    error,
    status: status === 'ready' && entries.length === 0 ? 'empty' : status,
  };
}

export function createHistoryEntry(speedTest: SpeedTestResult, diagnosis: DiagnosisResult): HistoryEntry {
  return {
    id: `hist_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    diagnosis,
    speedTest,
    appVersion: '0.1.0',
  };
}

export function formatHistoryDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatHistoryMbps(value: number | null): string {
  return value == null ? 'N/A' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} Mbps`;
}

export function formatHistoryMs(value: number | null): string {
  return value == null ? 'N/A' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} ms`;
}

export function formatHistoryQuality(value: HistoryEntry['diagnosis']['quality']): string {
  switch (value) {
    case 'good':
      return 'Boa';
    case 'attention':
      return 'Atenção';
    case 'bad':
      return 'Ruim';
    case 'unknown':
      return 'Inconclusiva';
  }
}

export function formatDiagnosisSource(value: DiagnosisResult['source']): string {
  switch (value) {
    case 'ai':
      return 'IA SignallQ';
    case 'fallback':
      return 'Fallback local';
    case 'local':
      return 'Local';
  }
}

export function historyErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
