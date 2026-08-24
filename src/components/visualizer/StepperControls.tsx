// src/components/visualizer/StepperControls.tsx
'use client';
import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { useTimelineStore } from '@/lib/store/useTimelineStore';
import { cn } from '@/lib/utils/cn';

export const StepperControls: React.FC = () => {
  const {
    events,
    currentStep,
    isPlaying,
    speed,
    togglePlay,
    stepForward,
    stepBackward,
    seekTo,
    setSpeed,
    reset,
  } = useTimelineStore();

  const totalSteps = events.length;

  // Auto-step timer when playing
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      const intervalMs = Math.round(1000 / speed);
      timer = setInterval(() => {
        const state = useTimelineStore.getState();
        if (state.currentStep < state.events.length - 1) {
          state.stepForward();
        } else {
          state.pause();
        }
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speed]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or editor
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, stepForward, stepBackward]);

  return (
    <div className="w-full bg-slate-900/90 border-t border-slate-800 p-4 flex flex-col gap-3 select-none">
      {/* Timeline Scrub Slider */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-xs font-mono text-slate-400 min-w-[55px]">
          Step {totalSteps > 0 ? currentStep + 1 : 0} / {totalSteps}
        </span>
        <input
          type="range"
          min={0}
          max={totalSteps > 0 ? totalSteps - 1 : 0}
          value={currentStep}
          onChange={(e) => seekTo(Number(e.target.value))}
          disabled={totalSteps <= 1}
          className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={reset}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Reset to beginning (Step 0)"
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back */}
          <button
            onClick={stepBackward}
            disabled={currentStep === 0}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Step backward (Left Arrow)"
            aria-label="Step backward"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            disabled={totalSteps <= 1}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-sm shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
            title="Play / Pause (Space)"
            aria-label="Play or pause"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Play
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={stepForward}
            disabled={currentStep >= totalSteps - 1}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Step forward (Right Arrow)"
            aria-label="Step forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {[0.5, 1.0, 1.5, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                'px-2 py-1 rounded font-mono text-[11px] transition-colors',
                speed === s
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
