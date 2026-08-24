// src/components/visualizer/TreeVisualizer.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TreeVisualState } from '@/types/trace.types';
import { cn } from '@/lib/utils/cn';

interface TreeVisualizerProps {
  state: TreeVisualState;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ state }) => {
  const { nodes, currentNodeId, rootId } = state;

  if (!rootId || !nodes[rootId]) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 text-sm">
        Empty Tree (None)
      </div>
    );
  }

  // Helper to render tree hierarchically
  const renderNode = (nodeId: string | null) => {
    if (!nodeId || !nodes[nodeId]) return null;
    const node = nodes[nodeId];
    const isCurrent = currentNodeId === node.id || node.state === 'active';
    const isCompleted = node.state === 'completed';

    return (
      <div className="flex flex-col items-center">
        {/* Node Circle */}
        <motion.div
          layout
          className={cn(
            'w-12 h-12 rounded-full border flex items-center justify-center font-mono font-bold text-sm shadow-md transition-all z-10',
            isCurrent
              ? 'bg-indigo-950 border-indigo-400 text-indigo-100 ring-4 ring-indigo-500/40 scale-110'
              : isCompleted
              ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
              : 'bg-slate-900 border-slate-700 text-slate-200'
          )}
        >
          {node.value}
        </motion.div>

        {/* Children Subtrees */}
        {(node.leftId || node.rightId) && (
          <div className="flex items-start justify-center gap-6 mt-4 pt-2 relative">
            {node.leftId && (
              <div className="flex flex-col items-center">
                {renderNode(node.leftId)}
              </div>
            )}
            {node.rightId && (
              <div className="flex flex-col items-center">
                {renderNode(node.rightId)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 space-y-4">
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-x-auto max-w-full min-h-[220px] flex items-center justify-center">
        {renderNode(rootId)}
      </div>
    </div>
  );
};
