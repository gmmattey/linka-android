// Portado de android/feature/speedtest/.../SpeedtestQualityClassifier.kt (classificarQualidade)
// para manter os mesmos limiares entre PWA e Android — ver docs/parity.md. Nao alterar os
// numeros aqui sem atualizar os dois lados.
export type UsageVerdict = 'good' | 'acceptable' | 'poor';

export interface UsageVerdicts {
  streaming: UsageVerdict;
  gaming: UsageVerdict;
  videoCall: UsageVerdict;
}

export function classifyUsageVerdicts(params: {
  downloadMbps: number;
  uploadMbps: number;
  latencyMs: number;
  jitterMs: number;
  packetLossPercent: number;
}): UsageVerdicts {
  const { downloadMbps: dl, uploadMbps: ul, latencyMs: latency, jitterMs: jitter, packetLossPercent: loss } = params;

  const streaming: UsageVerdict =
    dl >= 25 && latency <= 200 && jitter <= 50 && loss <= 2
      ? 'good'
      : dl >= 15 && latency <= 500 && jitter <= 100 && loss <= 5
        ? 'acceptable'
        : 'poor';

  const gaming: UsageVerdict =
    dl >= 10 && ul >= 3 && latency <= 50 && jitter <= 15 && loss <= 0.5
      ? 'good'
      : dl >= 5 && ul >= 1 && latency <= 100 && jitter <= 30 && loss <= 1
        ? 'acceptable'
        : 'poor';

  const videoCall: UsageVerdict =
    dl >= 10 && ul >= 3 && latency <= 80 && jitter <= 30 && loss <= 1
      ? 'good'
      : dl >= 5 && ul >= 1 && latency <= 150 && jitter <= 50 && loss <= 3
        ? 'acceptable'
        : 'poor';

  return { streaming, gaming, videoCall };
}
