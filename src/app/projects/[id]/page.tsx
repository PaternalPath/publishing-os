'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppState } from '@/lib/use-app-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TaskList } from '@/components/task-list';
import type { Stage, ChecklistItem } from '@/types';
import { nanoid } from 'nanoid';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

type Tab = 'metadata' | 'tasks' | 'checklist' | 'assets' | 'notes';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, updateProject, updateChecklist, deleteProject } = useAppState();
  const [activeTab, setActiveTab] = useState<Tab>('metadata');

  const project = state.projects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-zinc-900">Project not found</h2>
        <Link href="/projects" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  const handleUpdateMetadata = (field: string, value: string | string[]) => {
    updateProject(project.id, {
      metadata: {
        ...project.metadata,
        [field]: value,
      },
    });
  };

  const handleUpdateStage = (stage: Stage) => {
    updateProject(project.id, { stage });
  };

  const handleUpdateNotes = (notes: string) => {
    updateProject(project.id, { notes });
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = project.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateChecklist(project.id, updatedChecklist);
  };

  const handleUpdateChecklistDueDate = (itemId: string, dueDate: string) => {
    const updatedChecklist = project.checklist.map((item) =>
      item.id === itemId ? { ...item, dueDate: dueDate || undefined } : item
    );
    updateChecklist(project.id, updatedChecklist);
  };

  const handleAddChecklistItem = (label: string, platform: 'kdp' | 'ingramspark' | 'both') => {
    const newItem: ChecklistItem = {
      id: nanoid(),
      label,
      platform,
      completed: false,
    };
    updateChecklist(project.id, [...project.checklist, newItem]);
  };

  const handleDeleteProject = () => {
    if (confirm(`Are you sure you want to delete "${project.metadata.title}"?`)) {
      deleteProject(project.id);
      router.push('/projects');
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'metadata', label: 'Metadata' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'assets', label: 'Assets' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-blue-600 hover:underline mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900">{project.metadata.title}</h1>
            <Badge stage={project.stage} />
          </div>
          <p className="text-zinc-600 mt-1">by {project.metadata.author}</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={project.stage}
            onChange={(e) => handleUpdateStage(e.target.value as Stage)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'edit', label: 'Edit' },
              { value: 'cover', label: 'Cover' },
              { value: 'format', label: 'Format' },
              { value: 'publish', label: 'Publish' },
              { value: 'marketing', label: 'Marketing' },
            ]}
          />
          <Button variant="danger" onClick={handleDeleteProject}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-b border-zinc-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'metadata' && (
        <MetadataTab project={project} onUpdate={handleUpdateMetadata} />
      )}
      {activeTab === 'tasks' && <TaskList projectId={project.id} />}
      {activeTab === 'checklist' && (
        <ChecklistTab
          project={project}
          onToggle={handleToggleChecklistItem}
          onUpdateDueDate={handleUpdateChecklistDueDate}
          onAdd={handleAddChecklistItem}
        />
      )}
      {activeTab === 'assets' && <AssetsTab project={project} />}
      {activeTab === 'notes' && (
        <NotesTab notes={project.notes} onUpdate={handleUpdateNotes} />
      )}
    </div>
  );
}

