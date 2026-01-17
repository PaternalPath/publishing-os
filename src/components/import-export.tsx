'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, Download, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppState } from '@/lib/use-app-state';
import { useToast } from '@/lib/use-toast';

export function ImportExport() {
  const { state, importData, loadDemo, exportJSON } = useAppState();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const text = await file.text();
      await importData(text);
      addToast('success', 'Import Successful', 'Your data has been imported successfully');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import file';
      setError(message);
      addToast('error', 'Import Failed', message);
    } finally {
      setImporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    setError(null);

    try {
      await loadDemo();
      addToast('success', 'Demo Loaded', 'Demo project has been loaded successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load demo data';
      setError(message);
      addToast('error', 'Demo Load Failed', message);
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleExport = () => {
    exportJSON();
    addToast('success', 'Export Complete', 'Your data has been exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">Import Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            Download all your projects, tasks, and activities as a JSON file. You can use this file
            to back up your data or import it later.
          </p>
          <div className="flex items-center gap-3">
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export to JSON
            </Button>
            <span className="text-sm text-zinc-500">
              {state.projects.length} projects, {state.tasks.length} tasks
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            Upload a previously exported JSON file to restore your data. This will replace all
            current data.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Importing will overwrite all existing projects, tasks, and
              activities. Export your current data first if you want to keep it.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Import JSON file"
          />
          <Button
            onClick={handleImportClick}
            disabled={importing}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {importing ? (
              <>
                <div className="h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import from JSON
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Load Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Load Demo Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            Load a sample project with tasks and activities to explore the features of Publishing
            OS. Great for first-time users!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">What's included:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>1 complete project in Edit stage</li>
                <li>4 sample tasks (done, doing, todo)</li>
                <li>Activity history with stage changes</li>
              </ul>
            </div>
          </div>
          <Button
            onClick={handleLoadDemo}
            disabled={loadingDemo}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {loadingDemo ? (
              <>
                <div className="h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                Loading Demo...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Load Demo Project
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900">{state.projects.length}</div>
              <div className="text-sm text-zinc-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900">{state.tasks.length}</div>
              <div className="text-sm text-zinc-600">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900">{state.activities.length}</div>
              <div className="text-sm text-zinc-600">Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900">{state.version}</div>
              <div className="text-sm text-zinc-600">Schema Version</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
