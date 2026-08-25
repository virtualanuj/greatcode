// src/components/navigation/Navbar.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  Database,
  BookOpen,
  Code2,
  Sparkles,
  Terminal,
  User as UserIcon,
  Github,
  LogOut,
  Cloud,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useProgressStore } from '@/lib/store/useProgressStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { BackupModal } from './BackupModal';
import { AuthModal } from './AuthModal';
import { pyodideService } from '@/lib/pyodide/pyodideService';
import { cn } from '@/lib/utils/cn';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { theme, toggleTheme, isEngineReady, engineStatusText } = useSettingsStore();
  const { completedProblemIds, loadFromStorage, syncWithCloud } = useProgressStore();
  const { user, isGuest, syncStatus, initAuth, signOut } = useAuthStore();

  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load local storage progress
    loadFromStorage();
    // Warm up Pyodide in background
    pyodideService.init().catch(() => {});
    // Initialize Supabase Auth state
    initAuth();
  }, [loadFromStorage, initAuth]);

  // When user signs in, trigger cloud sync & merge
  useEffect(() => {
    if (user) {
      syncWithCloud(user.id).catch(() => {});
    }
  }, [user, syncWithCloud]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Sparkles },
    { href: '/learn', label: 'Concept Lab', icon: BookOpen },
    { href: '/practice', label: 'Practice Arena', icon: Code2 },
  ];

  const userAvatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;
  const userName =
    user?.user_metadata?.user_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'GitHub User';

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

          {/* Right Controls: Python Engine, Sync Pill, Auth, Theme, Backup */}
          <div className="flex items-center gap-2.5">
            {/* Python WASM Engine Status Pill */}
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
              <span className="truncate max-w-[140px]">{engineStatusText}</span>
            </div>

            {/* Sync / Auth Status Pill */}
            {isGuest ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-slate-900 border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800 transition-colors"
                title="Click to sign in with GitHub and sync across devices"
              >
                <UserIcon className="w-3 h-3 text-slate-400" />
                <span className="hidden sm:inline">Guest Mode</span>
                <span className="sm:hidden">Guest</span>
              </button>
            ) : (
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border',
                  syncStatus === 'syncing'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                    : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                )}
                title="Multi-device cloud synchronization active"
              >
                {syncStatus === 'syncing' ? (
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                ) : (
                  <Cloud className="w-3 h-3 text-indigo-400" />
                )}
                <span className="hidden sm:inline">
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Cloud Synced'}
                </span>
              </div>
            )}

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

            {/* User Profile / Sign In Dropdown */}
            {isGuest ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/20 transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 pl-1.5 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-6 h-6 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400 mr-1" />
                </button>

                {/* Profile Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50 text-xs text-slate-200">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <div className="font-semibold text-slate-100 truncate">{userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Cloud className="w-3 h-3 text-emerald-400" />
                        <span>Cloud Sync Active</span>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 text-[11px] text-slate-400 font-mono">
                      Solved: <span className="text-emerald-400 font-bold">{completedProblemIds.length}</span>/45
                    </div>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backup Modal */}
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />

      {/* GitHub Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
