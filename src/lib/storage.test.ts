import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadState, saveState, clearState } from './storage';
import type { AppState } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('loadState', () => {
    it('should return null when localStorage is empty', () => {
      const result = loadState();
      expect(result).toBeNull();
    });

    it('should return parsed state when data exists', () => {
      const mockState: AppState = {
        projects: [],
        activities: [],
      };
      localStorageMock.setItem('publishing-os-data', JSON.stringify(mockState));

      const result = loadState();
      expect(result).toEqual(mockState);
    });

    it('should return null on JSON parse error', () => {
      localStorageMock.setItem('publishing-os-data', 'invalid json');
      const result = loadState();
      expect(result).toBeNull();
    });
  });

  describe('saveState', () => {
    it('should save state to localStorage', () => {
      const mockState: AppState = {
        projects: [],
        activities: [],
      };

      saveState(mockState);

      const stored = localStorageMock.getItem('publishing-os-data');
      expect(stored).toBe(JSON.stringify(mockState));
    });
  });

  describe('clearState', () => {
    it('should remove state from localStorage', () => {
      const mockState: AppState = {
        projects: [],
        activities: [],
      };
      localStorageMock.setItem('publishing-os-data', JSON.stringify(mockState));

      clearState();

      const stored = localStorageMock.getItem('publishing-os-data');
      expect(stored).toBeNull();
    });
  });
});
