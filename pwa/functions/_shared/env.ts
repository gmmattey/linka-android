export interface AdminIngestEnv {
  ADMIN_INGEST_URL?: string;
  ADMIN_WORKER_URL?: string;
  ADMIN_INGEST_KEY?: string;
  ADMIN_SECRET?: string;
}

export interface AiDiagnosisEnv {
  AI_WORKER_URL?: string;
}

export function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

export function resolveAdminBaseUrl(env: AdminIngestEnv): string | null {
  const value = env.ADMIN_INGEST_URL ?? env.ADMIN_WORKER_URL;
  return value ? trimTrailingSlash(value) : null;
}

export function resolveAdminToken(env: AdminIngestEnv): string | null {
  return env.ADMIN_INGEST_KEY ?? env.ADMIN_SECRET ?? null;
}

export function resolveAiWorkerUrl(env: AiDiagnosisEnv): string | null {
  return env.AI_WORKER_URL ? trimTrailingSlash(env.AI_WORKER_URL) : null;
}
