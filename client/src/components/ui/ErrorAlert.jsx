import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorAlert({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-800"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
