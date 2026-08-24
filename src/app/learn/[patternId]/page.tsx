// src/app/learn/[patternId]/page.tsx
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PATTERNS } from '@/lib/data/patterns';
import { generatePatternTrace } from '@/lib/data/visualizers';
import { useTimelineStore } from '@/lib/store/useTimelineStore';
import { useProgressStore } from '@/lib/store/useProgressStore';
import { VisualizerCanvas } from '@/components/visualizer/VisualizerCanvas';
import { StepperControls } from '@/components/visualizer/StepperControls';
import { CustomInputSandbox } from '@/components/visualizer/CustomInputSandbox';
import { StateInspector } from '@/components/visualizer/StateInspector';
import { Badge } from '@/components/ui/Badge';
import { Code2, ArrowLeft, ArrowRight, Lightbulb, Clock, HardDrive } from 'lucide-react';
import Link from 'next/link';

export default function PatternVisualizerPage() {
  const params = useParams();
  const patternId = (params?.patternId as string) || 'two-pointers';
  const pattern = PATTERNS.find((p) => p.id === patternId) || PATTERNS[0];

  const { setEvents, events, currentStep, setCurrentStep } = useTimelineStore();
  const { setLastActive } = useProgressStore();

  const [currentInputs, setCurrentInputs] = useState<Record<string, any>>(
    pattern.visualizerDefaultInputs
  );

  // Initialize and generate trace when pattern or inputs change
  useEffect(() => {
    setLastActive(pattern.id);
    const traceEvents = generatePatternTrace(pattern.id, currentInputs);
    setEvents(traceEvents);
  }, [pattern.id, currentInputs, setEvents, setLastActive]);

  const currentEvent = events[currentStep] || events[0];

  const codeLines = useMemo(() => {
    return pattern.visualizerDefaultCode.split('\n');
  }, [pattern.visualizerDefaultCode]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="h-12 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            title="Back to Concept Lab"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-100 text-sm">{pattern.name}</h1>
            <Badge variant="indigo" size="sm">
              Concept Lab
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] hidden sm:flex">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              <Clock className="w-3 h-3 text-slate-500" /> {pattern.timeComplexityTypical}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              <HardDrive className="w-3 h-3 text-slate-500" /> {pattern.spaceComplexityTypical}
            </span>
          </div>

          <Link
            href={`/practice?pattern=${pattern.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Practice Problems</span>
          </Link>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Pane: Code Synchronizer & State Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
          {/* Synchronized Code Viewer */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Python Execution Synchronizer</span>
              <span className="font-mono text-[11px] text-indigo-400">
                Active Line: {currentEvent ? currentEvent.line : 1}
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed bg-slate-950">
              {codeLines.map((lineText, idx) => {
                const lineNum = idx + 1;
                const isCurrentLine = currentEvent && currentEvent.line === lineNum;

                return (
                  <div
                    key={lineNum}
                    className={`flex items-center gap-3 px-2 py-0.5 rounded transition-all ${
                      isCurrentLine
                        ? 'bg-indigo-950/80 text-indigo-200 border-l-2 border-indigo-400 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[11px] text-slate-600 select-none min-w-[20px] text-right font-mono">
                      {lineNum}
                    </span>
                    <pre className="whitespace-pre font-mono">{lineText || ' '}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* State Inspector at Bottom */}
          <StateInspector currentEvent={currentEvent} />
        </div>

        {/* Right Pane: Custom Sandbox + Visual Canvas + Stepper Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 overflow-hidden">
          {/* Custom Input Sandbox */}
          <CustomInputSandbox
            pattern={pattern}
            onApplyInputs={(newInputs) => {
              setCurrentInputs(newInputs);
            }}
          />

          {/* Interactive Visualizer Canvas */}
          <div className="flex-1 flex items-center justify-center overflow-y-auto p-4 bg-slate-950">
            {currentEvent ? (
              <VisualizerCanvas state={currentEvent.dataStructureState} />
            ) : (
              <div className="text-slate-500 text-xs font-mono">Loading trace state...</div>
            )}
          </div>

          {/* Stepper Timeline Controls at Bottom */}
          <StepperControls />
        </div>
      </div>
    </div>
  );
}
