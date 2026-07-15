import type { CachedRelease, ContentCache } from "./content-cache";

const STORE_NAME = "content";
const ACTIVE_KEY = "active";

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error ?? new Error("IndexedDB request failed.")));
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener("complete", () => resolve());
    transaction.addEventListener("abort", () => reject(transaction.error ?? new Error("IndexedDB transaction was aborted.")));
    transaction.addEventListener("error", () => reject(transaction.error ?? new Error("IndexedDB transaction failed.")));
  });
}

export class IndexedDbContentCache implements ContentCache {
  private readonly database: Promise<IDBDatabase>;

  constructor(databaseName = "biolearning.content-cache.v1") {
    this.database = new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.addEventListener("upgradeneeded", () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME);
        }
      });
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error ?? new Error("Could not open the content cache.")));
    });
  }

  async readActive(): Promise<CachedRelease | null> {
    const database = await this.database;
    const transaction = database.transaction(STORE_NAME, "readonly");
    const value = await requestResult(
      transaction.objectStore(STORE_NAME).get(ACTIVE_KEY),
    );
    await transactionComplete(transaction);
    return (value as CachedRelease | undefined) ?? null;
  }

  async activate(release: CachedRelease): Promise<void> {
    const database = await this.database;
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(release, ACTIVE_KEY);
    await transactionComplete(transaction);
  }
}
