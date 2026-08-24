// src/components/visualizer/DPGridVisualizer.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { DPGridVisualState } from '@/types/trace.types';
import { cn } from '@/lib/utils/cn';

interface DPGridVisualizerProps {
  state: DPGridVisualState;
}

export const DPGridVisualizer: React.FC<DPGridVisualizerProps> = ({ state }) => {
  const { grid, colHeaders, rowHeaders, activeCell, formulaDescription } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
      {formulaDescription && (
        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-300">
          {formulaDescription}
        </div>
      )}

      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-x-auto max-w-full">
        <table className="border-collapse">
          {colHeaders && (
            <thead>
              <tr>
                {rowHeaders && <th className="p-2"></th>}
                {colHeaders.map((header, c) => (
                  <th key={c} className="p-2 text-xs font-mono text-slate-400 font-medium text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {rowHeaders && (
                  <td className="p-2 text-xs font-mono text-slate-400 font-medium text-right pr-3">
                    {rowHeaders[r]}
                  </td>
                )}
                {row.map((cell, c) => {
                  const isActive = activeCell?.row === r && activeCell?.col === c;
                  const isBase = cell.state === 'base_case';
                  const isComputed = cell.state === 'computed';

                  return (
                    <td key={c} className="p-1.5 text-center">
                      <motion.div
                        layout
                        className={cn(
                          'w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-sm font-bold shadow-sm transition-all',
                          isActive
                            ? 'bg-amber-950/90 border-amber-400 text-amber-100 ring-2 ring-amber-500/50 scale-105 animate-pulse'
                            : isBase
                            ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                            : isComputed
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-600'
                        )}
                      >
                        {cell.value !== null ? cell.value : '-'}
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
