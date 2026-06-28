import { ArrowLeft, History, RefreshCcw, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppShell,
  Button,
  ConnectionSummaryCard,
  EmptyState,
  ErrorState,
  LoadingState,
  TopAppBar,
} from '@/design-system';
import { historyRepository } from '@/shared/storage/historyRepository';
import { HistoryDetailPanel } from './components/HistoryDetailPanel';
import { HistoryEntryCard } from './components/HistoryEntryCard';
import type { HistoryState } from './historyTypes';
import { buildHistoryState, historyErrorMessage } from './historyViewModel';

interface HistoryPageProps {
  onNavigateHome: () => void;
  onOpenReport: (id: string) => void;
}

export function HistoryPage({ onNavigateHome, onOpenReport }: HistoryPageProps) {
  const [state, setState] = useState<HistoryState>(() => buildHistoryState([], 'loading'));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setState((current) => buildHistoryState(current.entries, 'loading'));
    try {
      const entries = await historyRepository.list();
      setState(buildHistoryState(entries, entries.length > 0 ? 'ready' : 'empty'));
      setSelectedId((current) => (current && entries.some((entry) => entry.id === current) ? current : entries[0]?.id ?? null));
    } catch (error) {
      setState(buildHistoryState([], 'error', historyErrorMessage(error, 'Falha ao ler histórico local.')));
      setSelectedId(null);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const selectedEntry = useMemo(
    () => state.entries.find((entry) => entry.id === selectedId) ?? state.entries[0] ?? null,
    [selectedId, state.entries],
  );

  const removeEntry = useCallback(
    async (id: string) => {
      try {
        await historyRepository.remove(id);
        await loadHistory();
      } catch (error) {
        setState((current) =>
          buildHistoryState(current.entries, 'error', historyErrorMessage(error, 'Falha ao remover item do histórico.')),
        );
      }
    },
    [loadHistory],
  );

  const clearHistory = useCallback(async () => {
    try {
      await historyRepository.clear();
      setSelectedId(null);
      setState(buildHistoryState([], 'empty'));
    } catch (error) {
      setState((current) =>
        buildHistoryState(current.entries, 'error', historyErrorMessage(error, 'Falha ao limpar histórico local.')),
      );
    }
  }, []);

  const copyReportLink = useCallback(async (id: string) => {
    const url = `${window.location.origin}/laudo/${id}`;
    await navigator.clipboard?.writeText(url);
  }, []);

  return (
    <AppShell
      header={
        <TopAppBar
          actions={
            <>
              <Button icon={<ArrowLeft size={18} />} variant="text" onClick={onNavigateHome}>
                Teste
              </Button>
              <Button icon={<RefreshCcw size={18} />} variant="tonal" onClick={() => void loadHistory()}>
                Atualizar
              </Button>
            </>
          }
          navItems={[
            { href: '/', label: 'Teste' },
            { href: '/historico', label: 'Histórico' },
          ]}
          subtitle="Histórico local"
          title="SignallQ"
        />
      }
    >
      <main className="history-page">
        <ConnectionSummaryCard
          description="Seu histórico fica salvo neste navegador. Se você limpar os dados do navegador ou usar outro dispositivo, o histórico pode não aparecer."
          quality={state.status === 'error' ? 'poor' : state.entries.length > 0 ? 'good' : 'unknown'}
          qualityLabel={state.status === 'error' ? 'Erro' : `${state.entries.length} salvo(s)`}
          title="Medições locais"
        />

        {state.status === 'loading' ? <LoadingState label="Carregando histórico local" /> : null}
        {state.status === 'error' ? (
          <ErrorState
            actionLabel="Tentar novamente"
            description={`O diagnóstico continua funcionando, mas o histórico local não pôde ser lido. ${state.error ?? ''}`}
            onAction={() => void loadHistory()}
            title="Histórico indisponível"
          />
        ) : null}
        {state.status === 'empty' ? (
          <EmptyState
            description="Execute um SpeedTest para salvar o diagnóstico local neste navegador. Os dados salvos ficam disponíveis mesmo sem rede."
            icon={<History size={22} />}
            title="Nenhuma medição salva"
          />
        ) : null}

        {state.entries.length > 0 ? (
          <section className="history-page__grid" aria-label="Medições salvas">
            <div className="history-page__list">
              <div className="history-page__toolbar">
                <div>
                  <p className="overline">Lista cronológica</p>
                  <h2>Mais recentes primeiro</h2>
                </div>
                <Button icon={<Trash2 size={18} />} variant="text" onClick={() => void clearHistory()}>
                  Limpar tudo
                </Button>
              </div>
              {state.entries.map((entry) => (
                <HistoryEntryCard
                  entry={entry}
                  isSelected={entry.id === selectedEntry?.id}
                  key={entry.id}
                  onCopyReportLink={(id) => void copyReportLink(id)}
                  onOpenReport={onOpenReport}
                  onRemove={(id) => void removeEntry(id)}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
            <HistoryDetailPanel entry={selectedEntry} />
          </section>
        ) : null}
      </main>
    </AppShell>
  );
}
