import { useState, useEffect, useCallback } from 'react';
import { LearningMapData, MapHistoryItem } from '../lib/types';

const HISTORY_KEY = 'cerebra:mapHistory';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [key, state]);

  return [state, setState] as const;
}

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const saveMapToHistory = (map: LearningMapData) => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list: MapHistoryItem[] = raw ? JSON.parse(raw) : [];
    const item: MapHistoryItem = { ...map, savedAt: new Date().toISOString(), id: makeId() };
    list.unshift(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
    return item;
  } catch (e) {
    return null;
  }
};

export const getMapHistory = (): MapHistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const clearMapHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
