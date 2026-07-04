import { AiProvider } from "./ai";

export type AppEnvironment = "production" | "staging" | "all";

export interface SystemErrorLog {
  id: string;
  timestamp: string;
  source: "worker" | "android_app" | "analytics_db" | "ai_gateway";
  message: string;
  stackTrace?: string;
  count: number;
  environment: AppEnvironment;
  resolved: boolean;
  affectedUserCount: number;
}

export interface AppVersionDetail {
  id: string;
  versionCode: string; // e.g. "v1.2.4"
  buildNumber: number; // e.g. 1024
  releaseDate: string;
  activeInstallsCount: number;
  rolloutPercentage: number; // 0 to 100
  crashFreeRatePercentage: number; // e.g. 99.8
  status: "stable" | "beta" | "deprecated" | "halted" | "planned";
  notes: string;
  platform?: string;
  source?: string;
  activeUsersPercentage?: number;
  diagnosticsCount?: number;
  successRatePercentage?: number;
  crashesCount?: number;
  anrsCount?: number;
  diagnosticErrorsCount?: number;
  aiErrorsCount?: number;
}

export interface OperatorRecord {
  id: string;
  name: string; // e.g. "Claro", "Vivo", "TIM", "Desktop Internet"
  country: string; // e.g. "Brasil"
  // Tipo de rede dominante nos diagnósticos da operadora (network_type real vindo
  // do Android: "wifi" | "4g" | "5g" | "ethernet" | "mobile" | "fiber" | "cable").
  // null quando o Worker não conseguiu determinar um tipo dominante — nunca inventar valor.
  type: string | null;
  testCount: number;
  averageDownloadMbps: number | null;
  averageUploadMbps: number | null;
  averageLatencyMs: number | null;
  packetLossAverage: number | null;
  // Score médio de diagnóstico (0 a 100), calculado pelo engine local no device.
  // NÃO é pesquisa de satisfação do cliente — não existe essa fonte de dado hoje.
  averageScorePercentage: number | null;
}

export interface AdminSettingsPayload {
  selectedDefaultAiModel: AiProvider;
  aiFallbackEnabled: boolean;
  maxTokensPerDiagnostic: number;
  speedtestIntervalSeconds: number;
  androidLogsCollectionEnabled: boolean;
  stagingAlertWebhookUrl: string;
  productionAlertWebhookUrl: string;
  cloudflareWorkerEndpoint: string;
}
