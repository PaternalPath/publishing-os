import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadState, saveState, clearState, migrateData } from './storage';
import type { AppState } from '@/types';
import { CURRENT_SCHEMA_VERSION } from './schemas';

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

    it('should return parsed and migrated state when data exists', () => {
      const mockState: AppState = {
        version: CURRENT_SCHEMA_VERSION,
        projects: [],
        tasks: [],
        activities: [],
      };
      localStorageMock.setItem('publishing-os-data', JSON.stringify(mockState));

      const result = loadState();
      expect(result).toEqual(mockState);
    });

    it('should migrate old data without version field', () => {
      const oldState = {
        projects: [
          {
            id: 'test-1',
            status: 'drafting',
            metadata: { title: 'Test', author: 'Test', keywords: [], categories: [], blurb: '' },
            checklist: [],
            assets: [],
            notes: '',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
          },
        ],
        activities: [],
      };
      localStorageMock.setItem('publishing-os-data', JSON.stringify(oldState));

      const result = loadState();
      expect(result).not.toBeNull();
      expect(result?.version).toBe(CURRENT_SCHEMA_VERSION);
      expect(result?.tasks).toEqual([]);
      expect(result?.projects[0].stage).toBe('draft');
    });

    it('should return null on JSON parse error', () => {
      localStorageMock.setItem('publishing-os-data', 'invalid json');
      const result = loadState();
      expect(result).toBeNull();
    });
  });

  describe('saveState', () => {
    it('should save state with version to localStorage', () => {
      const mockState: AppState = {
        version: CURRENT_SCHEMA_VERSION,
        projects: [],
        tasks: [],
        activities: [],
      };

      saveState(mockState);

      const stored = localStorageMock.getItem('publishing-os-data');
      const parsed = JSON.parse(stored!);
      expect(parsed.version).toBe(CURRENT_SCHEMA_VERSION);
    });
  });

  describe('clearState', () => {
    it('should remove state from localStorage', () => {
      const mockState: AppState = {
        version: CURRENT_SCHEMA_VERSION,
        projects: [],
        tasks: [],
        activities: [],
      };
      localStorageMock.setItem('publishing-os-data', JSON.stringify(mockState));

      clearState();

      const stored = localStorageMock.getItem('publishing-os-data');
      expect(stored).toBeNull();
    });
  });

  describe('migrateData', () => {
    it('should migrate v0 data to current version', () => {
      const v0Data = {
        projects: [
          {
            id: 'test',
            status: 'published',
            metadata: { title: 'Test', author: 'Test', keywords: [], categories: [], blurb: '' },
            checklist: [],
            assets: [],
            notes: '',
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
          },
        ],
        activities: [],
      };

      const migrated = migrateData(v0Data);
      expect(migrated.version).toBe(CURRENT_SCHEMA_VERSION);
      expect(migrated.tasks).toEqual([]);
      expect(migrated.projects[0].stage).toBe('publish');
      expect(migrated.projects[0].status).toBeUndefined();
    });

    it('should keep current version data unchanged', () => {
      const currentData: AppState = {
        version: CURRENT_SCHEMA_VERSION,
        projects: [],
        tasks: [],
        activities: [],
      };

      const migrated = migrateData(currentData);
      expect(migrated).toEqual(currentData);
    });
  });
});
