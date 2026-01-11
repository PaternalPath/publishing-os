'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/use-app-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { state, resetData, exportJSON } = useAppState();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    router.push('/dashboard');
  };

  const storageSize = new Blob([JSON.stringify(state)]).size;
  const storageSizeKB = (storageSize / 1024).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
        <p className="text-zinc-600 mt-1">Manage your Publishing OS configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-zinc-900 mb-2">Storage Information</h3>
            <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Total Projects:</span>
                <span className="font-medium text-zinc-900">{state.projects.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Total Activities:</span>
                <span className="font-medium text-zinc-900">{state.activities.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Storage Used:</span>
                <span className="font-medium text-zinc-900">{storageSizeKB} KB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Storage Type:</span>
                <span className="font-medium text-zinc-900">Browser LocalStorage</span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <h3 className="font-semibold text-zinc-900 mb-2">Export All Data</h3>
            <p className="text-sm text-zinc-600 mb-4">
              Download all your projects and activities as a JSON file. Use this for backup or to migrate your data.
            </p>
            <Button onClick={exportJSON}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Reset Demo Data
            </h3>
            <p className="text-sm text-zinc-600 mb-4">
              This will delete all your current projects and restore the original demo data. This action cannot be undone.
            </p>
            {showResetConfirm ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-900 font-semibold mb-4">
                  Are you sure you want to reset all data?
                </p>
                <p className="text-sm text-red-700 mb-4">
                  This will permanently delete all your projects and activities and restore the demo data.
                </p>
                <div className="flex gap-2">
                  <Button variant="danger" onClick={handleReset}>
                    Yes, Reset Everything
                  </Button>
                  <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Demo Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">About Demo Mode</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              Publishing OS is running in demo mode with localStorage persistence. Your data is stored locally in your browser.
            </p>
            <p>
              <strong>Privacy:</strong> No personal information is collected or transmitted. All data stays on your device.
            </p>
            <p>
              <strong>Limitations:</strong> Data is browser-specific and will be lost if you clear browser data.
              Always export important data for backup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
