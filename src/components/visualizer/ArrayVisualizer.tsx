// src/components/visualizer/ArrayVisualizer.tsx
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayVisualState, ArrayPointer } from '@/types/trace.types';
import { cn } from '@/lib/utils/cn';

interface ArrayVisualizerProps {
  state: ArrayVisualState;
}

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ state }) => {
  const { elements, pointers, window: slidingWindow, highlightIndices = [] } = state;

  const getPointerBadgeColor = (color: ArrayPointer['color']) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40 ring-1 ring-blue-500/30';
      case 'rose':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 ring-1 ring-rose-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 ring-1 ring-purple-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  const getElementStyle = (elemState: string, idx: number) => {
    if (elemState === 'sorted') {
      return 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
    }
    if (elemState === 'active' || highlightIndices.includes(idx)) {
      return 'bg-indigo-950/80 border-indigo-400 text-indigo-100 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20 scale-105';
    }
    if (elemState === 'window') {
      return 'bg-indigo-900/30 border-indigo-500/50 text-slate-100';
    }
    if (elemState === 'compared') {
      return 'bg-amber-950/60 border-amber-400 text-amber-200 ring-2 ring-amber-400/40';
    }
    return 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-600';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-6">
      {/* Sliding Window Label (if active) */}
      {slidingWindow && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-medium text-indigo-300"
        >
          {slidingWindow.label || `Active Window [${slidingWindow.startIndex}..${slidingWindow.endIndex}]`}
        </motion.div>
      )}

      {/* Main Array Strip */}
      <div className="relative flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-x-auto max-w-full">
        {elements.map((elem, idx) => {
          const cellPointers = pointers.filter((p) => p.index === idx);
          const isInsideWindow =
            slidingWindow && idx >= slidingWindow.startIndex && idx <= slidingWindow.endIndex;

          return (
            <div key={idx} className="flex flex-col items-center gap-2 min-w-[56px]">
              {/* Pointer Badges on Top */}
              <div className="h-7 flex items-center justify-center gap-1">
                <AnimatePresence>
                  {cellPointers.map((ptr) => (
                    <motion.span
                      key={ptr.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-bold border shadow-sm',
                        getPointerBadgeColor(ptr.color)
                      )}
                    >
                      {ptr.name}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Element Card */}
              <motion.div
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className={cn(
                  'relative w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 select-none shadow-sm',
                  getElementStyle(elem.state, idx),
                  isInsideWindow && 'border-indigo-400/80'
                )}
              >
                <span className="text-base font-semibold font-mono tracking-tight">{elem.value}</span>
              </motion.div>

              {/* Index Number on Bottom */}
              <span className="text-[11px] font-mono text-slate-500 font-medium">{idx}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
