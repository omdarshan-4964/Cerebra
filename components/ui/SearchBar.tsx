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
        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-12 py-2 rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm 
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/60
                   transition-all duration-300 shadow-sm hover:shadow"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 p-1 rounded-full hover:bg-gray-100/80 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {typeof matchCount !== 'undefined' && (
        <div className="absolute right-3 top-2 text-xs font-medium text-gray-500">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
        </div>
      )}
    </div>
  );
}

export default SearchBar;