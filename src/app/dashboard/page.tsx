'use client';

import { useAppState } from '@/lib/use-app-state';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen, FileEdit, CheckCircle, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { state } = useAppState();

  const kpis = {
    total: state.projects.length,
    drafting: state.projects.filter((p) => p.status === 'drafting').length,
    ready: state.projects.filter((p) => p.status === 'ready').length,
    published: state.projects.filter((p) => p.status === 'published').length,
  };

  const recentActivities = state.activities.slice(0, 10);

  const upcomingTasks = state.projects
    .flatMap((project) =>
      project.checklist
        .filter((item) => !item.completed && item.dueDate)
        .map((item) => ({
          projectId: project.id,
          projectTitle: project.metadata.title,
          task: item.label,
          dueDate: item.dueDate!,
        }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-600 mt-1">Welcome to your Publishing OS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Projects</p>
                <p className="text-3xl font-bold text-zinc-900 mt-2">{kpis.total}</p>
              </div>
              <BookOpen className="h-10 w-10 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Drafting</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{kpis.drafting}</p>
              </div>
              <FileEdit className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Ready</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{kpis.ready}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{kpis.published}</p>
              </div>
              <Sparkles className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-zinc-500 text-sm">No upcoming tasks with due dates</p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-start justify-between border-b border-zinc-100 pb-3 last:border-0">
                    <div className="flex-1">
                      <Link
                        href={`/projects/${task.projectId}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {task.projectTitle}
                      </Link>
                      <p className="text-sm text-zinc-600 mt-1">{task.task}</p>
                    </div>
                    <span className="text-xs text-zinc-500 whitespace-nowrap ml-4">
                      {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-zinc-500 text-sm">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const project = state.projects.find((p) => p.id === activity.projectId);
                  return (
                    <div key={activity.id} className="flex items-start justify-between border-b border-zinc-100 pb-3 last:border-0">
                      <div className="flex-1">
                        {project && (
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            {project.metadata.title}
                          </Link>
                        )}
                        <p className="text-sm text-zinc-600 mt-1">{activity.description}</p>
                      </div>
                      <span className="text-xs text-zinc-500 whitespace-nowrap ml-4">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
