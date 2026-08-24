// src/app/learn/page.tsx
'use client';
import React from 'react';
import { PATTERNS } from '@/lib/data/patterns';
import { PatternCard } from '@/components/navigation/PatternCard';
import { BookOpen } from 'lucide-react';

export default function LearnIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-400">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Concept Lab</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100">Visual Pattern Walkthroughs</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Select any pattern below to inspect line-by-line internal memory states, pointer movements, tree traversals, and DP grids with custom input values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PATTERNS.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </div>
  );
}
