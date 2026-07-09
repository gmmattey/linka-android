import React from "react";
import { MetricCard } from "../../../components/ui/MetricCard";

// Paridade com o mockup do Luiz (sec-errors, errorKpis): Crash-free users,
// Taxa de ANR, Crashes hoje, MTTR médio — todos com fonte Crashlytics/Play
// Console. Nenhuma dessas métricas tem integração real ainda (Firebase
// Crashlytics e Google Play Vitals não implementados) — "Não disponível" é o
// estado honesto, mesmo padrão do OverviewMetricGrid (crash-free rate).
export const ErrorMetricGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Crash-free users"
        value="Não disponível"
        verdictNote="Firebase Crashlytics ainda não integrado ao painel"
        source="não implementado"
        id="error-metric-crash-free-users"
      />
      <MetricCard
        label="Taxa de ANR"
        value="Não disponível"
        verdictNote="Google Play Console (Android Vitals) ainda não integrado ao painel"
        source="não implementado"
        id="error-metric-anr-rate"
      />
      <MetricCard
        label="Crashes hoje"
        value="Não disponível"
        verdictNote="Firebase Crashlytics ainda não integrado ao painel"
        source="não implementado"
        id="error-metric-crashes-today"
      />
      <MetricCard
        label="MTTR médio"
        value="Não disponível"
        verdictNote="Tempo médio de resolução ainda não é calculado pelo worker"
        source="não implementado"
        id="error-metric-mttr"
      />
    </div>
  );
};
