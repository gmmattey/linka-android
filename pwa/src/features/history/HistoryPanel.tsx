import { useMemo, useState } from 'react';
import { HistoryDetailPanel } from './components/HistoryDetailPanel';
import { HistoryEntryCard } from './components/HistoryEntryCard';
import type { HistoryState } from './historyTypes';

interface HistoryPanelProps {
  onClear: () => void;
  onCopyReportLink: (id: string) => void;
  onOpenReport: (id: string) => void;
  onRemove: (id: string) => void;
  onStartTest?: () => void;
  state: HistoryState;
}

export function HistoryPanel({ onClear, onCopyReportLink, onOpenReport, onRemove, onStartTest, state }: HistoryPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedEntry = useMemo(
    () => state.entries.find((entry) => entry.id === selectedId) ?? state.entries[0] ?? null,
    [selectedId, state.entries],
  );

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

      {state.status === 'loading' ? <p aria-live="polite" className="history-panel__message">Carregando histórico local...</p> : null}
      {state.status === 'error' ? (
        <div className="history-panel__message history-panel__message--error" role="alert">
          <strong>Histórico indisponível</strong>
          <p>{state.error}</p>
          {onStartTest ? (
            <button className="text-button" type="button" onClick={onStartTest}>
              Fazer novo teste
            </button>
          ) : null}
        </div>
      ) : null}
      {state.status === 'empty' || (state.status === 'idle' && state.entries.length === 0) ? (
        <div className="history-panel__message">
          <strong>Nenhuma medição salva ainda</strong>
          <p>Faça um teste para criar o primeiro laudo local neste navegador.</p>
          {onStartTest ? (
            <button className="text-button" type="button" onClick={onStartTest}>
              Iniciar teste
            </button>
          ) : null}
        </div>
      ) : null}
      {state.entries.length > 0 ? (
        <div className="history-panel__content">
          <div className="history-panel__list">
            {state.entries.map((entry) => (
              <HistoryEntryCard
                entry={entry}
                isSelected={entry.id === selectedEntry?.id}
                key={entry.id}
                onCopyReportLink={onCopyReportLink}
                onOpenReport={onOpenReport}
                onRemove={onRemove}
                onSelect={setSelectedId}
              />
            ))}
          </div>
          <HistoryDetailPanel entry={selectedEntry} />
        </div>
      ) : null}
    </section>
  );
}
