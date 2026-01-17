'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/use-app-state';
import { useToast } from '@/lib/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import type { Stage, Project } from '@/types';
import Link from 'next/link';
import { Plus, Search, Filter, BookOpen, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ProjectsPage() {
  const router = useRouter();
  const { state, addProject } = useAppState();
  const { addToast } = useToast();
  const [filterStage, setFilterStage] = useState<Stage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectAuthor, setNewProjectAuthor] = useState('');

  const filteredProjects = state.projects.filter((project) => {
    const matchesStage = filterStage === 'all' || project.stage === filterStage;
    const matchesSearch =
      searchQuery === '' ||
      project.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.metadata.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newProjectAuthor.trim()) return;

    const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      stage: 'draft',
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
    setShowCreateModal(false);
    addToast('success', 'Project Created', `"${newProjectTitle}" has been created successfully`);
  };

  const stageFilters = [
    { value: 'all', label: 'All Projects', count: state.projects.length },
    { value: 'draft', label: 'Draft', count: state.projects.filter((p) => p.stage === 'draft').length },
    { value: 'edit', label: 'Edit', count: state.projects.filter((p) => p.stage === 'edit').length },
    { value: 'cover', label: 'Cover', count: state.projects.filter((p) => p.stage === 'cover').length },
    { value: 'format', label: 'Format', count: state.projects.filter((p) => p.stage === 'format').length },
    { value: 'publish', label: 'Publish', count: state.projects.filter((p) => p.stage === 'publish').length },
    { value: 'marketing', label: 'Marketing', count: state.projects.filter((p) => p.stage === 'marketing').length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your publishing projects"
        action={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-zinc-500 flex-shrink-0" />
              {stageFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterStage(filter.value as Stage | 'all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filterStage === filter.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-2 ${filterStage === filter.value ? 'text-blue-100' : 'text-zinc-500'}`}>
                    ({filter.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project List */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<BookOpen className="h-8 w-8 text-zinc-400" />}
              title={searchQuery || filterStage !== 'all' ? 'No projects found' : 'No projects yet'}
              description={
                searchQuery || filterStage !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first publishing project'
              }
              action={
                !searchQuery && filterStage === 'all'
                  ? {
                      label: 'Create Project',
                      onClick: () => setShowCreateModal(true),
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => {
            const completedTasks = project.checklist.filter((item) => item.completed).length;
            const totalTasks = project.checklist.length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return (
              <Card
                key={project.id}
                className="hover:shadow-md transition-all cursor-pointer group"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                          {project.metadata.title}
                        </h3>
                        <Badge stage={project.stage} />
                      </div>
                      {project.metadata.subtitle && (
                        <p className="text-sm text-zinc-600 mb-3">{project.metadata.subtitle}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {project.metadata.penName || project.metadata.author}
                        </span>
                        {project.metadata.series && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {project.metadata.series}
                          </span>
                        )}
                        <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  {totalTasks > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-100">
                      <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
                        <span className="font-medium">Progress</span>
                        <span>
                          {completedTasks} / {totalTasks} tasks complete
                        </span>
                      </div>
                      <div className="w-full bg-zinc-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={(e: React.MouseEvent) => handleCreateProject(e as unknown as React.FormEvent)}>
              Create Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Title"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            placeholder="Enter your book title"
            required
          />
          <Input
            label="Author Name"
            value={newProjectAuthor}
            onChange={(e) => setNewProjectAuthor(e.target.value)}
            placeholder="Enter author name"
            required
          />
          <p className="text-sm text-zinc-600">
            You can add more details like subtitle, series information, and metadata after creating the project.
          </p>
        </form>
      </Modal>
    </div>
  );
}
