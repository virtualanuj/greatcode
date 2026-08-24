// src/components/ui/Tabs.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TabItem {
  id: string;
  label: React.ReactNode;
  badge?: number | string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex space-x-1 border-b border-slate-800 p-1 bg-slate-950/40 rounded-t-lg", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              isActive
                ? "bg-slate-800 text-slate-100 shadow-sm border border-slate-700"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-400"
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
