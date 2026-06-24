import { AppEnvironment } from "./admin";

export interface SystemError {
  id: string;
  timestamp: string;
  // Fase A: worker envia strings livres ('ingest', 'ai-usage', etc.).
  // Union mantida para compatibilidade com mocks; string captura o runtime real.
  source: "ai_gateway" | "android_app" | "worker" | "analytics_db" | (string & {});
  message: string;
  stackTrace: string;
  count: number;
  environment: AppEnvironment;
  resolved: boolean;
  affectedUserCount: number;
}
