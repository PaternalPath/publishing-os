'use client';

import { useToast } from '@/lib/use-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px]
            animate-in slide-in-from-right duration-300
            ${
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : toast.type === 'error'
                ? 'bg-red-50 border border-red-200'
                : toast.type === 'warning'
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-blue-50 border border-blue-200'
            }
          `}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
            {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold ${
                toast.type === 'success'
                  ? 'text-green-900'
                  : toast.type === 'error'
                  ? 'text-red-900'
                  : toast.type === 'warning'
                  ? 'text-yellow-900'
                  : 'text-blue-900'
              }`}
            >
              {toast.title}
            </p>
            {toast.message && (
              <p
                className={`text-sm mt-1 ${
                  toast.type === 'success'
                    ? 'text-green-700'
                    : toast.type === 'error'
                    ? 'text-red-700'
                    : toast.type === 'warning'
                    ? 'text-yellow-700'
                    : 'text-blue-700'
                }`}
              >
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={`flex-shrink-0 rounded-lg p-1 transition-colors ${
              toast.type === 'success'
                ? 'hover:bg-green-100 text-green-600'
                : toast.type === 'error'
                ? 'hover:bg-red-100 text-red-600'
                : toast.type === 'warning'
                ? 'hover:bg-yellow-100 text-yellow-600'
                : 'hover:bg-blue-100 text-blue-600'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
