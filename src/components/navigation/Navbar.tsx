// src/components/navigation/Navbar.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Database, BookOpen, Code2, Sparkles, Terminal } from 'lucide-react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useProgressStore } from '@/lib/store/useProgressStore';
import { BackupModal } from './BackupModal';
import { pyodideService } from '@/lib/pyodide/pyodideService';
import { cn } from '@/lib/utils/cn';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme, isEngineReady, engineStatusText } = useSettingsStore();
  const { completedProblemIds, loadFromStorage } = useProgressStore();
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  useEffect(() => {
    // Load local storage progress
    loadFromStorage();
    // Warm up Pyodide in background
    pyodideService.init().catch(() => {});
  }, [loadFromStorage]);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Sparkles },
    { href: '/learn', label: 'Concept Lab', icon: BookOpen },
    { href: '/practice', label: 'Practice Arena', icon: Code2 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
                  AlgoLens <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-normal">PyDSA</span>
                </span>
              </div>
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Python Engine Pill, Theme, Backup */}
          <div className="flex items-center gap-2.5">
            {/* Engine Status Pill */}
            <div
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border',
                isEngineReady
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 animate-pulse'
              )}
              title={engineStatusText}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isEngineReady ? 'bg-emerald-400' : 'bg-amber-400'
                )}
              />
              <span className="truncate max-w-[150px]">{engineStatusText}</span>
            </div>

            {/* Solved Progress Counter */}
            <div className="text-[11px] font-mono text-slate-400 px-2 py-1 rounded bg-slate-900 border border-slate-800 hidden lg:block">
              Solved: <span className="text-emerald-400 font-bold">{completedProblemIds.length}</span>/45
            </div>

            {/* Backup & Restore Modal Trigger */}
            <button
              onClick={() => setIsBackupOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
              title="Backup & Restore Progress (JSON)"
              aria-label="Backup and restore"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
              title="Toggle Dark / Light Theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Backup Modal */}
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </>
  );
};
