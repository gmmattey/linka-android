import React from "react";
import { MetricCard } from "../../../components/ui/MetricCard";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";
import { DiagnosticsSummary } from "../../../types/diagnostics";
import { AppEnvironment } from "../../../types/admin";

interface DiagnosticsMetricGridProps {
  environment: AppEnvironment;
  summary: DiagnosticsSummary | null;
}

// GH#781 (paridade mockup) — os 4 KPIs de sec-diagnostics são exatamente os
// especificados em diagnosticsKpis: "Diagnósticos executados (7d)", "Taxa de
// sucesso", "Duração média" e "Sessões ativas agora". Onde o backend não expõe
// o dado (taxa de sucesso e duração média não têm campo/critério real hoje),
// mantém "Não disponível" explícito em vez de inventar número ou veredito.
export const DiagnosticsMetricGrid: React.FC<DiagnosticsMetricGridProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1 — diagnósticos executados no período, real (D1 diagnostic_sessions) */}
      <MetricCard
        label="Diagnósticos executados (7d)"
        value={summary?.totalTests ?? 0}
        verdictNote="Comparativo com período anterior: não disponível"
        id="diag-grid-metric-executed"
      />

      {/* KPI 2 — taxa de sucesso: sem critério/campo real de sucesso vindo do worker hoje */}
      <FeatureComingSoon feature="Taxa de sucesso" reason="Requer critério de sucesso definido e agregação no worker" compact />

      {/* KPI 3 — duração média: SDK/worker ainda não capturam duração da sessão */}
      <FeatureComingSoon feature="Duração média" reason="Requer captura de duração de sessão no SDK e no worker" compact />

      {/* KPI 4 — sessões ativas agora, real (raw.activeSessions no worker) */}
      <MetricCard
        label="Sessões ativas agora"
        value={summary?.attentionIssuesCount ?? 0}
        source="REAL-TIME"
        id="diag-grid-metric-active-sessions"
      />
    </div>
  );
};
