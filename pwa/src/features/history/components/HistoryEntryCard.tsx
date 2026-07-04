import type { HistoryEntry } from '@shared/contracts';
import { formatHistoryDate, formatHistoryMbps, formatHistoryQuality } from '../historyViewModel';

interface HistoryEntryCardProps {
  entry: HistoryEntry;
  isSelected?: boolean;
  onCopyReportLink: (id: string) => void;
  onOpenReport: (id: string) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

export function HistoryEntryCard({
  entry,
  isSelected = false,
  onCopyReportLink,
  onOpenReport,
  onRemove,
  onSelect,
}: HistoryEntryCardProps) {
  return (
    <article className={`history-entry${isSelected ? ' history-entry--selected' : ''}`}>
      <button className="history-entry__summary" type="button" onClick={() => onSelect(entry.id)}>
        <span>
          <span className="overline">{formatHistoryDate(entry.createdAt)}</span>
          <strong>{entry.diagnosis.summary}</strong>
        </span>
      </button>
      <dl>
        <div>
          <dt>Download</dt>
          <dd>{formatHistoryMbps(entry.speedTest.download.mbps)}</dd>
        </div>
        <div>
          <dt>Upload</dt>
          <dd>{formatHistoryMbps(entry.speedTest.upload.mbps)}</dd>
        </div>
        <div>
          <dt>Qualidade</dt>
          <dd>{formatHistoryQuality(entry.diagnosis.quality)}</dd>
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
