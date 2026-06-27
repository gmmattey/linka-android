import type { HistoryEntry } from '@shared/contracts';
import type { HistoryState } from './historyTypes';

interface HistoryPanelProps {
  onClear: () => void;
  onCopyReportLink: (id: string) => void;
  onOpenReport: (id: string) => void;
  onRemove: (id: string) => void;
  state: HistoryState;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatMbps(value: number | null): string {
  return value == null ? 'N/A' : `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} Mbps`;
}

function renderEntry(
  entry: HistoryEntry,
  onCopyReportLink: (id: string) => void,
  onOpenReport: (id: string) => void,
  onRemove: (id: string) => void,
) {
  return (
    <article className="history-entry" key={entry.id}>
      <div>
        <p className="overline">{formatDate(entry.createdAt)}</p>
        <h4>{entry.diagnosis.summary}</h4>
      </div>
      <dl>
        <div>
          <dt>Download</dt>
          <dd>{formatMbps(entry.speedTest.download.mbps)}</dd>
        </div>
        <div>
          <dt>Upload</dt>
          <dd>{formatMbps(entry.speedTest.upload.mbps)}</dd>
        </div>
        <div>
          <dt>Qualidade</dt>
          <dd>{entry.diagnosis.quality}</dd>
        </div>
      </dl>
      <div className="history-entry__actions">
        <button className="text-button" type="button" onClick={() => onOpenReport(entry.id)}>
          Abrir laudo
        </button>
        <button className="text-button" type="button" onClick={() => onCopyReportLink(entry.id)}>
          Copiar link
        </button>
        <button className="text-button text-button--danger" type="button" onClick={() => onRemove(entry.id)}>
          Remover
        </button>
      </div>
    </article>
  );
}

export function HistoryPanel({ onClear, onCopyReportLink, onOpenReport, onRemove, state }: HistoryPanelProps) {
  return (
    <section className="history-panel" aria-label="Histórico local">
      <div className="history-panel__header">
        <div>
          <p className="overline">Histórico local</p>
          <h3>Medições neste navegador</h3>
          <p>Seu histórico fica salvo neste navegador. Se você limpar os dados ou usar outro dispositivo, ele pode não aparecer.</p>
        </div>
        <button className="text-button" disabled={state.entries.length === 0} type="button" onClick={onClear}>
          Limpar tudo
        </button>
      </div>

      {state.status === 'loading' ? <p className="history-panel__message">Carregando histórico...</p> : null}
      {state.status === 'error' ? <p className="history-panel__message">Histórico indisponível: {state.error}</p> : null}
      {state.status === 'empty' || (state.status === 'idle' && state.entries.length === 0) ? (
        <p className="history-panel__message">Nenhuma medição salva ainda.</p>
      ) : null}
      {state.entries.length > 0 ? (
        <div className="history-panel__list">
          {state.entries.map((entry) => renderEntry(entry, onCopyReportLink, onOpenReport, onRemove))}
        </div>
      ) : null}
    </section>
  );
}
