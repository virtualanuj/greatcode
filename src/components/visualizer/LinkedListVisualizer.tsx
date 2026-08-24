// src/components/visualizer/LinkedListVisualizer.tsx
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkedListVisualState } from '@/types/trace.types';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LinkedListVisualizerProps {
  state: LinkedListVisualState;
}

export const LinkedListVisualizer: React.FC<LinkedListVisualizerProps> = ({ state }) => {
  const { nodes, pointers } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-6">
      <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-x-auto max-w-full">
        {nodes.map((node, idx) => {
          const nodePointers = pointers.filter((p) => p.targetNodeId === node.id);
          const isCurrent = node.state === 'current';
          const isModified = node.state === 'modified';
          const isVisited = node.state === 'visited';

          return (
            <React.Fragment key={node.id}>
              <div className="flex flex-col items-center gap-2 min-w-[70px]">
                {/* Pointer tags */}
                <div className="h-7 flex items-center justify-center gap-1">
                  <AnimatePresence>
                    {nodePointers.map((ptr) => (
                      <motion.span
                        key={ptr.name}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-bold border shadow-sm',
                          ptr.name.includes('head')
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : ptr.name === 'curr'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        )}
                      >
                        {ptr.name}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Node Box */}
                <motion.div
                  layout
                  className={cn(
                    'w-16 h-16 rounded-xl border flex flex-col items-center justify-center font-mono shadow-md transition-all',
                    isCurrent
                      ? 'bg-blue-950/80 border-blue-400 text-blue-100 ring-2 ring-blue-500/50 scale-105'
                      : isModified
                      ? 'bg-amber-950/80 border-amber-400 text-amber-100 ring-2 ring-amber-500/50'
                      : isVisited
                      ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                      : 'bg-slate-900 border-slate-700 text-slate-200'
                  )}
                >
                  <span className="text-base font-bold">{node.value}</span>
                  <span className="text-[9px] text-slate-400 font-sans mt-0.5">.next</span>
                </motion.div>

                <span className="text-[10px] font-mono text-slate-500">{node.id}</span>
              </div>

              {/* Arrow Connector */}
              {idx < nodes.length - 1 && (
                <div className="flex items-center text-slate-600 mb-6">
                  {node.nextId === `node-${idx - 1}` ? (
                    <ArrowLeft className="w-5 h-5 text-amber-400 animate-pulse" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
