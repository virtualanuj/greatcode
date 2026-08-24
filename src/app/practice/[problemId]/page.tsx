// src/app/practice/[problemId]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { PROBLEMS } from '@/lib/data/problems';
import { PATTERNS } from '@/lib/data/patterns';
import { ProblemStatement } from '@/components/editor/ProblemStatement';
import { TestCasesPanel } from '@/components/editor/TestCasesPanel';
import { pyodideService } from '@/lib/pyodide/pyodideService';
import { useProgressStore } from '@/lib/store/useProgressStore';
import { TestResultItem } from '@/types/worker.types';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Dynamic Monaco Editor to prevent SSR issues
const MonacoPythonEditor = dynamic(
  () => import('@/components/editor/MonacoPythonEditor').then((mod) => mod.MonacoPythonEditor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 text-xs font-mono">
        Loading Monaco Python Editor...
      </div>
    ),
  }
);

export default function ProblemPracticePage() {
  const params = useParams();
  const problemId = (params?.problemId as string) || 'two-sum-ii';
  const problem = PROBLEMS.find((p) => p.id === problemId) || PROBLEMS[0];
  const pattern = PATTERNS.find((p) => p.id === problem.patternId);

  const {
    getCodeDraft,
    saveCodeDraft,
    markProblemCompleted,
    setLastActive,
    completedProblemIds,
  } = useProgressStore();

  const [code, setCode] = useState<string>(() => {
    return getCodeDraft(problem.id, problem.starterCode);
  });

  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [executionError, setExecutionError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLastActive(problem.patternId, problem.id);
    setCode(getCodeDraft(problem.id, problem.starterCode));
    setTestResults([]);
    setExecutionError(undefined);
  }, [problem.id, problem.patternId, problem.starterCode, getCodeDraft, setLastActive]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    saveCodeDraft(problem.id, newCode);
  };

  const handleResetCode = () => {
    if (confirm('Reset code to starter boilerplate?')) {
      setCode(problem.starterCode);
      saveCodeDraft(problem.id, problem.starterCode);
    }
  };

  // Helper to extract target function name from starter code
  const getEntryFunctionName = (): string => {
    const match = problem.starterCode.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
    return match ? match[1] : 'solution';
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setExecutionError(undefined);

    try {
      const entryFn = getEntryFunctionName();
      const output = await pyodideService.runTests(code, entryFn, problem.testCases);

      if (output.error) {
        setExecutionError(output.error);
        setTestResults([]);
      } else {
        setTestResults(output.results);
        if (output.allPassed) {
          markProblemCompleted(problem.id);
          // Trigger victory confetti!
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
        }
      }
    } catch (err: any) {
      setExecutionError(err.message || 'Execution error.');
    } finally {
      setIsRunning(false);
    }
  };

  // Global Ctrl/Cmd + Enter shortcut to run code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunTests();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const isSolved = completedProblemIds.includes(problem.id);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="h-12 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-sm">{problem.title}</span>
            {isSolved && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Solved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/learn/${problem.patternId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open {pattern?.name || 'Pattern'} Stepper</span>
          </Link>

          <button
            onClick={handleResetCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
            title="Reset code to default"
            aria-label="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Pane: Problem Statement & Hint Ladder (5 cols) */}
        <div className="lg:col-span-5 flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
          <ProblemStatement problem={problem} />
        </div>

        {/* Right Pane: Monaco Editor & Test Cases Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 overflow-hidden">
          {/* Top Code Editor Area (60% height) */}
          <div className="flex-[3] flex flex-col min-h-[300px] overflow-hidden border-b border-slate-800">
            <div className="p-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Python 3.12 (Direct WASM Runtime)</span>
              <span className="text-[11px] text-slate-500">Shortcut: Cmd/Ctrl + Enter</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <MonacoPythonEditor code={code} onChange={handleCodeChange} />
            </div>
          </div>

          {/* Bottom Test Cases Panel (40% height) */}
          <div className="flex-[2] flex flex-col min-h-[220px] overflow-hidden">
            <TestCasesPanel
              testCases={problem.testCases}
              results={testResults}
              isRunning={isRunning}
              onRunTests={handleRunTests}
              error={executionError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
