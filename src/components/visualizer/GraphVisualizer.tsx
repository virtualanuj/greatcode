// src/components/visualizer/GraphVisualizer.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { GraphVisualState } from '@/types/trace.types';
import { cn } from '@/lib/utils/cn';

interface GraphVisualizerProps {
  state: GraphVisualState;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ state }) => {
  const { nodes, activeNodeId } = state;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-x-auto max-w-full">
        <div className="grid grid-cols-3 gap-3">
          {nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isVisited = node.state === 'visited';

            return (
              <motion.div
                key={node.id}
                layout
                className={cn(
                  'w-20 h-20 rounded-xl border flex flex-col items-center justify-center font-mono text-xs font-bold p-2 shadow-sm transition-all',
                  isActive
                    ? 'bg-indigo-950 border-indigo-400 text-indigo-100 ring-2 ring-indigo-500/50 scale-105 animate-pulse'
                    : isVisited
                    ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                    : 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                )}
              >
                <span>{node.label}</span>
                <span className="text-[9px] font-sans font-normal mt-1 opacity-75">
                  {node.state}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
