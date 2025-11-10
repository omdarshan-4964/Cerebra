'use client';

import React from 'react';
import { Calendar, Trash2, Map } from 'lucide-react';
import { MapHistoryItem } from '@/lib/types';

interface PreviousMapsListProps {
  maps: MapHistoryItem[];
  onLoad: (map: MapHistoryItem) => void;
  onDelete: (id: string) => void;
}

export function PreviousMapsList({ maps, onLoad, onDelete }: PreviousMapsListProps) {
  if (maps.length === 0) {
    return (
      <div className="text-center py-8">
        <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No saved maps yet</p>
        <p className="text-sm text-gray-400">Generate a new map to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {maps.map((map) => (
        <div
          key={map.id}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{map.topic}</h3>
              
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(map.savedAt).toLocaleDateString()}
                </span>
                {map.progress && (
                  <span className="flex items-center gap-1.5">
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: `${Math.round((map.progress.completedNodes.length / map.progress.totalNodes) * 100)}%`,
                        }}
                      />
                    </div>
                    {Math.round((map.progress.completedNodes.length / map.progress.totalNodes) * 100)}% Complete
                  </span>
                )}
              </div>

              <div className="mt-2 text-sm text-gray-600">
                {map.nodes.length} nodes • {map.templateId ? 'Template' : 'Custom'} •{' '}
                Last updated {new Date(map.savedAt).toLocaleTimeString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(map.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete map"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLoad(map)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PreviousMapsList;