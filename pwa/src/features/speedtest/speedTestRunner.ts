import type {
  AvailabilityMetric,
  BrowserConnectionInfo,
  BrowserInfo,
  DownloadMetric,
  JitterMetric,
  LatencyMetric,
  SpeedTestResult,
  UploadMetric,
} from '@shared/contracts';
import { calculateJitterMs, calculateMbps } from '@shared/speedtest-metrics';
import { SpeedtestPhase } from '@/types/network';
import type { SpeedTestProgress, SpeedTestRunnerOptions, SpeedTestRunnerResult } from './speedTestTypes';

const DEFAULT_LATENCY_SAMPLE_COUNT = 15;
const DEFAULT_DOWNLOAD_BYTES = 1024 * 1024;
const DEFAULT_UPLOAD_BYTES = 512 * 1024;
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_UPLOAD_RETRY_COUNT = 3;

interface LatencyResponse {
  method?: 'http_timing';
  ok?: boolean;
}

interface UploadResponse {
  receivedBytes?: number;
}

function emit(onProgress: SpeedTestRunnerOptions['onProgress'], progress: SpeedTestProgress): void {
  onProgress?.(progress);
}

class SpeedTestCanceledError extends Error {
  constructor() {
    super('speedtest_canceled');
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function isCanceledError(error: unknown): boolean {
  return error instanceof SpeedTestCanceledError;
}

function assertNotCanceled(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw new SpeedTestCanceledError();
}

async function fetchWithTimeout(
  fetchFn: typeof fetch,
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
  parentSignal?: AbortSignal,
): Promise<Response> {
  assertNotCanceled(parentSignal);

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onAbort = () => controller.abort();
  parentSignal?.addEventListener('abort', onAbort, { once: true });

  try {
    return await fetchFn(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (parentSignal?.aborted) throw new SpeedTestCanceledError();
    if (timedOut || isAbortError(error)) throw new Error('request_timeout');
    throw error;
  } finally {
    clearTimeout(timeout);
    parentSignal?.removeEventListener('abort', onAbort);
  }
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const value =
    sorted.length % 2 === 0
      ? (sorted[middle - 1]! + sorted[middle]!) / 2
      : sorted[middle]!;
  return Math.round(value);
}

function perceivedLoss(failedRequests: number, totalRequests: number): number | null {
  if (totalRequests <= 0) return null;
  return Math.round((failedRequests / totalRequests) * 1000) / 10;
}

function createRandomPayload(bytes: number): Uint8Array {
  const payload = new Uint8Array(bytes);
  const maxChunkBytes = 65_536;

  for (let offset = 0; offset < payload.byteLength; offset += maxChunkBytes) {
    crypto.getRandomValues(payload.subarray(offset, Math.min(offset + maxChunkBytes, payload.byteLength)));
  }

  return payload;
}

function readBrowserInfo(): BrowserInfo {
  if (typeof navigator === 'undefined') return {};

  const browserInfo: BrowserInfo = {
    language: navigator.language,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
  };

  if (typeof window !== 'undefined') {
    browserInfo.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  return browserInfo;
}

function readConnectionInfo(): BrowserConnectionInfo {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return { source: 'unavailable' };
  }

  const connection = navigator.connection as {
    downlink?: number;
    effectiveType?: string;
    rtt?: number;
    saveData?: boolean;
  };

  const connectionInfo: BrowserConnectionInfo = { source: 'network_information_api' };

  if (connection.downlink !== undefined) connectionInfo.downlink = connection.downlink;
  if (connection.effectiveType !== undefined) connectionInfo.effectiveType = connection.effectiveType;
  if (connection.rtt !== undefined) connectionInfo.rtt = connection.rtt;
  if (connection.saveData !== undefined) connectionInfo.saveData = connection.saveData;

  return connectionInfo;
}

async function measureLatency(
  fetchFn: typeof fetch,
  now: () => number,
  options: {
    latencySampleCount: number;
    signal: AbortSignal | undefined;
    timeoutMs: number;
  },
): Promise<{
  failedRequests: number;
  metric: LatencyMetric;
  samples: number[];
  totalRequests: number;
}> {
  const samples: number[] = [];
  let failedRequests = 0;

  for (let index = 0; index < options.latencySampleCount; index += 1) {
    assertNotCanceled(options.signal);
    const startedAt = now();
    try {
      const response = await fetchWithTimeout(
        fetchFn,
        `/api/speedtest/latency?cacheBust=${Date.now()}_${index}`,
        {
          cache: 'no-store',
          method: 'GET',
        },
        options.timeoutMs,
        options.signal,
      );
      const data = (await response.json().catch(() => null)) as LatencyResponse | null;
      if (!response.ok || data?.method !== 'http_timing') {
        failedRequests += 1;
      } else {
        samples.push(Math.round(now() - startedAt));
      }
    } catch (error) {
      if (isCanceledError(error)) throw error;
      failedRequests += 1;
    }
  }

  return {
    failedRequests,
    metric: {
      method: 'http_timing',
      ms: median(samples),
      samples: samples.length,
      status: samples.length > 0 ? 'measured' : 'failed',
    },
    samples,
    totalRequests: options.latencySampleCount,
  };
}

async function measureDownload(
  fetchFn: typeof fetch,
  now: () => number,
  options: {
    downloadBytes: number;
    signal: AbortSignal | undefined;
    timeoutMs: number;
  },
): Promise<{
  failedRequests: number;
  metric: DownloadMetric;
  totalRequests: number;
}> {
  assertNotCanceled(options.signal);
  const startedAt = now();

  try {
    const response = await fetchWithTimeout(
      fetchFn,
      `/api/speedtest/download?bytes=${options.downloadBytes}&cacheBust=${Date.now()}`,
      {
        cache: 'no-store',
        method: 'GET',
      },
      options.timeoutMs,
      options.signal,
    );
    if (!response.ok) throw new Error('download_failed');
    const buffer = await response.arrayBuffer();
    const durationMs = Math.max(now() - startedAt, 1);

    return {
      failedRequests: 0,
      metric: {
        bytes: buffer.byteLength,
        durationMs,
        mbps: calculateMbps(buffer.byteLength, durationMs),
        samples: 1,
        status: 'measured',
      },
      totalRequests: 1,
    };
  } catch (error) {
    if (isCanceledError(error)) throw error;
    return {
      failedRequests: 1,
      metric: {
        bytes: 0,
        durationMs: Math.max(now() - startedAt, 1),
        mbps: null,
        samples: 0,
        status: 'failed',
      },
      totalRequests: 1,
    };
  }
}

async function measureUpload(
  fetchFn: typeof fetch,
  now: () => number,
  options: {
    signal: AbortSignal | undefined;
    skipUpload: boolean | undefined;
    timeoutMs: number;
    uploadBytes: number;
    uploadRetryCount: number;
  },
): Promise<{
  failedRequests: number;
  metric: UploadMetric;
  totalRequests: number;
}> {
  if (options.skipUpload) {
    return {
      failedRequests: 0,
      metric: {
        bytes: 0,
        durationMs: 0,
        mbps: null,
        samples: 0,
        status: 'not_available',
      },
      totalRequests: 0,
    };
  }

  assertNotCanceled(options.signal);
  const payload = createRandomPayload(options.uploadBytes);
  let failedRequests = 0;

  for (let attempt = 0; attempt < options.uploadRetryCount; attempt += 1) {
    assertNotCanceled(options.signal);
    const startedAt = now();

    try {
      const response = await fetchWithTimeout(
        fetchFn,
        `/api/speedtest/upload?cacheBust=${Date.now()}_${attempt}`,
        {
          body: payload,
          cache: 'no-store',
          method: 'POST',
        },
        options.timeoutMs,
        options.signal,
      );
      if (!response.ok) throw new Error('upload_failed');

      const data = (await response.json().catch(() => null)) as UploadResponse | null;
      const receivedBytes = data?.receivedBytes ?? payload.byteLength;
      const durationMs = Math.max(now() - startedAt, 1);

      if (receivedBytes > 0) {
        return {
          failedRequests,
          metric: {
            bytes: receivedBytes,
            durationMs,
            mbps: calculateMbps(receivedBytes, durationMs),
            samples: 1,
            status: 'measured',
          },
          totalRequests: attempt + 1,
        };
      }

      failedRequests += 1;
    } catch (error) {
      if (isCanceledError(error)) throw error;
      failedRequests += 1;
    }
  }

  return {
    failedRequests,
    metric: {
      bytes: payload.byteLength,
      durationMs: 0,
      mbps: null,
      samples: 0,
      status: 'failed',
    },
    totalRequests: options.uploadRetryCount,
  };
}

export async function runSpeedTestWeb(options: SpeedTestRunnerOptions = {}): Promise<SpeedTestRunnerResult> {
  const fetchFn = options.fetchFn ?? fetch;
  const now = options.now ?? (() => performance.now());
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const latencySampleCount = options.latencySampleCount ?? DEFAULT_LATENCY_SAMPLE_COUNT;
  const downloadBytes = options.downloadBytes ?? DEFAULT_DOWNLOAD_BYTES;
  const uploadBytes = options.uploadBytes ?? DEFAULT_UPLOAD_BYTES;
  const uploadRetryCount = options.uploadRetryCount ?? DEFAULT_UPLOAD_RETRY_COUNT;
  const limitations = [
    'http_latency_not_icmp_ping',
    'packet_loss_not_directly_measured',
    'browser_measurement_may_vary',
    'wifi_signal_not_available_on_web',
  ];

  if (readConnectionInfo().source === 'unavailable') {
    limitations.push('network_information_api_unavailable');
  }

  if (options.skipUpload) limitations.push('upload_endpoint_unavailable');

  try {
    emit(options.onProgress, {
      phase: SpeedtestPhase.Latency,
      status: 'running',
      message: 'Medindo latência HTTP...',
    });
    const latency = await measureLatency(fetchFn, now, {
      latencySampleCount,
      signal: options.signal,
      timeoutMs,
    });
    const jitterResult = calculateJitterMs(latency.samples);
    const jitter: JitterMetric = {
      ms: jitterResult.ms,
      samples: jitterResult.samples,
      status: jitterResult.status,
    };

    emit(options.onProgress, {
      phase: SpeedtestPhase.Download,
      status: 'running',
      message: 'Medindo download...',
    });
    const download = await measureDownload(fetchFn, now, {
      downloadBytes,
      signal: options.signal,
      timeoutMs,
    });

    emit(options.onProgress, {
      phase: SpeedtestPhase.Upload,
      status: 'running',
      message: options.skipUpload ? 'Upload indisponível neste ambiente.' : 'Medindo upload...',
    });
    const upload = await measureUpload(fetchFn, now, {
      signal: options.signal,
      skipUpload: options.skipUpload,
      timeoutMs,
      uploadBytes,
      uploadRetryCount,
    });

    const failedRequests = latency.failedRequests + download.failedRequests + upload.failedRequests;
    const totalRequests = latency.totalRequests + download.totalRequests + upload.totalRequests;
    const availability: AvailabilityMetric = {
      failedRequests,
      perceivedLossPercent: perceivedLoss(failedRequests, totalRequests),
      status: totalRequests > 0 ? 'inferred' : 'not_measured',
      totalRequests,
    };
    const measuredAny =
      latency.metric.status === 'measured' || download.metric.status === 'measured' || upload.metric.status === 'measured';
    const status =
      latency.metric.status === 'measured' && download.metric.status === 'measured' && upload.metric.status === 'measured'
        ? 'success'
        : measuredAny
          ? 'partial'
          : 'error';

    const result: SpeedTestResult = {
      availability,
      browser: readBrowserInfo(),
      connection: readConnectionInfo(),
      download: download.metric,
      id: `speed_${Date.now().toString(36)}`,
      jitter,
      latency: latency.metric,
      limitations,
      measuredAt: new Date().toISOString(),
      upload: upload.metric,
    };

    emit(options.onProgress, {
      phase: status === 'success' ? SpeedtestPhase.Complete : status === 'partial' ? SpeedtestPhase.Partial : SpeedtestPhase.Error,
      status,
      message:
        status === 'success'
          ? 'Teste concluído.'
          : status === 'partial'
            ? 'Teste parcial concluído.'
            : 'Não foi possível medir a conexão.',
    });

    if (status === 'error') {
      return { errorMessage: 'speedtest_failed', result, status };
    }

    return { result, status };
  } catch (error) {
    if (isCanceledError(error)) {
      emit(options.onProgress, {
        phase: SpeedtestPhase.Canceled,
        status: 'canceled',
        message: 'Teste cancelado.',
      });
      return { result: null, status: 'canceled' };
    }

    throw error;
  }
}
