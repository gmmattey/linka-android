import type {
  DiagnosisInput,
  DiagnosisResult,
  LegacySpeedtestResult,
  SpeedTestResult,
  StabilityClassification,
} from './contracts';

function readMetrics(speedTest: SpeedTestResult | LegacySpeedtestResult | null | undefined) {
  if (!speedTest) {
    return { downloadMbps: null, latencyMs: null, jitterMs: null };
  }

  if ('download' in speedTest) {
    return {
      downloadMbps: speedTest.download.mbps,
      latencyMs: speedTest.latency.ms,
      jitterMs: speedTest.jitter.ms,
    };
  }

  return {
    downloadMbps: speedTest.downloadMbps,
    latencyMs: speedTest.latencyMs,
    jitterMs: speedTest.jitterMs ?? null,
  };
}

export function classifySpeed(downloadMbps: number | null): 'fast' | 'ok' | 'slow' | 'unknown' {
  if (downloadMbps == null) return 'unknown';
  if (downloadMbps < 10) return 'slow';
  if (downloadMbps <= 50) return 'ok';
  return 'fast';
}

export function classifyStability(latencyMs: number | null, jitterMs: number | null): StabilityClassification {
  if (latencyMs == null && jitterMs == null) return 'unknown';
  if ((latencyMs != null && latencyMs > 150) || (jitterMs != null && jitterMs > 40)) return 'unstable';
  return 'stable';
}

export function buildSummary(
  speed: 'fast' | 'ok' | 'slow' | 'unknown',
  stability: StabilityClassification,
): string {
  if (speed === 'unknown' && stability === 'unknown') {
    return 'Nao foi possivel medir dados suficientes no navegador. Tente novamente com a conexao ativa.';
  }
  if (speed === 'slow') {
    return 'A velocidade medida esta baixa para usos comuns. Confira se ha outros aparelhos consumindo a rede.';
  }
  if (stability === 'unstable') {
    return 'A conexao parece instavel pelo teste HTTP. Chamadas de video e jogos podem oscilar.';
  }
  return 'A conexao parece adequada no teste web. Algumas metricas nativas nao estao disponiveis no navegador.';
}

export function createLocalDiagnosis(input: DiagnosisInput = {}): DiagnosisResult {
  const metrics = readMetrics(input.speedTest);
  const speed = classifySpeed(metrics.downloadMbps);
  const stability = classifyStability(metrics.latencyMs, metrics.jitterMs);
  const quality = speed === 'unknown' && stability === 'unknown'
    ? 'unknown'
    : speed === 'slow' || stability === 'unstable'
      ? 'bad'
      : speed === 'ok' || metrics.latencyMs == null || metrics.jitterMs == null
        ? 'attention'
        : 'good';

  const limitations = [
    {
      code: 'http_latency_not_icmp_ping',
      message: 'A latencia web usa requisicoes HTTP, nao ping ICMP nativo.',
    },
    {
      code: 'browser_limited_measurement',
      message: 'O navegador nao expoe sinal Wi-Fi real, scan de rede ou metricas de radio.',
    },
  ];

  if (metrics.jitterMs == null) {
    limitations.push({
      code: 'jitter_not_measured',
      message: 'Jitter depende de amostras suficientes de latencia.',
    });
  }

  return {
    id: `diag_${Date.now().toString(36)}`,
    generatedAt: new Date().toISOString(),
    source: 'local',
    summary: buildSummary(speed, stability),
    quality,
    speed,
    stability,
    actions: [
      {
        priority: 1,
        title: 'Repita o teste perto do roteador',
        description: 'Compare o resultado em outro ponto da casa para separar velocidade de estabilidade.',
        category: 'retry',
      },
      {
        priority: 2,
        title: 'Evite downloads durante a medicao',
        description: 'Outros usos da rede podem alterar o resultado medido pelo navegador.',
        category: 'device',
      },
    ],
    limitations,
    confidence: speed === 'unknown' ? 'low' : metrics.jitterMs == null ? 'medium' : 'high',
  };
}
