import React from "react";
import { ChartCard } from "../../../components/ui/ChartCard";
import { LineChart } from "../../../components/charts/LineChart";
import { AiDailyUsage } from "../../../types/ai";

// Cores por provedor — design system SignallQ.
// Gemini: violeta acento (#6C2BFF), Qwen/Workers AI: azul claro (#38BDF8),
// fallback local: cinza neutro (#6B7280).
const PROVIDER_COLORS: Record<string, string> = {
  "Gemini":             "#6C2BFF",
  "Qwen / Workers AI":  "#38BDF8",
  "local_fallback":     "#6B7280",
  "OpenAI GPT":         "#10B981",
  "Anthropic Claude":   "#F59E0B",
};

const DEFAULT_COLOR = "#9CA3AF";

interface AiCostTimelineProps {
  timelineData: AiDailyUsage[];
}

export const AiCostTimeline: React.FC<AiCostTimelineProps> = ({ timelineData }) => {
  if (timelineData.length === 0) {
    return (
      <ChartCard
        title="Uso de IA — Tokens por Provedor por Dia"
        description="Volume diário de tokens processados, segmentado por provedor de IA."
        id="ai-usage-timeline"
      >
        <div className="flex items-center justify-center h-[260px] text-center px-4">
          <div>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Sem dados no período</p>
            <p className="text-[11px] text-zinc-600 mt-1 font-sans">Nenhuma inferência registrada no intervalo selecionado.</p>
          </div>
        </div>
      </ChartCard>
    );
  }

  // Coleta todos os provedores presentes na série para construir as linhas dinamicamente.
  const providerSet = new Set<string>();
  for (const day of timelineData) {
    for (const key of Object.keys(day.byProvider)) {
      providerSet.add(key);
    }
  }
  const providers = Array.from(providerSet);

  // Transforma AiDailyUsage[] → objeto achatado por provedor (shape esperado pelo LineChart).
  const chartData = timelineData.map(day => {
    const flat: Record<string, string | number> = { date: day.date };
    for (const p of providers) {
      flat[p] = day.byProvider[p] ?? 0;
    }
    return flat;
  });

  const series = providers.map(p => ({
    key:   p,
    name:  p,
    color: PROVIDER_COLORS[p] ?? DEFAULT_COLOR,
  }));

  return (
    <ChartCard
      title="Uso de IA — Tokens por Provedor por Dia"
      description="Volume diário de tokens processados, segmentado por provedor de IA."
      id="ai-usage-timeline"
    >
      <LineChart
        data={chartData}
        xAxisKey="date"
        series={series}
        height={260}
      />
    </ChartCard>
  );
};
