'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  matchCount?: number;
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  matchCount,
  className = '',
  placeholder = 'Search nodes...',
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-12 py-2 rounded-xl border border-slate-700/30 bg-slate-800/60 backdrop-blur-sm 
                   text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60
                   transition-all duration-300 shadow-sm hover:shadow"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 p-1 rounded-full hover:bg-slate-700/50 text-gray-500 hover:text-gray-300"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {typeof matchCount !== 'undefined' && (
        <div className="absolute right-3 top-2 text-xs font-medium text-gray-400">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
        </div>
      )}
    </div>
  );
}

export default SearchBar;