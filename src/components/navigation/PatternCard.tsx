// src/components/navigation/PatternCard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { PatternDefinition } from '@/types/curriculum.types';
import { PROBLEMS } from '@/lib/data/problems';
import { useProgressStore } from '@/lib/store/useProgressStore';
import {
  MoveHorizontal,
  Maximize2,
  GitCommit,
  Layers,
  Binary,
  Search,
  Network,
  Table,
  GitFork,
  CheckCircle2,
  ArrowRight,
  Eye,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PatternCardProps {
  pattern: PatternDefinition;
}

export const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
  const { completedProblemIds } = useProgressStore();
  const patternProblems = PROBLEMS.filter((p) => p.patternId === pattern.id);
  const solvedCount = patternProblems.filter((p) => completedProblemIds.includes(p.id)).length;
  const isComplete = solvedCount === patternProblems.length && patternProblems.length > 0;

  // Icon mapping
  const getIcon = () => {
    switch (pattern.id) {
      case 'two-pointers':
        return <MoveHorizontal className="w-5 h-5 text-blue-400" />;
      case 'sliding-window':
        return <Maximize2 className="w-5 h-5 text-indigo-400" />;
      case 'linked-list':
        return <GitCommit className="w-5 h-5 text-emerald-400" />;
      case 'stack-queue':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'trees-bst':
        return <Binary className="w-5 h-5 text-teal-400" />;
      case 'binary-search':
        return <Search className="w-5 h-5 text-rose-400" />;
      case 'graphs':
        return <Network className="w-5 h-5 text-purple-400" />;
      case 'dynamic-prog':
        return <Table className="w-5 h-5 text-cyan-400" />;
      case 'backtracking':
        return <GitFork className="w-5 h-5 text-pink-400" />;
      default:
        return <Code2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all group shadow-sm">
      <div className="space-y-3">
        {/* Header: Icon, Name, Solved Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                {pattern.name}
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Time: {pattern.timeComplexityTypical} | Space: {pattern.spaceComplexityTypical}
              </span>
            </div>
          </div>

          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border',
              isComplete
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : solvedCount > 0
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            )}
          >
            {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            {solvedCount} / {patternProblems.length}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {pattern.shortDescription}
        </p>

        {/* Difficulty Breakdown Badges */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            2 Easy
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            2 Medium
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
            1 Hard
          </span>
        </div>
      </div>

      {/* Dual CTA: Learn vs Practice */}
      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-800/80">
        <Link
          href={`/learn/${pattern.id}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>Concept Lab</span>
        </Link>
        <Link
          href={`/practice?pattern=${pattern.id}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Practice</span>
        </Link>
      </div>
    </div>
  );
};
