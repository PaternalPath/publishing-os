'use client';

import { useAppState } from '@/lib/use-app-state';
import { Badge } from './ui/badge';
import { STAGES, type Stage, type Project } from '@/types';
import Link from 'next/link';
import { ChevronRight, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowBoardProps {
  searchQuery?: string;
}

export function WorkflowBoard({ searchQuery = '' }: WorkflowBoardProps) {
  const { state, updateProject } = useAppState();

  // Filter projects by search query
  const filteredProjects = state.projects.filter((project) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.metadata.title.toLowerCase().includes(query) ||
      project.metadata.author.toLowerCase().includes(query) ||
      (project.metadata.penName?.toLowerCase().includes(query) ?? false)
    );
  });

  // Group projects by stage
  const projectsByStage = STAGES.reduce(
    (acc, stage) => {
      acc[stage.key] = filteredProjects.filter((p) => p.stage === stage.key);
      return acc;
    },
    {} as Record<Stage, Project[]>
  );

  const handleMoveStage = (projectId: string, currentStage: Stage) => {
    const currentOrder = STAGES.find((s) => s.key === currentStage)?.order ?? 0;
    const nextStage = STAGES.find((s) => s.order === currentOrder + 1);

    if (nextStage) {
      updateProject(projectId, { stage: nextStage.key });
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="inline-flex gap-4 min-w-full">
        {STAGES.map((stage) => {
          const projects = projectsByStage[stage.key];
          const isLast = stage.order === STAGES.length;

          return (
            <div
              key={stage.key}
              className="flex-shrink-0 w-80 bg-zinc-50 rounded-lg border border-zinc-200"
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-zinc-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900">{stage.label}</h3>
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-zinc-200 text-zinc-700 rounded-full">
                      {projects.length}
                    </span>
                  </div>
                  <Badge stage={stage.key} />
                </div>
              </div>

              {/* Projects List */}
              <div className="p-3 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto">
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-sm text-zinc-500">
                    No projects in {stage.label.toLowerCase()}
                  </div>
                ) : (
                  projects.map((project) => {
                    const tasksCount = state.tasks.filter(
                      (t) => t.projectId === project.id
                    ).length;
                    const completedTasks = state.tasks.filter(
                      (t) => t.projectId === project.id && t.status === 'done'
                    ).length;

                    return (
                      <div
                        key={project.id}
                        className="bg-white rounded-lg border border-zinc-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all group"
                      >
                        <Link
                          href={`/projects/${project.id}`}
                          className="block"
                        >
                          <h4 className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {project.metadata.title}
                          </h4>
                          <p className="text-sm text-zinc-600 mt-1">
                            by {project.metadata.penName || project.metadata.author}
                          </p>
                        </Link>

                        {/* Project Stats */}
                        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                          {tasksCount > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span>
                                {completedTasks}/{tasksCount} tasks
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(project.updatedAt))} ago</span>
                          </div>
                        </div>

                        {/* Move to Next Stage Button */}
                        {!isLast && (
                          <div className="mt-3 pt-3 border-t border-zinc-100">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleMoveStage(project.id, stage.key);
                              }}
                              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              Move to {STAGES.find((s) => s.order === stage.order + 1)?.label}
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
