import { describe, expect, it } from 'vitest';
import {
  handleAdminIngest,
  ingestEndpointFor,
  validateAdminIngestRequest,
} from '../functions/_modules/admin-ingest';

describe('admin ingest module', () => {
  it('validates supported ingest payload envelopes', () => {
    expect(validateAdminIngestRequest({ kind: 'diagnostic', payload: { id: 'diag_1' } })).toEqual({
      kind: 'diagnostic',
      payload: { id: 'diag_1' },
    });
    expect(validateAdminIngestRequest({ kind: 'unknown', payload: {} })).toBeNull();
    expect(validateAdminIngestRequest({ kind: 'diagnostic', payload: null })).toBeNull();
  });

  it('maps ingest kinds to Admin Worker endpoints', () => {
    expect(ingestEndpointFor('diagnostic')).toBe('/ingest/diagnostic');
    expect(ingestEndpointFor('ai-usage')).toBe('/ingest/ai-usage');
  });

  it('returns 400 for invalid envelopes', async () => {
    const response = await handleAdminIngest(
      new Request('https://pwa.local/api/admin/ingest', {
        method: 'POST',
        body: JSON.stringify({ kind: 'diagnostic' }),
      }),
      {},
    );

    expect(response.status).toBe(400);
  });

  it('returns 503 when server-side admin env is missing', async () => {
    const response = await handleAdminIngest(
      new Request('https://pwa.local/api/admin/ingest', {
        method: 'POST',
        body: JSON.stringify({ kind: 'diagnostic', payload: { id: 'diag_1' } }),
      }),
      {},
    );

    expect(response.status).toBe(503);
  });

  it('forwards diagnostic ingest without exposing the token in the response', async () => {
    let forwardedUrl = '';
    let forwardedAuth = '';
    const fetcher: typeof fetch = async (input, init) => {
      forwardedUrl = String(input);
      forwardedAuth = new Headers(init?.headers).get('Authorization') ?? '';
      return Response.json({ ok: true, id: 'diag_1' }, { status: 201 });
    };

    const response = await handleAdminIngest(
      new Request('https://pwa.local/api/admin/ingest', {
        method: 'POST',
        body: JSON.stringify({ kind: 'diagnostic', payload: { id: 'diag_1' } }),
      }),
      {
        ADMIN_INGEST_URL: 'https://admin.worker.dev/',
        ADMIN_INGEST_KEY: 'secret-token',
      },
      fetcher,
    );

    expect(forwardedUrl).toBe('https://admin.worker.dev/ingest/diagnostic');
    expect(forwardedAuth).toBe('Bearer secret-token');
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true, id: 'diag_1' });
  });
});
