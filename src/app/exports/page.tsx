'use client';

import { useAppState } from '@/lib/use-app-state';
import { useToast } from '@/lib/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Download, FileJson, FileText, Package } from 'lucide-react';
import type { Project } from '@/types';

export default function ExportsPage() {
  const { state, exportJSON } = useAppState();
  const { addToast } = useToast();

  const handleExportAll = () => {
    exportJSON();
    addToast('success', 'Export Complete', 'All data has been exported successfully');
  };

  const exportMetadataPack = (project: Project) => {
    const metadata = project.metadata;
    const content = `
========================================
PUBLISHING METADATA PACK
========================================

BASIC INFORMATION
----------------
Title: ${metadata.title}
${metadata.subtitle ? `Subtitle: ${metadata.subtitle}\n` : ''}Author: ${metadata.author}
${metadata.penName ? `Pen Name: ${metadata.penName}\n` : ''}${metadata.series ? `Series: ${metadata.series}\n` : ''}${metadata.isbn ? `ISBN: ${metadata.isbn}\n` : ''}${metadata.trim ? `Trim Size: ${metadata.trim}\n` : ''}

CATEGORIZATION
--------------
Keywords: ${metadata.keywords.length > 0 ? metadata.keywords.join(', ') : 'None'}
Categories: ${metadata.categories.length > 0 ? metadata.categories.join(', ') : 'None'}

BOOK DESCRIPTION / BLURB
------------------------
${metadata.blurb || 'No description provided'}

========================================
STATUS & PROGRESS
========================================

Status: ${project.status.toUpperCase()}
Created: ${new Date(project.createdAt).toLocaleDateString()}
Last Updated: ${new Date(project.updatedAt).toLocaleDateString()}

Checklist Progress:
- Total Tasks: ${project.checklist.length}
- Completed: ${project.checklist.filter((item) => item.completed).length}
- Remaining: ${project.checklist.filter((item) => !item.completed).length}

ASSETS
------
${project.assets.length > 0 ? project.assets.map((asset) => `- ${asset.type}: ${asset.fileName}`).join('\n') : 'No assets uploaded'}

${project.notes ? `\nLAUNCH NOTES\n------------\n${project.notes}\n` : ''}
========================================
Generated: ${new Date().toISOString()}
========================================
`.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `${fileName}-metadata-pack.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'Metadata Pack Exported', `"${project.metadata.title}" metadata pack has been downloaded`);
  };

  const exportProjectJSON = (project: Project) => {
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = project.metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `${fileName}-project.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'Project JSON Exported', `"${project.metadata.title}" has been exported as JSON`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exports"
        description="Export your project data and metadata"
        action={
          <Button onClick={handleExportAll} disabled={state.projects.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
        }
      />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileJson className="h-5 w-5 text-blue-600" />
            </div>
            Complete Data Export
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-zinc-600 mb-4">
            Export all projects and activities as a JSON file. This includes complete data and can be used for backup or migration.
          </p>
          <Button onClick={handleExportAll} disabled={state.projects.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export All Data (JSON)
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="border-b border-zinc-100">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            Project Metadata Packs
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-zinc-600 mb-6">
            Export individual project metadata in a clean, formatted text file. Perfect for copying to KDP, IngramSpark, or other publishing platforms.
          </p>

          {state.projects.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8 text-zinc-400" />}
              title="No projects to export"
              description="Create projects to export their metadata"
            />
          ) : (
            <div className="space-y-3">
              {state.projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-zinc-900">{project.metadata.title}</h3>
                      <Badge status={project.status} />
                    </div>
                    <p className="text-sm text-zinc-600 mt-1">
                      by {project.metadata.penName || project.metadata.author}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportMetadataPack(project)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Metadata Pack
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportProjectJSON(project)}
                    >
                      <FileJson className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="p-2 bg-blue-200 rounded-lg">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">About Metadata Packs</h3>
              <p className="text-sm text-blue-800">
                Metadata Packs are formatted text files containing all your project information in a clean, readable format.
                You can copy and paste sections directly into publishing platforms like Amazon KDP or IngramSpark,
                ensuring consistency across all your publishing channels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
