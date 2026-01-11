'use client';

import { useAppState } from '@/lib/use-app-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileJson, FileText } from 'lucide-react';
import type { Project } from '@/types';

export default function ExportsPage() {
  const { state, exportJSON } = useAppState();

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
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Exports</h1>
        <p className="text-zinc-600 mt-1">Export your project data and metadata</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Complete Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-600 mb-4">
            Export all projects and activities as a JSON file. This includes complete data and can be used for backup or migration.
          </p>
          <Button onClick={exportJSON}>
            <Download className="h-4 w-4 mr-2" />
            Export All Data (JSON)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Metadata Packs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-600 mb-6">
            Export individual project metadata in a clean, formatted text file. Perfect for copying to KDP, IngramSpark, or other publishing platforms.
          </p>

          <div className="space-y-4">
            {state.projects.length === 0 ? (
              <p className="text-zinc-500 text-sm">No projects to export</p>
            ) : (
              state.projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:border-zinc-300"
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
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">About Metadata Packs</h3>
          <p className="text-sm text-blue-800">
            Metadata Packs are formatted text files containing all your project information in a clean, readable format.
            You can copy and paste sections directly into publishing platforms like Amazon KDP or IngramSpark,
            ensuring consistency across all your publishing channels.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
