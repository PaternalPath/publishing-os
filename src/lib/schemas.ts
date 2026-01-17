import { z } from 'zod';

// Schema version - increment when making breaking changes
export const CURRENT_SCHEMA_VERSION = 1;

// Stage schema
export const StageSchema = z.enum(['draft', 'edit', 'cover', 'format', 'publish', 'marketing']);

// Legacy status schema
export const ProjectStatusSchema = z.enum(['drafting', 'ready', 'published']);

// Metadata schema
export const MetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  penName: z.string().optional(),
  series: z.string().optional(),
  isbn: z.string().optional(),
  trim: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  blurb: z.string().default(''),
});

// Task schema
export const TaskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']).default('todo'),
  dueDate: z.string().optional(),
  owner: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Checklist item schema (legacy)
export const ChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  platform: z.enum(['kdp', 'ingramspark', 'both']),
  completed: z.boolean().default(false),
  dueDate: z.string().optional(),
});

// Asset schema
export const AssetSchema = z.object({
  id: z.string(),
  type: z.enum(['cover', 'interior']),
  fileName: z.string(),
  uploadedAt: z.string().optional(),
});

// Activity schema
export const ActivitySchema = z.object({
  id: z.string(),
  projectId: z.string(),
  type: z.enum([
    'created',
    'status_changed',
    'stage_changed',
    'metadata_updated',
    'checklist_updated',
    'task_created',
    'task_updated',
    'task_deleted',
    'asset_uploaded',
  ]),
  description: z.string(),
  timestamp: z.string(),
});

// Project schema
export const ProjectSchema = z.object({
  id: z.string(),
  status: ProjectStatusSchema.optional(), // Legacy
  stage: StageSchema,
  metadata: MetadataSchema,
  checklist: z.array(ChecklistItemSchema).default([]),
  assets: z.array(AssetSchema).default([]),
  notes: z.string().default(''),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// AppState schema
export const AppStateSchema = z.object({
  version: z.number().default(CURRENT_SCHEMA_VERSION),
  projects: z.array(ProjectSchema).default([]),
  tasks: z.array(TaskSchema).default([]),
  activities: z.array(ActivitySchema).default([]),
});

// Export data schema
export const ExportDataSchema = AppStateSchema.extend({
  exportedAt: z.string(),
  appVersion: z.string(),
});

// Import data schema (more lenient, allows missing fields for migration)
export const ImportDataSchema = z.object({
  version: z.number().optional(),
  projects: z.array(z.any()).default([]), // Will validate individually during migration
  tasks: z.array(z.any()).optional().default([]),
  activities: z.array(z.any()).optional().default([]),
  // Allow extra fields from export
  exportedAt: z.string().optional(),
  appVersion: z.string().optional(),
});

// Type exports
export type ValidatedAppState = z.infer<typeof AppStateSchema>;
export type ValidatedProject = z.infer<typeof ProjectSchema>;
export type ValidatedTask = z.infer<typeof TaskSchema>;
export type ValidatedExportData = z.infer<typeof ExportDataSchema>;
