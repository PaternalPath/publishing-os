export type ProjectStatus = 'drafting' | 'ready' | 'published';

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
  type: 'created' | 'status_changed' | 'metadata_updated' | 'checklist_updated' | 'asset_uploaded';
  description: string;
  timestamp: string;
}

export interface Project {
  id: string;
  status: ProjectStatus;
  metadata: Metadata;
  checklist: ChecklistItem[];
  assets: Asset[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  projects: Project[];
  activities: Activity[];
}
