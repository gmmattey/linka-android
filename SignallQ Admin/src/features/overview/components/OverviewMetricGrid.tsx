import React from "react";
import { MetricCard } from "../../../components/ui/MetricCard";
import { OverviewMetricsResponse } from "../../../mocks/overview.mock";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";

interface OverviewMetricGridProps {
  metrics: OverviewMetricsResponse;
}

export const OverviewMetricGrid: React.FC<OverviewMetricGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* 1. Diagnósticos */}
      <MetricCard
        label={metrics.diagnosticsCount.label}
        value={metrics.diagnosticsCount.value}
        trend={metrics.diagnosticsCount.trend}
        source="SignallQ Analytics"
        id="metric-diagnostics"
      />

      {/* 2. Score / Usuários Ativos */}
      <MetricCard
        label={metrics.activeUsers.label}
        value={metrics.activeUsers.value}
        trend={metrics.activeUsers.trend}
        source="Firebase"
        id="metric-users"
      />

      {/* 3. Taxa de Sucesso */}
      {metrics.successRate !== null ? (
        <MetricCard
          label={metrics.successRate.label}
          value={metrics.successRate.value}
          trend={metrics.successRate.trend}
          source="SignallQ Analytics"
          id="metric-success-rate"
        />
      ) : (
        <FeatureComingSoon feature="Taxa de Sucesso" compact />
      )}

      {/* 4. Custo IA */}
      <MetricCard
        label={metrics.aiCost.label}
        value={metrics.aiCost.value}
        trend={metrics.aiCost.trend}
        source="SignallQ Worker"
        id="metric-cost"
      />

      {/* 5. Downloads Hoje — fonte: Google Play (app não publicado na Play Store) */}
      {metrics.downloadsToday !== null ? (
        <MetricCard
          label={metrics.downloadsToday.label}
          value={metrics.downloadsToday.value}
          trend={metrics.downloadsToday.trend}
          source="Google Play"
          id="metric-downloads"
        />
      ) : (
        <FeatureComingSoon feature="Google Play Console" reason="App não publicado na Play Store" compact />
      )}

      {/* 6. Instalações Ativas */}
      {metrics.activeInstalls !== null ? (
        <MetricCard
          label={metrics.activeInstalls.label}
          value={metrics.activeInstalls.value}
          trend={metrics.activeInstalls.trend}
          source="Google Play"
          id="metric-installs"
        />
      ) : (
        <FeatureComingSoon feature="Google Play Console" reason="App não publicado na Play Store" compact />
      )}

      {/* 7. Crash-free users */}
      {metrics.crashFreeUsers !== null ? (
        <MetricCard
          label={metrics.crashFreeUsers.label}
          value={metrics.crashFreeUsers.value}
          trend={metrics.crashFreeUsers.trend}
          source="Firebase Crashlytics"
          id="metric-crash-free"
        />
      ) : (
        <FeatureComingSoon feature="Crashlytics" reason="Requer exportação BigQuery" compact />
      )}

      {/* 8. Versão em produção */}
      {metrics.prodVersion !== null ? (
        <MetricCard
          label={metrics.prodVersion.label}
          value={metrics.prodVersion.value}
          trend={metrics.prodVersion.trend}
          source="Google Play"
          id="metric-prod-version"
        />
      ) : (
        <FeatureComingSoon feature="Google Play Console" reason="App não publicado na Play Store" compact />
      )}

      {/* 9. Problema mais comum */}
      {metrics.topProblem !== null ? (
        <MetricCard
          label={metrics.topProblem.label}
          value={metrics.topProblem.value}
          trend={metrics.topProblem.trend}
          source="SignallQ Analytics"
          id="metric-common-issue"
        />
      ) : (
        <FeatureComingSoon feature="Top Problem" reason="Requer agregação no worker" compact />
      )}

      {/* 10. Tipo mais testado */}
      {metrics.mostTestType !== null ? (
        <MetricCard
          label={metrics.mostTestType.label}
          value={metrics.mostTestType.value}
          trend={metrics.mostTestType.trend}
          source="SignallQ Analytics"
          id="metric-most-test-type"
        />
      ) : (
        <FeatureComingSoon feature="Tipo de Rede Predominante" reason="Requer agregação no worker" compact />
      )}
    </div>
  );
};
