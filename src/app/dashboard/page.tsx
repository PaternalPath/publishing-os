'use client';

import { useAppState } from '@/lib/use-app-state';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen, FileEdit, CheckCircle, Sparkles, Clock, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { state } = useAppState();
  const router = useRouter();

  const kpis = {
    total: state.projects.length,
    drafting: state.projects.filter((p) => p.status === 'drafting').length,
    ready: state.projects.filter((p) => p.status === 'ready').length,
    published: state.projects.filter((p) => p.status === 'published').length,
  };

  const recentActivities = state.activities.slice(0, 8);

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
    .slice(0, 6);

  const statCards = [
    {
      label: 'Total Projects',
      value: kpis.total,
      icon: BookOpen,
      iconBg: 'bg-zinc-100',
      iconColor: 'text-zinc-600',
      textColor: 'text-zinc-900',
    },
    {
      label: 'Drafting',
      value: kpis.drafting,
      icon: FileEdit,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Ready',
      value: kpis.ready,
      icon: CheckCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
    },
    {
      label: 'Published',
      value: kpis.published,
      icon: Sparkles,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
    },
  ];

  if (state.projects.length === 0) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Welcome to your Publishing OS"
        />
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<BookOpen className="h-8 w-8 text-zinc-400" />}
              title="No projects yet"
              description="Get started by creating your first publishing project"
              action={{
                label: 'Create Project',
                onClick: () => router.push('/projects'),
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to your Publishing OS"
        action={
          <Button onClick={() => router.push('/projects')}>
            <BookOpen className="h-4 w-4 mr-2" />
            View All Projects
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-zinc-100">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {upcomingTasks.length === 0 ? (
              <EmptyState
                icon={<Calendar className="h-6 w-6 text-zinc-400" />}
                title="No upcoming tasks"
                description="All tasks are completed or have no due dates"
              />
            ) : (
              <div className="space-y-1">
                {upcomingTasks.map((task, index) => (
                  <Link
                    key={index}
                    href={`/projects/${task.projectId}`}
                    className="flex items-start justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 truncate">
                        {task.projectTitle}
                      </p>
                      <p className="text-sm text-zinc-600 mt-0.5 truncate">{task.task}</p>
                    </div>
                    <span className="text-xs text-zinc-500 whitespace-nowrap ml-4 mt-1">
                      {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-zinc-100">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {recentActivities.length === 0 ? (
              <EmptyState
                icon={<TrendingUp className="h-6 w-6 text-zinc-400" />}
                title="No recent activity"
                description="Activity will appear here as you work on projects"
              />
            ) : (
              <div className="space-y-1">
                {recentActivities.map((activity) => {
                  const project = state.projects.find((p) => p.id === activity.projectId);
                  return (
                    <Link
                      key={activity.id}
                      href={`/projects/${activity.projectId}`}
                      className="flex items-start justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        {project && (
                          <p className="text-sm font-medium text-zinc-900 group-hover:text-blue-600 truncate">
                            {project.metadata.title}
                          </p>
                        )}
                        <p className="text-sm text-zinc-600 mt-0.5 truncate">{activity.description}</p>
                      </div>
                      <span className="text-xs text-zinc-500 whitespace-nowrap ml-4 mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </Link>
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
