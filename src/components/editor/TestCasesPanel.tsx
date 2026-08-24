// src/components/editor/TestCasesPanel.tsx
'use client';
import React, { useState } from 'react';
import { TestCase } from '@/types/curriculum.types';
import { TestResultItem } from '@/types/worker.types';
import { CheckCircle2, XCircle, Terminal, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

interface TestCasesPanelProps {
  testCases: TestCase[];
  results: TestResultItem[];
  isRunning: boolean;
  onRunTests: () => void;
  error?: string;
}

export const TestCasesPanel: React.FC<TestCasesPanelProps> = ({
  testCases,
  results,
  isRunning,
  onRunTests,
  error,
}) => {
  const [activeTab, setActiveTab] = useState<string>('case-0');

  const activeIndex = Number(activeTab.replace('case-', '')) || 0;
  const currentCase = testCases[activeIndex] || testCases[0];
  const currentResult = results.find((r) => r.testCaseId === currentCase?.id);

  const totalPassed = results.filter((r) => r.passed).length;
  const allPassed = results.length > 0 && totalPassed === results.length;

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-t border-slate-800 text-slate-200">
      {/* Header Bar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Test Cases</span>
          {results.length > 0 && (
            <Badge variant={allPassed ? 'easy' : 'hard'} size="sm">
              {totalPassed} / {results.length} Passed
            </Badge>
          )}
        </div>

        <Button
          onClick={onRunTests}
          isLoading={isRunning}
          size="sm"
          variant={allPassed ? 'success' : 'primary'}
          className="gap-1.5"
        >
          {isRunning ? (
            'Running Tests...'
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> Run Code
            </>
          )}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-950/60 border-b border-rose-500/30 text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto">
        {testCases.map((tc, idx) => {
          const res = results.find((r) => r.testCaseId === tc.id);
          const isActive = activeTab === `case-${idx}`;

          return (
            <button
              key={tc.id}
              onClick={() => setActiveTab(`case-${idx}`)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all',
                isActive
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              )}
            >
              {res && (
                res.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                )
              )}
              <span>Case {idx + 1}</span>
              {tc.isHidden && <span className="text-[10px] text-amber-400 font-sans">(Hidden)</span>}
            </button>
          );
        })}
      </div>

      {/* Case Details */}
      {currentCase && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          <div>
            <span className="text-slate-400 block mb-1 font-sans">Input:</span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
              {JSON.stringify(currentCase.input, null, 2)}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1 font-sans">Expected Output:</span>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
              {JSON.stringify(currentCase.expectedOutput)}
            </div>
          </div>

          {currentResult && (
            <div>
              <span className="text-slate-400 block mb-1 font-sans">Your Output:</span>
              <div
                className={cn(
                  'p-2.5 rounded-lg border',
                  currentResult.passed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                )}
              >
                {currentResult.error ? (
                  <span className="text-rose-400">Error: {currentResult.error}</span>
                ) : (
                  JSON.stringify(currentResult.actualOutput)
                )}
              </div>
            </div>
          )}

          {currentResult?.stdout && (
            <div>
              <span className="text-slate-400 block mb-1 font-sans flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-slate-500" /> Standard Output (stdout):
              </span>
              <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] whitespace-pre-wrap">
                {currentResult.stdout}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
