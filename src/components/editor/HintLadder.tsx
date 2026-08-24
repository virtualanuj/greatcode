// src/components/editor/HintLadder.tsx
'use client';
import React, { useState } from 'react';
import { HintLadderItem } from '@/types/curriculum.types';
import { Lightbulb, ChevronDown, ChevronRight, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface HintLadderProps {
  hints: HintLadderItem[];
}

export const HintLadder: React.FC<HintLadderProps> = ({ hints }) => {
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [expandedTiers, setExpandedTiers] = useState<Record<number, boolean>>({ 1: true });

  const toggleTier = (level: number) => {
    if (level <= unlockedLevel) {
      setExpandedTiers((prev) => ({ ...prev, [level]: !prev[level] }));
    }
  };

  const unlockNext = () => {
    if (unlockedLevel < hints.length) {
      const next = unlockedLevel + 1;
      setUnlockedLevel(next);
      setExpandedTiers((prev) => ({ ...prev, [next]: true }));
    }
  };

  return (
    <div className="w-full space-y-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <Lightbulb className="w-4 h-4 fill-amber-400/20" />
          <span>Progressive Hint Ladder</span>
        </div>
        {unlockedLevel < hints.length && (
          <button
            onClick={unlockNext}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <Unlock className="w-3 h-3" /> Unlock Hint {unlockedLevel + 1}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {hints.map((hint) => {
          const isUnlocked = hint.level <= unlockedLevel;
          const isExpanded = expandedTiers[hint.level];

          return (
            <div
              key={hint.level}
              className={cn(
                'rounded-lg border transition-all overflow-hidden',
                isUnlocked
                  ? 'bg-slate-950/70 border-slate-700'
                  : 'bg-slate-950/30 border-slate-800 opacity-60'
              )}
            >
              <button
                onClick={() => toggleTier(hint.level)}
                disabled={!isUnlocked}
                className="w-full p-2.5 flex items-center justify-between text-left text-xs font-medium text-slate-200 hover:bg-slate-900/50"
              >
                <div className="flex items-center gap-2">
                  {isUnlocked ? (
                    isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>
                    Level {hint.level}: {hint.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </button>

              {isUnlocked && isExpanded && (
                <div className="p-3 pt-0 border-t border-slate-800/50 text-xs text-slate-300 leading-relaxed font-sans mt-2">
                  {hint.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
