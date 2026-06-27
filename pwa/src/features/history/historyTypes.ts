import type { HistoryEntry } from '@shared/contracts';

export type HistoryStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export interface HistoryState {
  entries: HistoryEntry[];
  error: string | null;
  status: HistoryStatus;
}
