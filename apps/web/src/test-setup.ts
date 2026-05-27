import { vi } from "vitest";

// JSDOM localStorage mock
const storage = new Map<string, string>();
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    get length() { return storage.size; },
    key: vi.fn((index: number) => Array.from(storage.keys())[index] ?? null),
  },
  writable: true,
});
