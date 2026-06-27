import { afterEach, describe, expect, it, vi } from 'vitest';
import { historyRepository } from '../src/shared/storage/historyRepository';

describe('history repository', () => {
  const originalIndexedDb = globalThis.indexedDB;

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalIndexedDb !== undefined) {
      vi.stubGlobal('indexedDB', originalIndexedDb);
    }
  });

  it('reports a clear error when IndexedDB is unavailable', async () => {
    vi.stubGlobal('indexedDB', undefined);

    await expect(historyRepository.list()).rejects.toThrow('IndexedDB indisponível neste navegador.');
  });
});
