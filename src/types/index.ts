// Legacy type - keeping for backwards compatibility during migration
export type ProjectStatus = 'drafting' | 'ready' | 'published';

// New stage-based workflow
export type Stage = 'draft' | 'edit' | 'cover' | 'format' | 'publish' | 'marketing';

export const STAGES: { key: Stage; label: string; order: number }[] = [
  { key: 'draft', label: 'Draft', order: 1 },
  { key: 'edit', label: 'Edit', order: 2 },
  { key: 'cover', label: 'Cover', order: 3 },
  { key: 'format', label: 'Format', order: 4 },
  { key: 'publish', label: 'Publish', order: 5 },
  { key: 'marketing', label: 'Marketing', order: 6 },
];

export interface Metadata {
  title: string;
  subtitle?: string;
  author: string;
  penName?: string;
  series?: string;
  isbn?: string;
  trim?: string;
  keywords: string[];
  categories: string[];
  blurb: string;
}

// Task entity for general task management
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  dueDate?: string;
  owner?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Legacy checklist item - keeping for migration
export interface ChecklistItem {
  id: string;
  label: string;
  platform: 'kdp' | 'ingramspark' | 'both';
  completed: boolean;
  dueDate?: string;
}

export interface Asset {
  id: string;
  type: 'cover' | 'interior';
  fileName: string;
  uploadedAt?: string;
}

export interface Activity {
  id: string;
  projectId: string;
  type:
    | 'created'
    | 'status_changed'
    | 'stage_changed'
    | 'metadata_updated'
    | 'checklist_updated'
    | 'task_created'
    | 'task_updated'
    | 'task_deleted'
    | 'asset_uploaded';
  description: string;
  timestamp: string;
}

export interface Project {
  id: string;
  // Support both old and new model during migration
  status?: ProjectStatus; // Legacy field
  stage: Stage; // New field
  metadata: Metadata;
  checklist: ChecklistItem[]; // Legacy - will be migrated to tasks
  assets: Asset[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  version: number; // Schema version for migrations
  projects: Project[];
  tasks: Task[];
  activities: Activity[];
}

// Import/Export format validation
export interface ExportData extends AppState {
  exportedAt: string;
  appVersion: string;
}
