// src/components/visualizer/StackVisualizer.tsx
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StackQueueVisualState } from '@/types/trace.types';
import { cn } from '@/lib/utils/cn';

interface StackVisualizerProps {
  state: StackQueueVisualState;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ state }) => {
  const { items } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
      <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner w-72 min-h-[220px]">
        <div className="w-full border-b border-slate-800 pb-2 mb-3 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Monotonic Stack (LIFO)</span>
          <span>Top &darr;</span>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-600 text-xs font-mono">
            [ Empty Stack ]
          </div>
        ) : (
          <div className="w-full flex flex-col-reverse gap-2">
            <AnimatePresence>
              {items.map((item, idx) => {
                const isTop = idx === items.length - 1;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0.8, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, x: 20 }}
                    layout
                    className={cn(
                      'w-full p-2.5 rounded-lg border font-mono text-xs flex items-center justify-between shadow-sm transition-all',
                      isTop
                        ? 'bg-amber-950/80 border-amber-400 text-amber-100 ring-1 ring-amber-400/40 font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-200'
                    )}
                  >
                    <span>{item.value}</span>
                    {isTop && <span className="text-[10px] text-amber-400 font-sans">TOP</span>}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
