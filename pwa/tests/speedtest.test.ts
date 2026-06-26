import { describe, expect, it } from 'vitest';
import {
  MAX_DOWNLOAD_BYTES,
  MAX_UPLOAD_BYTES,
  calculateJitterMs,
  calculateMbps,
  createDownloadResponse,
  createLatencyPayload,
  createUploadResult,
  parseDownloadBytes,
} from '../functions/_modules/speedtest';

describe('speedtest module', () => {
  it('clamps download byte requests to the documented limits', () => {
    expect(parseDownloadBytes(new Request('https://pwa.local/api/speedtest/download?bytes=1'))).toBe(64 * 1024);
    expect(parseDownloadBytes(new Request('https://pwa.local/api/speedtest/download?bytes=99999999'))).toBe(
      MAX_DOWNLOAD_BYTES,
    );
  });

  it('returns no-store download responses with byte metadata', () => {
    const response = createDownloadResponse(128 * 1024);

    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(response.headers.get('Content-Length')).toBe(String(128 * 1024));
    expect(response.headers.get('X-SignallQ-Speedtest-Bytes')).toBe(String(128 * 1024));
  });

  it('describes latency as HTTP timing, not ICMP', () => {
    expect(createLatencyPayload(123)).toEqual({
      ok: true,
      now: 123,
      method: 'http_timing',
      limitations: ['http_latency_not_icmp_ping'],
    });
  });

  it('rejects uploads above the PWA speedtest limit', async () => {
    const body = new Uint8Array(MAX_UPLOAD_BYTES + 1);
    const response = await createUploadResult(
      new Request('https://pwa.local/api/speedtest/upload', { method: 'POST', body }),
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({ error: 'Payload acima do limite do speedtest PWA.' });
  });

  it('calculates Mbps only for valid byte and duration inputs', () => {
    expect(calculateMbps(1_000_000, 1000)).toBe(8);
    expect(calculateMbps(0, 1000)).toBeNull();
    expect(calculateMbps(1_000_000, 0)).toBeNull();
  });

  it('calculates jitter from multiple HTTP latency samples', () => {
    expect(calculateJitterMs([20])).toEqual({ ms: null, samples: 1, status: 'insufficient_samples' });
    expect(calculateJitterMs([20, 30, 25])).toEqual({ ms: 7.5, samples: 3, status: 'measured' });
  });
});
