'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/use-app-state';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { WorkflowBoard } from '@/components/workflow-board';
import { BookOpen, FileEdit, CheckCircle, Sparkles, TrendingUp, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { state } = useAppState();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const kpis = {
    total: state.projects.length,
    draft: state.projects.filter((p) => p.stage === 'draft').length,
    inProgress: state.projects.filter((p) => ['edit', 'cover', 'format'].includes(p.stage)).length,
    publishing: state.projects.filter((p) => p.stage === 'publish').length,
    marketing: state.projects.filter((p) => p.stage === 'marketing').length,
  };

  const statCards = [
    {
      label: 'Total Projects',
      value: kpis.total,
      icon: BookOpen,
      iconBg: 'bg-zinc-100',
      iconColor: 'text-zinc-600',
    },
    {
      label: 'Draft',
      value: kpis.draft,
      icon: FileEdit,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
    },
    {
      label: 'In Progress',
      value: kpis.inProgress,
      icon: TrendingUp,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Publishing',
      value: kpis.publishing,
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Marketing',
      value: kpis.marketing,
      icon: Sparkles,
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
  ];

  if (state.projects.length === 0) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Your publishing workflow at a glance" />
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<BookOpen className="h-8 w-8 text-zinc-400" />}
              title="No projects yet"
              description="Create your first project or load the demo to get started"
              action={{
                label: 'Load Demo Project',
                onClick: () => router.push('/settings'),
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Dashboard"
        description="Track your publishing projects through each stage"
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Workflow Board */}
      <div>
        <WorkflowBoard searchQuery={searchQuery} />
      </div>
    </div>
  );
}
