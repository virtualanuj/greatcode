// src/components/visualizer/CustomInputSandbox.tsx
'use client';
import React, { useState } from 'react';
import { PatternDefinition } from '@/types/curriculum.types';
import { Button } from '@/components/ui/Button';
import { Play } from 'lucide-react';

interface CustomInputSandboxProps {
  pattern: PatternDefinition;
  onApplyInputs: (inputs: Record<string, any>) => void;
}

export const CustomInputSandbox: React.FC<CustomInputSandboxProps> = ({
  pattern,
  onApplyInputs,
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>(pattern.visualizerDefaultInputs);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (key: string, type: string, rawVal: string) => {
    setError(null);
    if (type === 'array_number') {
      try {
        const parsed = rawVal
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .map(Number);
        if (parsed.some(isNaN)) {
          setError('Array must contain valid numbers separated by commas.');
        } else if (parsed.length > 12) {
          setError('Array length restricted to max 12 items for visual clarity.');
        }
        setInputs((prev) => ({ ...prev, [key]: parsed }));
      } catch {
        setError('Invalid array input.');
      }
    } else if (type === 'number') {
      const num = Number(rawVal);
      setInputs((prev) => ({ ...prev, [key]: num }));
    } else {
      setInputs((prev) => ({ ...prev, [key]: rawVal }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!error) {
      onApplyInputs(inputs);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center gap-3 text-xs"
    >
      <span className="font-semibold text-slate-300 mr-1">Custom Input:</span>
      {pattern.visualizerInputSchema.fields.map((field) => {
        const val = inputs[field.key];
        const displayVal = Array.isArray(val) ? val.join(', ') : val ?? '';

        return (
          <div key={field.key} className="flex items-center gap-2">
            <label className="text-slate-400 font-mono text-[11px]">{field.label}:</label>
            <input
              type="text"
              value={displayVal}
              onChange={(e) => handleFieldChange(field.key, field.type, e.target.value)}
              placeholder={field.placeholder}
              className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[130px]"
            />
          </div>
        );
      })}

      <Button type="submit" size="sm" variant="secondary" className="gap-1 ml-auto">
        <Play className="w-3 h-3 fill-current text-indigo-400" /> Re-run Visualizer
      </Button>

      {error && <div className="w-full text-rose-400 text-[11px] font-medium">{error}</div>}
    </form>
  );
};
