import React from 'react';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-gray-900">
              AI Evaluation <span className="text-blue-600">Platform</span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
