'use client';

import { ImportExport } from '@/components/import-export';
import { PageHeader } from '@/components/page-header';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Import, export, and manage your publishing data"
      />
      <ImportExport />
    </div>
  );
}
