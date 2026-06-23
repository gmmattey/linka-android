export type AiProvider = "gemini_flash" | "cloudflare_qwen" | "openai" | "local_fallback";

export interface AiUsageRecord {
  id: string;
  timestamp: string; // ISO String
  modelSelected: AiProvider;
  promptTokens: number;
  completionTokens: number;
  costUsd: number;
  latencySec: number;
  status: "success" | "cached" | "failed";
  diagnosisId: string;
}

/** Série temporal de uso de tokens por provedor por dia. */
export interface AiDailyUsage {
  /** Data no formato ISO YYYY-MM-DD. */
  date: string;
  /** Tokens por provedor: chave = nome do provedor (ex.: "Gemini", "Qwen / Workers AI"). */
  byProvider: Record<string, number>;
}

export interface AiModelInsights {
  provider: AiProvider;
  displayName: string;
  totalCalls: number;
  totalTokens: number;
  averageLatencyMs: number;
  estimatedCostUsd: number;
  reliabilityPercentage: number | null;
}
