import type { AppState, Project, Stage } from '@/types';
import { AppStateSchema, ImportDataSchema, CURRENT_SCHEMA_VERSION } from './schemas';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'publishing-os-data';

/**
 * Migrate project from old status model to new stage model
 */
function migrateProjectToStages(project: any): Project {
  // If already has stage, return as-is
  if (project.stage) {
    return project as Project;
  }

  // Map old status to new stage
  let stage: Stage;
  switch (project.status) {
    case 'drafting':
      stage = 'draft';
      break;
    case 'ready':
      stage = 'format';
      break;
    case 'published':
      stage = 'publish';
      break;
    default:
      stage = 'draft';
  }

  return {
    ...project,
    stage,
    status: undefined, // Remove legacy field
  };
}

/**
 * Migrate data from old schema versions to current version
 */
export function migrateData(data: any): AppState {
  const version = data.version || 0;

  // Version 0 -> 1: Add version field, migrate status to stage, add tasks array
  if (version === 0) {
    const migratedProjects = (data.projects || []).map(migrateProjectToStages);

    return {
      version: CURRENT_SCHEMA_VERSION,
      projects: migratedProjects,
      tasks: [], // Initialize empty tasks array
      activities: data.activities || [],
    };
  }

  // Already current version
  return data as AppState;
}

/**
 * Load state from localStorage with automatic migration
 */
export function loadState(): AppState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const migrated = migrateData(parsed);

    // Validate migrated data
    const validated = AppStateSchema.parse(migrated);
    return validated;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 */
export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;

  try {
    // Ensure version is set
    const stateWithVersion = {
      ...state,
      version: CURRENT_SCHEMA_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateWithVersion));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export state as JSON file download
 */
export function exportStateAsJSON(state: AppState): void {
  const exportData = {
    ...state,
    version: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: '0.1.0',
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `publishing-os-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import state from JSON file
 * Returns validated and migrated state, or throws error with user-friendly message
 */
export function importStateFromJSON(jsonString: string): AppState {
  try {
    const parsed = JSON.parse(jsonString);

    // Basic validation
    const basicValidation = ImportDataSchema.parse(parsed);

    // Migrate to current version
    const migrated = migrateData(basicValidation);

    // Full validation after migration
    const validated = AppStateSchema.parse(migrated);

    return validated;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'ZodError') {
        throw new Error('Invalid file format. Please ensure you are importing a valid Publishing OS export file.');
      }
      if (error.message.includes('JSON')) {
        throw new Error('Invalid JSON file. The file may be corrupted.');
      }
      throw error;
    }
    throw new Error('Failed to import data. Please check the file and try again.');
  }
}

/**
 * Load demo data from a fixture file
 */
export async function loadDemoData(fixtureUrl: string): Promise<AppState> {
  try {
    const response = await fetch(fixtureUrl);
    if (!response.ok) {
      throw new Error('Failed to load demo data');
    }
    const json = await response.text();
    return importStateFromJSON(json);
  } catch (error) {
    console.error('Failed to load demo data:', error);
    throw new Error('Could not load demo data. Please try again.');
  }
}
