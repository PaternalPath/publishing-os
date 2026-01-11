'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/use-app-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/input';
import type { ProjectStatus, Project } from '@/types';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectsPage() {
  const { state, addProject } = useAppState();
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectAuthor, setNewProjectAuthor] = useState('');

  const filteredProjects = state.projects.filter((project) => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      project.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.metadata.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newProjectAuthor.trim()) return;

    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      status: 'drafting',
      metadata: {
        title: newProjectTitle,
        author: newProjectAuthor,
        keywords: [],
        categories: [],
        blurb: '',
      },
      checklist: [],
      assets: [],
      notes: '',
    };

    addProject(newProject);
    setNewProjectTitle('');
    setNewProjectAuthor('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Projects</h1>
          <p className="text-zinc-600 mt-1">Manage your publishing projects</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <form onSubmit={handleCreateProject} className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-900">Create New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Project Title"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Enter project title"
                  required
                />
                <Input
                  label="Author Name"
                  value={newProjectAuthor}
                  onChange={(e) => setNewProjectAuthor(e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Project</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewProjectTitle('');
                    setNewProjectAuthor('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'drafting', label: 'Drafting' },
                { value: 'ready', label: 'Ready' },
                { value: 'published', label: 'Published' },
              ]}
              className="md:w-48"
            />
          </div>

          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <p className="text-center text-zinc-500 py-8">No projects found</p>
            ) : (
              filteredProjects.map((project) => {
                const completedTasks = project.checklist.filter((item) => item.completed).length;
                const totalTasks = project.checklist.length;
                const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block border border-zinc-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-zinc-900">
                            {project.metadata.title}
                          </h3>
                          <Badge status={project.status} />
                        </div>
                        {project.metadata.subtitle && (
                          <p className="text-sm text-zinc-600 mt-1">{project.metadata.subtitle}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                          <span>by {project.metadata.penName || project.metadata.author}</span>
                          {project.metadata.series && <span>Series: {project.metadata.series}</span>}
                          <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    {totalTasks > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-zinc-600 mb-1">
                          <span>Progress</span>
                          <span>{completedTasks} / {totalTasks} tasks</span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
