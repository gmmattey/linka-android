import { useMemo } from 'react';
import { Button, HistoryTable, Icon } from '@/design-system';
import type { HistoryTableRow } from '@/design-system';
import { qualityLabel, qualityLevelFromQuality, stabilityLabel } from '@/shared/verdict';
import type { HistoryState } from './historyTypes';

interface HistoryPanelProps {
  onBack: () => void;
  onClear: () => void;
  onOpenEntry: (id: string) => void;
  onStartTest?: () => void;
  state: HistoryState;
}

export function HistoryPanel({ onBack, onClear, onOpenEntry, onStartTest, state }: HistoryPanelProps) {
  const rows: HistoryTableRow[] = useMemo(
    () =>
      state.entries.map((entry) => ({
        dateLabel: new Date(entry.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        downloadLabel: entry.speedTest.download.mbps != null ? `${entry.speedTest.download.mbps.toFixed(0)} Mbps` : '--',
        id: entry.id,
        latencyLabel: entry.speedTest.latency.ms != null ? `${entry.speedTest.latency.ms} ms` : '--',
        qualityLabel: qualityLabel(entry.diagnosis.quality),
        qualityLevel: qualityLevelFromQuality(entry.diagnosis.quality),
        stabilityLabel: stabilityLabel(entry.diagnosis.stability),
      })),
    [state.entries],
  );

  const stableShare = useMemo(() => {
    if (state.entries.length === 0) return null;
    const stableCount = state.entries.filter((entry) => entry.diagnosis.stability === 'stable').length;
    return Math.round((stableCount / state.entries.length) * 100);
  }, [state.entries]);

  return (
    <div className="sq-velocidade-screen">
      <div className="sq-history-screen">
        <div className="sq-screen-topline">
          <button aria-label="Voltar" className="sq-icon-button" onClick={onBack} type="button">
            <Icon name="arrow_back" size={22} />
          </button>
          <Button disabled={rows.length === 0} icon={<Icon name="delete_sweep" size={16} />} onClick={onClear} variant="danger-outline">
            Limpar
          </Button>
        </div>

        {state.status === 'loading' ? <p aria-live="polite" className="sq-history-panel__message">Carregando histórico local...</p> : null}

        {state.status === 'error' ? (
          <div className="sq-history-panel__message sq-history-panel__message--error" role="alert">
            <strong>Histórico indisponível</strong>
            <p>{state.error}</p>
          </div>
        ) : null}

        {state.status === 'empty' || (state.status === 'idle' && state.entries.length === 0) ? (
          <div className="sq-history-panel__message">
            <strong>Nenhuma medição salva ainda</strong>
            <p>Faça um teste para criar o primeiro laudo local neste navegador.</p>
            {onStartTest ? (
              <Button onClick={onStartTest} variant="tonal">
                Iniciar teste
              </Button>
            ) : null}
          </div>
        ) : null}

        {rows.length > 0 ? (
          <>
            {stableShare != null ? (
              <div className="sq-history-screen__summary body-medium">
                Sua internet ficou <b style={{ color: 'var(--success)' }}>estável em {stableShare}%</b> das últimas{' '}
                {state.entries.length} {state.entries.length === 1 ? 'medição' : 'medições'} salvas neste navegador.
              </div>
            ) : null}
            <span className="overline sq-history-screen__title">
              {rows.length} {rows.length === 1 ? 'teste salvo' : 'testes salvos'}
            </span>
            <HistoryTable onOpen={onOpenEntry} rows={rows} />
          </>
        ) : null}
      </div>
    </div>
  );
}
