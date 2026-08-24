// src/components/visualizer/VisualizerCanvas.tsx
'use client';
import React from 'react';
import { DataStructureState } from '@/types/trace.types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { DPGridVisualizer } from './DPGridVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { GraphVisualizer } from './GraphVisualizer';

interface VisualizerCanvasProps {
  state: DataStructureState;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ state }) => {
  if (!state) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 text-sm">
        No state event available.
      </div>
    );
  }

  switch (state.type) {
    case 'ARRAY':
      return <ArrayVisualizer state={state} />;
    case 'LINKED_LIST':
      return <LinkedListVisualizer state={state} />;
    case 'TREE':
      return <TreeVisualizer state={state} />;
    case 'DP_GRID':
      return <DPGridVisualizer state={state} />;
    case 'STACK_QUEUE':
      return <StackVisualizer state={state} />;
    case 'GRAPH':
      return <GraphVisualizer state={state} />;
    default:
      return <div className="p-6 text-slate-500">Visualizer type not supported.</div>;
  }
};
