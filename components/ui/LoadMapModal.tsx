'use client';

import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import PreviousMapsList from './PreviousMapsList';
import { MapHistoryItem } from '@/lib/types';

interface LoadMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  maps: MapHistoryItem[];
  onLoadMap: (map: MapHistoryItem) => void;
  onDeleteMap: (id: string) => void;
}

export function LoadMapModal({
  isOpen,
  onClose,
  maps,
  onLoadMap,
  onDeleteMap,
}: LoadMapModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Load Previous Map</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition-colors"
            title="Close modal"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <PreviousMapsList 
            maps={maps} 
            onLoad={map => {
              onLoadMap(map);
              onClose();
            }}
            onDelete={onDeleteMap}
          />
        </div>
      </div>
    </div>
  );
}

export default LoadMapModal;