import React from "react";
import { ChartCard } from "../../../components/ui/ChartCard";
import { LineChart } from "../../../components/charts/LineChart";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";

interface DiagnosticsTimelineProps {
  timelineData: any[];
}

// Paridade com o mockup (signallq-admin-mockup.dc.html) — título e legenda são
// texto literal fixo ("Sessões vs. Diagnósticos · 14 dias"), não variam por
// período. "Sessões" ainda não tem contagem própria no worker; reaproveita
// activeUsers como proxy (mesmo padrão já usado em ScreenSessionsDonut/GH#781).
export const DiagnosticsTimeline: React.FC<DiagnosticsTimelineProps> = ({ timelineData }) => {
  return (
    <ChartCard
      title="Sessões vs. Diagnósticos · 14 dias"
      description="Volume de sessões e diagnósticos completos no período selecionado."
      id="diagnostics-timeline-card"
    >
      {timelineData.length === 0 ? (
        <FeatureComingSoon
          feature="Timeline de Diagnósticos"
          reason="Requer série temporal no worker"
        />
      ) : (
        <LineChart
          data={timelineData}
          xAxisKey="timestamp"
          series={[
            { key: "activeUsers", name: "Sessões", color: "var(--sq-accent)" },
            { key: "completedDiagnostics", name: "Diagnósticos", color: "var(--sq-accent-blue)" },
          ]}
          height={260}
        />
      )}
    </ChartCard>
  );
};
