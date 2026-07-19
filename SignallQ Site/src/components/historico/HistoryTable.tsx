import { classifyDownload } from '../../lib/classification'
import type { MedicaoRegistro } from '../../lib/historyStore'

const NIVEL_COR: Record<string, string> = { success: 'var(--success)', warning: 'var(--warning)', error: 'var(--error)', indisponivel: 'var(--text-tertiary)' }
const COLUNAS = ['Data/Hora', 'Ping', 'Download', 'Upload', 'Servidor', 'Ações']
const BORDER = { borderColor: 'color-mix(in srgb, var(--border) 14%, transparent)' }

interface HistoryTableProps {
  records: MedicaoRegistro[]
  onShare: (record: MedicaoRegistro) => void
  onRemove: (id: string) => void
}

export function HistoryTable({ records, onShare, onRemove }: HistoryTableProps) {
  return (
    <div className="sq-table-scroll overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {COLUNAS.map((h) => (
              <th key={h} className="whitespace-nowrap border-b px-3 py-2.5 text-left overline" style={{ borderColor: 'color-mix(in srgb, var(--border) 22%, transparent)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((r) => {
            const verdict = classifyDownload(r.download)
            return (
              <tr key={r.id}>
                <td className="whitespace-nowrap border-b px-3 py-3 body-medium" style={BORDER}>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
                      {r.connectionType ? 'wifi' : 'wifi_off'}
                    </span>
                    {new Date(r.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="whitespace-nowrap border-b px-3 py-3 body-medium" style={BORDER}>
                  {Math.round(r.latency)} ms
                </td>
                <td className="whitespace-nowrap border-b px-3 py-3 font-semibold" style={{ ...BORDER, color: NIVEL_COR[verdict.nivel] }}>
                  {r.download.toFixed(1)}
                </td>
                <td className="whitespace-nowrap border-b px-3 py-3 body-medium" style={BORDER}>
                  {r.upload.toFixed(1)}
                </td>
                <td className="whitespace-nowrap border-b px-3 py-3 body-medium" style={{ ...BORDER, color: 'var(--text-secondary)' }}>
                  {r.server || '—'}
                </td>
                <td className="whitespace-nowrap border-b px-3 py-3" style={BORDER}>
                  <div className="flex gap-0.5">
                    <button aria-label="Compartilhar medição" onClick={() => onShare(r)} className="flex h-8 w-8 items-center justify-center border-none bg-transparent">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        share
                      </span>
                    </button>
                    <button aria-label="Excluir medição" onClick={() => onRemove(r.id)} className="flex h-8 w-8 items-center justify-center border-none bg-transparent">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
