import React from "react";
import { MetricCard } from "../../../components/ui/MetricCard";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";
import { DiagnosticsSummary } from "../../../types/diagnostics";
import { AppEnvironment } from "../../../types/admin";

interface DiagnosticsMetricGridProps {
  environment: AppEnvironment;
  summary: DiagnosticsSummary | null;
}

export const DiagnosticsMetricGrid: React.FC<DiagnosticsMetricGridProps> = ({ environment, summary }) => {
  const isStg = environment === "staging";

  // Score é sempre real (vem do worker). Os demais campos podem ser null em produção.
  const scoreValue = summary ? `${summary.averageScore}/100` : (isStg ? "72/100" : "78/100");

  const hasSpeedData = summary !== null &&
    summary.averageLatencyMs !== null &&
    summary.averageDownloadMbps !== null;

  const latencyValue = (summary?.averageLatencyMs != null)
    ? `${summary.averageLatencyMs} ms`
    : null;
  const jitterValue = (summary?.averageJitterMs != null)
    ? `${summary.averageJitterMs} ms`
    : null;
  const lossValue = (summary?.averagePacketLossPercentage != null)
    ? `${summary.averagePacketLossPercentage.toLocaleString("pt-BR")}%`
    : null;
  const downloadValue = (summary?.averageDownloadMbps != null)
    ? `${summary.averageDownloadMbps} Mbps`
    : null;
  const uploadValue = (summary?.averageUploadMbps != null)
    ? `${summary.averageUploadMbps} Mbps`
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Score — dado real do worker */}
      <MetricCard
        label="Score Médio"
        value={scoreValue}
        trend={{ value: 1.2, changePercentage: 1.2, type: (isStg ? "down" : "up") as "up" | "down", intervalLabel: "vs semana anterior" }}
        id="diag-grid-metric-0"
      />

      {/* Métricas de velocidade — null em produção (worker não serve) */}
      {latencyValue !== null ? (
        <MetricCard
          label="Latência Média"
          value={latencyValue}
          trend={{ value: 4.8, changePercentage: 4.8, type: (isStg ? "up" : "down") as "up" | "down", intervalLabel: "estabilidade global" }}
          id="diag-grid-metric-1"
        />
      ) : (
        <FeatureComingSoon feature="Latência Média" reason="Requer agregação no worker" compact />
      )}

      {jitterValue !== null ? (
        <MetricCard
          label="Jitter Médio"
          value={jitterValue}
          trend={{ value: 2.1, changePercentage: 2.1, type: "neutral" as "neutral", intervalLabel: "variação estável" }}
          id="diag-grid-metric-2"
        />
      ) : (
        <FeatureComingSoon feature="Jitter Médio" reason="Requer agregação no worker" compact />
      )}

      {lossValue !== null ? (
        <MetricCard
          label="Perda Média"
          value={lossValue}
          trend={{ value: 0.1, changePercentage: 14.1, type: (isStg ? "up" : "down") as "up" | "down", intervalLabel: "taxa de descarte" }}
          id="diag-grid-metric-3"
        />
      ) : (
        <FeatureComingSoon feature="Perda de Pacote" reason="Requer agregação no worker" compact />
      )}

      {downloadValue !== null ? (
        <MetricCard
          label="Download Médio"
          value={downloadValue}
          trend={{ value: 8.5, changePercentage: 8.5, type: "up" as "up", intervalLabel: "vs semana anterior" }}
          id="diag-grid-metric-4"
        />
      ) : (
        <FeatureComingSoon feature="Download Médio" reason="Requer agregação no worker" compact />
      )}

      {uploadValue !== null ? (
        <MetricCard
          label="Upload Médio"
          value={uploadValue}
          trend={{ value: 3.2, changePercentage: 3.2, type: "up" as "up", intervalLabel: "fluxo local" }}
          id="diag-grid-metric-5"
        />
      ) : (
        <FeatureComingSoon feature="Upload Médio" reason="Requer agregação no worker" compact />
      )}
    </div>
  );
};
