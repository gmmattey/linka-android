import type { DiagnosticPayload, SpeedTestResult } from '@shared/contracts';

export function buildDiagnosticPayload(
  speedtest: SpeedTestResult | null,
  connectionType: string,
): DiagnosticPayload {
  return {
    connectionType,
    metricasAtuais: {
      downloadMbps: speedtest?.download.mbps ?? null,
      latenciaMs: speedtest?.latency.ms ?? null,
      uploadMbps: speedtest?.upload.mbps ?? null,
    },
    schemaVersion: 'pwa_foundation_v1',
    source: 'pwa',
  };
}
