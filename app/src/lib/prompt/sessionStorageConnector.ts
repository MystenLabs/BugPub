// app/src/lib/prompt/sessionStorageConnector.ts
export interface StorageAdapter {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
}
export const sessionStorageAdapter: StorageAdapter = {
  getItem: async (key) => {
    return sessionStorage.getItem(key);
  },
  setItem: async (key, value) => {
    sessionStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    sessionStorage.removeItem(key);
  },
};
