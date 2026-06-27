import type { HistoryEntry, HistoryRepository } from '@shared/contracts';

const DB_NAME = 'signallq-pwa';
const DB_VERSION = 1;
const STORE_NAME = 'history_entries';

function createStorageError(message: string, cause?: unknown): Error {
  const detail = cause instanceof Error ? ` ${cause.message}` : '';
  return new Error(`${message}${detail}`);
}

function openHistoryDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(createStorageError('IndexedDB indisponível neste navegador.'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('quality', 'diagnosis.quality', { unique: false });
        store.createIndex('speedStatus', 'diagnosis.speed', { unique: false });
        store.createIndex('stabilityStatus', 'diagnosis.stability', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(createStorageError('Falha ao abrir histórico local.', request.error));
  });
}

function runStoreOperation<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | void> {
  return openHistoryDb().then(
    (db) =>
      new Promise<T | void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = operation(store);
        let requestResult: T | void;

        if (request) {
          request.onsuccess = () => {
            requestResult = request.result;
          };
          request.onerror = () => reject(createStorageError('Falha ao acessar histórico local.', request.error));
        }

        transaction.oncomplete = () => {
          db.close();
          resolve(requestResult);
        };
        transaction.onerror = () => {
          db.close();
          reject(createStorageError('Falha na transação do histórico local.', transaction.error));
        };
      }),
  );
}

export const historyRepository: HistoryRepository = {
  async save(entry) {
    await runStoreOperation('readwrite', (store) => store.put(entry));
  },

  async list() {
    const entries = (await runStoreOperation<HistoryEntry[]>('readonly', (store) => store.getAll())) ?? [];
    return entries.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  },

  async getById(id) {
    return (await runStoreOperation<HistoryEntry | undefined>('readonly', (store) => store.get(id))) ?? null;
  },

  async remove(id) {
    await runStoreOperation('readwrite', (store) => store.delete(id));
  },

  async clear() {
    await runStoreOperation('readwrite', (store) => store.clear());
  },
};
