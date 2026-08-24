// src/components/editor/ProblemStatement.tsx
'use client';
import React from 'react';
import { ProblemDefinition } from '@/types/curriculum.types';
import { Badge } from '@/components/ui/Badge';
import { HintLadder } from './HintLadder';
import { Clock, HardDrive, CheckCircle } from 'lucide-react';
import { useProgressStore } from '@/lib/store/useProgressStore';
import Link from 'next/link';

interface ProblemStatementProps {
  problem: ProblemDefinition;
}

export const ProblemStatement: React.FC<ProblemStatementProps> = ({ problem }) => {
  const { completedProblemIds, toggleProblemCompleted } = useProgressStore();
  const isCompleted = completedProblemIds.includes(problem.id);

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto space-y-6 text-slate-200">
      {/* Title & Metadata */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-xl font-bold text-slate-100">{problem.title}</h1>
          <button
            onClick={() => toggleProblemCompleted(problem.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            <CheckCircle
              className={`w-4 h-4 ${
                isCompleted ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'
              }`}
            />
            <span>{isCompleted ? 'Solved' : 'Mark Solved'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge
            variant={
              problem.difficulty === 'Easy'
                ? 'easy'
                : problem.difficulty === 'Medium'
                ? 'medium'
                : 'hard'
            }
          >
            {problem.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Time: {problem.timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <HardDrive className="w-3 h-3 text-slate-500" />
            <span>Space: {problem.spaceComplexity}</span>
          </div>
          <Link
            href={`/learn/${problem.patternId}`}
            className="text-indigo-400 hover:text-indigo-300 ml-auto font-medium text-xs hover:underline flex items-center gap-1"
          >
            👁️ View Pattern Visualizer
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-4">
        <div className="whitespace-pre-line">{problem.descriptionMarkdown}</div>
      </div>

      {/* Constraints */}
      {problem.constraints.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 tracking-wide uppercase">Constraints</h3>
          <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-slate-400">
            {problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Progressive Hint Ladder */}
      <HintLadder hints={problem.hints} />
    </div>
  );
};
