export { buildSummary, classifySpeed, classifyStability, createLocalDiagnosis } from '../../shared/diagnosis';

export interface ProxyAiDiagnosisOptions {
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

export async function proxyAiDiagnosis(
  request: Request,
  workerUrl: string,
  options: ProxyAiDiagnosisOptions = {},
): Promise<Response> {
  const fetcher = options.fetcher ?? fetch;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const upstream = await fetcher(`${workerUrl}/api/ai/diagnostico-conexao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: await request.text(),
      signal: controller.signal,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
