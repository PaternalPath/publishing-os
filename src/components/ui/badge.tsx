import type { ProjectStatus, Stage } from '@/types';

interface BadgeProps {
  status?: ProjectStatus; // Legacy support
  stage?: Stage; // New model
}

const stageConfig: Record<Stage, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-800',
  },
  edit: {
    label: 'Edit',
    className: 'bg-yellow-100 text-yellow-800',
  },
  cover: {
    label: 'Cover',
    className: 'bg-purple-100 text-purple-800',
  },
  format: {
    label: 'Format',
    className: 'bg-blue-100 text-blue-800',
  },
  publish: {
    label: 'Publish',
    className: 'bg-green-100 text-green-800',
  },
  marketing: {
    label: 'Marketing',
    className: 'bg-pink-100 text-pink-800',
  },
};

// Legacy status config for migration
const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  drafting: {
    label: 'Drafting',
    className: 'bg-yellow-100 text-yellow-800',
  },
  ready: {
    label: 'Ready',
    className: 'bg-blue-100 text-blue-800',
  },
  published: {
    label: 'Published',
    className: 'bg-green-100 text-green-800',
  },
};

export function Badge({ status, stage }: BadgeProps) {
  // Prefer stage over status
  const config = stage ? stageConfig[stage] : status ? statusConfig[status] : null;

  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
