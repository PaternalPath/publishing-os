'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { nanoid } from 'nanoid';
import type { AppState, Project, Activity, ChecklistItem } from '@/types';
import { loadState, saveState } from './storage';
import { getInitialState } from './seed-data';

interface AppStateContextValue {
  state: AppState;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateChecklist: (projectId: string, checklist: ChecklistItem[]) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  resetData: () => void;
  exportJSON: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState();
    return loaded || getInitialState();
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));

    addActivity({
      projectId: newProject.id,
      type: 'created',
      description: `Project "${newProject.metadata.title}" created`,
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));

    const project = state.projects.find((p) => p.id === id);
    if (project && updates.status && updates.status !== project.status) {
      addActivity({
        projectId: id,
        type: 'status_changed',
        description: `Status changed from "${project.status}" to "${updates.status}"`,
      });
    } else if (updates.metadata) {
      addActivity({
        projectId: id,
        type: 'metadata_updated',
        description: 'Metadata updated',
      });
    }
  };

  const deleteProject = (id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      activities: prev.activities.filter((a) => a.projectId !== id),
      tasks: prev.tasks.filter((t) => t.projectId !== id),
    }));
  };

  const updateChecklist = (projectId: string, checklist: ChecklistItem[]) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projectId ? { ...p, checklist, updatedAt: new Date().toISOString() } : p
      ),
    }));

    addActivity({
      projectId,
      type: 'checklist_updated',
      description: 'Checklist updated',
    });
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    setState((prev) => ({
      ...prev,
      activities: [
        {
          ...activity,
          id: nanoid(),
          timestamp: new Date().toISOString(),
        },
        ...prev.activities,
      ].slice(0, 100), // Keep only latest 100 activities
    }));
  };

  const resetData = () => {
    const initial = getInitialState();
    setState(initial);
  };

  const exportJSON = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `publishing-os-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppStateContext.Provider
      value={{
        state,
        addProject,
        updateProject,
        deleteProject,
        updateChecklist,
        addActivity,
        resetData,
        exportJSON,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
