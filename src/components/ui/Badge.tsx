// src/components/ui/Badge.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'easy' | 'medium' | 'hard' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center font-medium rounded-md tracking-wide';
  
  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
    rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/40',
    outline: 'border border-slate-700 text-slate-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
