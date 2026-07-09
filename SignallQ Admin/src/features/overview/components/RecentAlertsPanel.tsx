import React from "react";
import { RecentAlertItem } from "../../../mocks/overview.mock";

interface RecentAlertsPanelProps {
  alerts: RecentAlertItem[];
}

function severityFor(alert: RecentAlertItem & { _severity?: string }) {
  return alert._severity ?? alert.severity;
}

function dotColorFor(severity: string | undefined) {
  if (severity === "critical") return "var(--error)";
  if (severity === "info") return "var(--info)";
  return "var(--attention)";
}

// Paridade com o mockup (signallq-admin-mockup.dc.html) — só overline seguido
// de linhas simples (dot + texto + horário) com border-top, sem cabeçalho
// extra, sem badge de contagem e sem cartão colorido por severidade.
export const RecentAlertsPanel: React.FC<RecentAlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-[var(--radius-card)] p-5">
      <h4 className="text-xs font-semibold font-sans uppercase tracking-wider text-[var(--text-secondary)] mb-4 select-none">
        Alertas Recentes
      </h4>

      {alerts.length === 0 ? (
        <div className="py-8 text-center text-xs text-[var(--text-tertiary)] font-sans border border-dashed border-[var(--border)] rounded-[var(--radius-card)]">
          Sem alertas ativos
        </div>
      ) : (
        <div>
          {(alerts as Array<RecentAlertItem & { _severity?: string }>).map((alert) => {
            const sev = severityFor(alert);
            return (
              <div
                key={alert.id}
                className="flex items-center justify-between gap-4 py-3 border-t border-[var(--border)] first:border-t-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColorFor(sev) }} />
                  <span className="text-xs text-[var(--text-primary)] font-sans truncate">
                    {alert.message}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono shrink-0">
                  {new Date(alert.timestamp).toLocaleString("pt-BR")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
