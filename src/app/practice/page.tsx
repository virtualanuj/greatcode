// src/app/practice/page.tsx
'use client';
import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PROBLEMS } from '@/lib/data/problems';
import { PATTERNS } from '@/lib/data/patterns';
import { Badge } from '@/components/ui/Badge';
import { useProgressStore } from '@/lib/store/useProgressStore';
import {
  Code2,
  CheckCircle2,
  Bookmark,
  Search,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

function PracticeCatalogContent() {
  const searchParams = useSearchParams();
  const initialPattern = searchParams.get('pattern') || 'all';

  const [selectedPattern, setSelectedPattern] = useState<string>(initialPattern);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { completedProblemIds, bookmarkedProblemIds, toggleProblemBookmarked } = useProgressStore();

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((p) => {
      const matchPattern = selectedPattern === 'all' || p.patternId === selectedPattern;
      const matchDifficulty =
        selectedDifficulty === 'all' ||
        p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patternId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPattern && matchDifficulty && matchSearch;
    });
  }, [selectedPattern, selectedDifficulty, searchQuery]);

  const solvedCount = PROBLEMS.filter((p) => completedProblemIds.includes(p.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <Code2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Practice Arena</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">45 Curated Interview Problems</h1>
          <p className="text-xs text-slate-400">
            Master 5 high-frequency problems per pattern (2 Easy, 2 Medium, 1 Hard) in Python.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">Progress</span>
            <span className="font-bold text-slate-100">
              {solvedCount} / {PROBLEMS.length} Solved
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        {/* Search Bar */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Pattern Filter */}
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            aria-label="Filter by Pattern"
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All 9 Patterns</option>
            {PATTERNS.map((pat) => (
              <option key={pat.id} value={pat.id}>
                {pat.name}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            aria-label="Filter by Difficulty"
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (18)</option>
            <option value="medium">Medium (18)</option>
            <option value="hard">Hard (9)</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono text-[11px]">
                <th className="p-3.5 pl-5 w-12 text-center">Status</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Pattern</th>
                <th className="p-3.5">Difficulty</th>
                <th className="p-3.5">Target Complexity</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono">
                    No problems match your filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const isSolved = completedProblemIds.includes(prob.id);
                  const isBookmarked = bookmarkedProblemIds.includes(prob.id);
                  const patternDef = PATTERNS.find((p) => p.id === prob.patternId);

                  return (
                    <tr key={prob.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Solved Status */}
                      <td className="p-3.5 pl-5 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto fill-emerald-400/20" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700 block mx-auto" />
                        )}
                      </td>

                      {/* Title & Bookmark */}
                      <td className="p-3.5 font-medium text-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleProblemBookmarked(prob.id)}
                            className="text-slate-600 hover:text-amber-400 transition-colors"
                            title={isBookmarked ? 'Bookmarked' : 'Bookmark problem'}
                            aria-label="Bookmark problem"
                          >
                            <Bookmark
                              className={cn(
                                'w-3.5 h-3.5',
                                isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                              )}
                            />
                          </button>
                          <Link
                            href={`/practice/${prob.id}`}
                            className="hover:text-indigo-400 transition-colors"
                          >
                            {prob.title}
                          </Link>
                        </div>
                      </td>

                      {/* Pattern Badge */}
                      <td className="p-3.5">
                        <Link
                          href={`/learn/${prob.patternId}`}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300 font-mono"
                        >
                          <span>{patternDef?.name || prob.patternId}</span>
                        </Link>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="p-3.5">
                        <Badge
                          variant={
                            prob.difficulty === 'Easy'
                              ? 'easy'
                              : prob.difficulty === 'Medium'
                              ? 'medium'
                              : 'hard'
                          }
                          size="sm"
                        >
                          {prob.difficulty}
                        </Badge>
                      </td>

                      {/* Complexity */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">
                        <span>{prob.timeComplexity}</span> | <span>{prob.spaceComplexity}</span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 pr-5 text-right">
                        <Link
                          href={`/practice/${prob.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-200 border border-slate-700 transition-all shadow-sm"
                        >
                          <span>Code</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function PracticeCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8 text-slate-500 font-mono text-xs">
          Loading Practice Arena Catalog...
        </div>
      }
    >
      <PracticeCatalogContent />
    </Suspense>
  );
}
