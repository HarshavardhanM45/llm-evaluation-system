import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12 glass-panel" role="status" aria-label="Loading">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">Running AI Judges...</p>
    </div>
  );
}
