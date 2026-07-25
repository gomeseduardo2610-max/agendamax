'use client';

import React from 'react';
import { useToast } from '@/lib/useToast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastManager() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 duration-200 ${
            t.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100'
              : t.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-100'
              : 'bg-indigo-950/90 border-indigo-500/40 text-indigo-100'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
          </div>

          <div className="flex-1">
            <h4 className="text-xs font-bold leading-snug">{t.title}</h4>
            {t.description && <p className="text-[11px] opacity-80 mt-0.5">{t.description}</p>}
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
