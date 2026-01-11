import type { ProjectStatus } from '@/types';

interface BadgeProps {
  status: ProjectStatus;
}

const statusConfig = {
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

export function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
