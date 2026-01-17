'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/use-app-state';
import { Button } from './ui/button';
import { Modal } from './ui/modal';
import { Input } from './ui/input';
import { Select } from './ui/input';
import type { Task } from '@/types';
import { Plus, Calendar, User, Tag, Trash2, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format, isPast, isToday, isThisWeek } from 'date-fns';
import { nanoid } from 'nanoid';

interface TaskListProps {
  projectId: string;
}

type TaskFilter = 'all' | 'todo' | 'doing' | 'done' | 'overdue' | 'week';

export function TaskList({ projectId }: TaskListProps) {
  const { state, addTask, updateTask, deleteTask } = useAppState();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    dueDate: '',
    owner: '',
    tags: '',
  });

  const tasks = state.tasks.filter((t) => t.projectId === projectId);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'overdue') {
      return task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
    }
    if (filter === 'week') {
      return task.dueDate && isThisWeek(new Date(task.dueDate));
    }
    return task.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        dueDate: formData.dueDate || undefined,
        owner: formData.owner || undefined,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : undefined,
      });
    } else {
      addTask({
        projectId,
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        dueDate: formData.dueDate || undefined,
        owner: formData.owner || undefined,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : undefined,
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      dueDate: '',
      owner: '',
      tags: '',
    });
    setEditingTask(null);
    setShowAddModal(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: task.dueDate || '',
      owner: task.owner || '',
      tags: task.tags?.join(', ') || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const toggleTaskStatus = (task: Task) => {
    const nextStatus: Record<Task['status'], Task['status']> = {
      todo: 'doing',
      doing: 'done',
      done: 'todo',
    };
    updateTask(task.id, { status: nextStatus[task.status] });
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  };

  const filters: { value: TaskFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: tasks.length },
    { value: 'todo', label: 'To Do', count: tasks.filter((t) => t.status === 'todo').length },
    { value: 'doing', label: 'Doing', count: tasks.filter((t) => t.status === 'doing').length },
    { value: 'done', label: 'Done', count: tasks.filter((t) => t.status === 'done').length },
    {
      value: 'overdue',
      label: 'Overdue',
      count: tasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'done')
        .length,
    },
    {
      value: 'week',
      label: 'This Week',
      count: tasks.filter((t) => t.dueDate && isThisWeek(new Date(t.dueDate))).length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {f.label}{' '}
              <span
                className={filter === f.value ? 'text-blue-100' : 'text-zinc-500'}
              >
                ({f.count})
              </span>
            </button>
          ))}
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
          <CheckCircle className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-zinc-600 font-medium">No tasks {filter !== 'all' && `in "${filters.find((f) => f.value === filter)?.label}"`}</p>
          <p className="text-sm text-zinc-500 mt-1">
            {filter === 'all' ? 'Add your first task to get started' : 'Try selecting a different filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => {
            const overdueTask = isOverdue(task);
            const dueSoon = task.dueDate && (isToday(new Date(task.dueDate)) || isThisWeek(new Date(task.dueDate))) && task.status !== 'done';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg border p-4 hover:shadow-sm transition-all ${
                  overdueTask ? 'border-red-300 bg-red-50' : 'border-zinc-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="flex-shrink-0 mt-1"
                  >
                    {task.status === 'done' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : task.status === 'doing' ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-zinc-300 rounded-full hover:border-blue-600 transition-colors" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium ${
                        task.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-900'
                      }`}
                    >
                      {task.title}
                      {overdueTask && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </span>
                      )}
                      {dueSoon && !overdueTask && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                          <Clock className="h-3 w-3" />
                          Due Soon
                        </span>
                      )}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-zinc-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                      )}
                      {task.owner && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.owner}
                        </span>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {task.tags.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      aria-label="Edit task"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={resetForm}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Task Title *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about this task..."
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-1">Status</label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Task['status'] })
                }
                options={[
                  { value: 'todo', label: 'To Do' },
                  { value: 'doing', label: 'Doing' },
                  { value: 'done', label: 'Done' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-1">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-1">Owner</label>
              <Input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Assignee name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-1">Tags</label>
              <Input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Comma-separated"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
