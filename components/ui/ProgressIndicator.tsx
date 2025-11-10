'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  className?: string;
}

export function ProgressIndicator({ completed, total, className = '' }: ProgressIndicatorProps) {
  const percentage = Math.round((completed / total) * 100) || 0;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5 text-sm">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="font-medium">{percentage}%</span>
        <span className="text-gray-500">
          ({completed}/{total} completed)
        </span>
      </div>
    </div>
  );
}

export default ProgressIndicator;