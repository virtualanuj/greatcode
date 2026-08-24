// src/components/visualizer/StateInspector.tsx
'use client';
import React from 'react';
import { TraceEvent } from '@/types/trace.types';
import { Info, Code, Database } from 'lucide-react';

interface StateInspectorProps {
  currentEvent?: TraceEvent;
}

export const StateInspector: React.FC<StateInspectorProps> = ({ currentEvent }) => {
  if (!currentEvent) {
    return (
      <div className="p-4 text-slate-500 text-xs font-mono">No execution event recorded.</div>
    );
  }

  const { explanation, variables, line } = currentEvent;

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800 text-xs select-none">
      {/* Explanation Banner */}
      <div className="p-3 bg-indigo-950/40 border-b border-indigo-500/20 flex items-start gap-2 text-indigo-200">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-bold text-indigo-300 mr-1.5">Line {line}:</span>
          {explanation}
        </div>
      </div>

      {/* Variables Inspector */}
      <div className="p-3 overflow-y-auto max-h-48 space-y-2">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] font-semibold">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>Local Variables Watch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(variables).map(([key, value]) => {
            const formatted = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return (
              <div
                key={key}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono flex flex-col justify-between overflow-hidden"
              >
                <span className="text-slate-400 text-[10px] truncate">{key}</span>
                <span className="text-slate-100 font-bold text-xs truncate mt-0.5">
                  {formatted}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
