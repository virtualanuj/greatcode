// src/components/navigation/AuthModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Github, Sparkles, CheckCircle, Shield, Laptop } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGitHub, isLoading } = useAuthStore();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGithubSignIn = async () => {
    setIsSigningIn(true);
    await signInWithGitHub();
    setIsSigningIn(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign in to AlgoLens">
      <div className="space-y-6 text-xs text-slate-300">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Multi-Device Cloud Synchronization</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Sign in with your GitHub account to automatically sync your solved problems, bookmarked algorithms, and custom Python solutions across your laptop, desktop, and mobile devices.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-device sync</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-loss local merge</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Laptop className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resume anywhere</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Row-Level Security</span>
            </div>
          </div>
        </div>

        {/* Action Button: Sign In with GitHub */}
        <div className="space-y-3">
          <button
            onClick={handleGithubSignIn}
            disabled={isSigningIn || isLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs transition-all shadow-md hover:shadow-slate-100/10 active:scale-[0.99] disabled:opacity-50"
          >
            <Github className="w-4 h-4" />
            <span>{isSigningIn ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
          </button>

          {!isSupabaseConfigured && (
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300">
              ⚠️ <strong>Supabase credentials not configured in `.env.local` yet</strong>. You can continue practicing in <strong>Guest Mode</strong> without any interruption!
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline transition-colors"
            >
              Stay in Guest Mode (Offline / Local-First)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
