"use client";

import React, { useEffect, useState } from 'react';

type ToastItem = { id: string; message: string; level: 'info' | 'success' | 'error' };

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as any;
      if (!detail) return;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((s) => [...s, { id, message: detail.message, level: detail.level || 'info' }]);
    };

    window.addEventListener('cerebra-toast', handler as EventListener);
    return () => window.removeEventListener('cerebra-toast', handler as EventListener);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(() => {
      setToasts((s) => s.slice(1));
    }, 3800);
    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-80 p-3 rounded-lg shadow-lg text-sm text-white flex items-center gap-3 ${
            t.level === 'success' ? 'bg-green-500' : t.level === 'error' ? 'bg-red-500' : 'bg-slate-700'
          }`}
        >
          <div className="flex-1">{t.message}</div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