function MetadataTab({
  project,
  onUpdate,
}: {
  project: any;
  onUpdate: (field: string, value: string | string[]) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title"
            value={project.metadata.title}
            onChange={(e) => onUpdate('title', e.target.value)}
          />
          <Input
            label="Subtitle"
            value={project.metadata.subtitle || ''}
            onChange={(e) => onUpdate('subtitle', e.target.value)}
          />
          <Input
            label="Author"
            value={project.metadata.author}
            onChange={(e) => onUpdate('author', e.target.value)}
          />
          <Input
            label="Pen Name"
            value={project.metadata.penName || ''}
            onChange={(e) => onUpdate('penName', e.target.value)}
          />
          <Input
            label="Series"
            value={project.metadata.series || ''}
            onChange={(e) => onUpdate('series', e.target.value)}
          />
          <Input
            label="ISBN"
            value={project.metadata.isbn || ''}
            onChange={(e) => onUpdate('isbn', e.target.value)}
          />
          <Input
            label="Trim Size"
            value={project.metadata.trim || ''}
            onChange={(e) => onUpdate('trim', e.target.value)}
            placeholder="e.g., 6x9"
          />
          <Input
            label="Keywords (comma-separated)"
            value={project.metadata.keywords.join(', ')}
            onChange={(e) =>
              onUpdate(
                'keywords',
                e.target.value.split(',').map((k) => k.trim())
              )
            }
          />
          <Input
            label="Categories (comma-separated)"
            value={project.metadata.categories.join(', ')}
            onChange={(e) =>
              onUpdate(
                'categories',
                e.target.value.split(',').map((c) => c.trim())
              )
            }
          />
        </div>
        <div className="mt-6">
          <Textarea
            label="Book Blurb / Description"
            value={project.metadata.blurb}
            onChange={(e) => onUpdate('blurb', e.target.value)}
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ChecklistTab({
  project,
  onToggle,
  onUpdateDueDate,
  onAdd,
}: {
  project: any;
  onToggle: (itemId: string) => void;
  onUpdateDueDate: (itemId: string, dueDate: string) => void;
  onAdd: (label: string, platform: 'kdp' | 'ingramspark' | 'both') => void;
}) {
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemPlatform, setNewItemPlatform] = useState<'kdp' | 'ingramspark' | 'both'>('both');

  const handleAdd = () => {
    if (newItemLabel.trim()) {
      onAdd(newItemLabel, newItemPlatform);
      setNewItemLabel('');
      setNewItemPlatform('both');
    }
  };

  const groupedItems = {
    kdp: project.checklist.filter((item: ChecklistItem) => item.platform === 'kdp'),
    ingramspark: project.checklist.filter((item: ChecklistItem) => item.platform === 'ingramspark'),
    both: project.checklist.filter((item: ChecklistItem) => item.platform === 'both'),
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Add Checklist Item</h3>
          <div className="flex gap-2">
            <Input
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Enter task description"
              className="flex-1"
            />
            <Select
              value={newItemPlatform}
              onChange={(e) => setNewItemPlatform(e.target.value as 'kdp' | 'ingramspark' | 'both')}
              options={[
                { value: 'both', label: 'Both' },
                { value: 'kdp', label: 'KDP' },
                { value: 'ingramspark', label: 'IngramSpark' },
              ]}
              className="w-40"
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </CardContent>
      </Card>

      {groupedItems.both.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>General Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecklistItems items={groupedItems.both} onToggle={onToggle} onUpdateDueDate={onUpdateDueDate} />
          </CardContent>
        </Card>
      )}

      {groupedItems.kdp.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>KDP Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecklistItems items={groupedItems.kdp} onToggle={onToggle} onUpdateDueDate={onUpdateDueDate} />
          </CardContent>
        </Card>
      )}

      {groupedItems.ingramspark.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>IngramSpark Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecklistItems items={groupedItems.ingramspark} onToggle={onToggle} onUpdateDueDate={onUpdateDueDate} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ChecklistItems({
  items,
  onToggle,
  onUpdateDueDate,
}: {
  items: ChecklistItem[];
  onToggle: (itemId: string) => void;
  onUpdateDueDate: (itemId: string, dueDate: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggle(item.id)}
            className="h-5 w-5 text-blue-600 rounded border-zinc-300 focus:ring-2 focus:ring-blue-500"
          />
          <label className={`flex-1 ${item.completed ? 'line-through text-zinc-500' : 'text-zinc-900'}`}>
            {item.label}
          </label>
          <Input
            type="date"
            value={item.dueDate || ''}
            onChange={(e) => onUpdateDueDate(item.id, e.target.value)}
            className="w-40"
          />
        </div>
      ))}
    </div>
  );
}

function AssetsTab({ project }: { project: any }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cover Assets</h3>
            {project.assets.filter((a: any) => a.type === 'cover').length === 0 ? (
              <p className="text-zinc-500 text-sm">No cover files uploaded</p>
            ) : (
              <div className="space-y-2">
                {project.assets
                  .filter((a: any) => a.type === 'cover')
                  .map((asset: any) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg">
                      <div>
                        <p className="font-medium text-zinc-900">{asset.fileName}</p>
                        {asset.uploadedAt && (
                          <p className="text-xs text-zinc-500">
                            Uploaded {new Date(asset.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <p className="text-sm text-zinc-500 mt-4">
              Naming convention: <code className="bg-zinc-100 px-2 py-1 rounded">[title]-cover.[ext]</code>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Interior Assets</h3>
            {project.assets.filter((a: any) => a.type === 'interior').length === 0 ? (
              <p className="text-zinc-500 text-sm">No interior files uploaded</p>
            ) : (
              <div className="space-y-2">
                {project.assets
                  .filter((a: any) => a.type === 'interior')
                  .map((asset: any) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg">
                      <div>
                        <p className="font-medium text-zinc-900">{asset.fileName}</p>
                        {asset.uploadedAt && (
                          <p className="text-xs text-zinc-500">
                            Uploaded {new Date(asset.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <p className="text-sm text-zinc-500 mt-4">
              Naming convention: <code className="bg-zinc-100 px-2 py-1 rounded">[title]-interior.[ext]</code>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Demo Note:</strong> File uploads are disabled in demo mode. Asset tracking shows placeholder file names only.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotesTab({ notes, onUpdate }: { notes: string; onUpdate: (notes: string) => void }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Textarea
          label="Launch Notes & Ideas"
          value={notes}
          onChange={(e) => onUpdate(e.target.value)}
          rows={12}
          placeholder="Track launch plans, marketing ideas, collaboration notes, etc."
        />
      </CardContent>
    </Card>
  );
}
