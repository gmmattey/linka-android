import type { HistoryEntry } from '@shared/contracts';
import {
  formatDiagnosisSource,
  formatHistoryDate,
  formatHistoryMbps,
  formatHistoryMs,
  formatHistoryQuality,
} from '../historyViewModel';

interface HistoryDetailPanelProps {
  entry: HistoryEntry | null;
}

export function HistoryDetailPanel({ entry }: HistoryDetailPanelProps) {
  if (!entry) {
    return (
      <aside className="history-detail">
        <p className="overline">Detalhe</p>
        <h3>Selecione uma medição</h3>
        <p>Os dados salvos neste navegador aparecem aqui mesmo offline.</p>
      </aside>
    );
  }

  return (
    <aside className="history-detail">
      <p className="overline">{formatHistoryDate(entry.createdAt)}</p>
      <h3>{formatHistoryQuality(entry.diagnosis.quality)}</h3>
      <p>{entry.diagnosis.summary}</p>

      <dl className="history-detail__metrics">
        <div>
          <dt>Download</dt>
          <dd>{formatHistoryMbps(entry.speedTest.download.mbps)}</dd>
        </div>
        <div>
          <dt>Upload</dt>
          <dd>{formatHistoryMbps(entry.speedTest.upload.mbps)}</dd>
        </div>
        <div>
          <dt>Latência HTTP</dt>
          <dd>{formatHistoryMs(entry.speedTest.latency.ms)}</dd>
        </div>
        <div>
          <dt>Jitter HTTP</dt>
          <dd>{formatHistoryMs(entry.speedTest.jitter.ms)}</dd>
        </div>
      </dl>

      <section>
        <h4>Diagnóstico</h4>
        <p>Fonte: {formatDiagnosisSource(entry.diagnosis.source)}. Confiança: {entry.diagnosis.confidence}.</p>
      </section>

      <section>
        <h4>Ações recomendadas</h4>
        <ul>
          {entry.diagnosis.actions.slice(0, 3).map((action) => (
            <li key={`${action.priority}-${action.title}`}>
              <strong>{action.title}</strong>
              <span>{action.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h4>Limitações web</h4>
        <p>O PWA não mede RSSI, scan Wi-Fi, sinal móvel ou ping ICMP real.</p>
      </section>
    </aside>
  );
}
