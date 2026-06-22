import React from "react";
import { ChartCard } from "../../../components/ui/ChartCard";
import { LineChart } from "../../../components/charts/LineChart";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";

interface AiCostTimelineProps {
  timelineData: any[];
}

export const AiCostTimeline: React.FC<AiCostTimelineProps> = ({ timelineData }) => {
  return (
    <ChartCard
      title="Evolução Diária de Custos por Gateway de IA (USD)"
      description="Curva financeira agregando os dispêndios com o Gemini e provedores em lote."
      id="ai-cost-timeline"
    >
      {timelineData.length === 0 ? (
        <FeatureComingSoon
          feature="Histórico de Custo de IA"
          reason="Requer série temporal no worker"
        />
      ) : (
        <LineChart
          data={timelineData}
          xAxisKey="date"
          series={[
            { key: "geminiCost", name: "Gemini 1.5 Flash", color: "#6C2BFF" },
            { key: "cloudflareCost", name: "Workers AI Edge", color: "#Eab308" },
            { key: "openaiCost", name: "GPT-4o Mini", color: "#38BDF8" },
          ]}
          height={260}
        />
      )}
    </ChartCard>
  );
};
