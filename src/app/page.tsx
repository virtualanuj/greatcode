// src/app/page.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { PATTERNS } from '@/lib/data/patterns';
import { PROBLEMS } from '@/lib/data/problems';
import { PatternCard } from '@/components/navigation/PatternCard';
import { useProgressStore } from '@/lib/store/useProgressStore';
import { Sparkles, ArrowRight, BookOpen, Code2, CheckCircle2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const { completedProblemIds, lastActiveProblemId, lastActivePatternId } = useProgressStore();

  const totalProblems = PROBLEMS.length;
  const solvedTotal = completedProblemIds.length;
  const progressPercent = Math.round((solvedTotal / totalProblems) * 100);

  const lastActiveProblem = PROBLEMS.find((p) => p.id === lastActiveProblemId) || PROBLEMS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Python DSA Studio for Students & Interviewees</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Master Algorithmic Patterns through{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Visual Stepping
            </span>{' '}
            & Code Practice.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            Bridge the gap between theory and code. Step through internal memory states line-by-line in the{' '}
            <strong className="text-slate-200">Concept Lab</strong>, then solve 45 curated interview problems with zero-latency in-browser Python 3 execution in the{' '}
            <strong className="text-slate-200">Practice Arena</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link href="/learn/two-pointers">
              <Button size="md" variant="primary" className="gap-2 shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-4 h-4" /> Start Concept Lab
              </Button>
            </Link>
            <Link href="/practice">
              <Button size="md" variant="secondary" className="gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" /> Explore 45 Problems
              </Button>
            </Link>

            {lastActiveProblem && (
              <Link href={`/practice/${lastActiveProblem.id}`} className="ml-auto">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors">
                  <PlayCircle className="w-4 h-4 text-emerald-400" /> Resume: {lastActiveProblem.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Global Progress Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200">Curriculum Mastery Progress</h2>
          </div>
          <p className="text-xs text-slate-400">
            {solvedTotal} of {totalProblems} interview-ready problems solved ({progressPercent}%)
          </p>
        </div>

        <div className="w-full md:w-96 flex items-center gap-3">
          <div className="flex-1 h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 min-w-[40px]">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* 9 Core Patterns Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Core Algorithmic Patterns</h2>
            <p className="text-xs text-slate-400">
              9 foundational patterns structured with 2 Easy, 2 Medium, and 1 Hard problem each
            </p>
          </div>
          <Link
            href="/practice"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View all 45 problems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PATTERNS.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
    </div>
  );
}
