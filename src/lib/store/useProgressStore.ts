// src/lib/store/useProgressStore.ts
import { create } from 'zustand';
import { UserProgressData } from '@/types/store.types';

interface ProgressState {
  completedProblemIds: string[];
  bookmarkedProblemIds: string[];
  customDrafts: Record<string, string>;
  lastActivePatternId: string;
  lastActiveProblemId: string | null;
  
  // Actions
  toggleProblemCompleted: (problemId: string) => void;
  markProblemCompleted: (problemId: string) => void;
  toggleProblemBookmarked: (problemId: string) => void;
  saveCodeDraft: (problemId: string, code: string) => void;
  getCodeDraft: (problemId: string, fallback: string) => string;
  setLastActive: (patternId: string, problemId?: string) => void;
  loadFromStorage: () => void;
  restoreFromBackup: (data: UserProgressData) => void;
  getExportData: () => UserProgressData;
}

const STORAGE_KEY = 'dsa_progress_v1';

export const useProgressStore = create<ProgressState>((set, get) => ({
  completedProblemIds: [],
  bookmarkedProblemIds: [],
  customDrafts: {},
  lastActivePatternId: 'two-pointers',
  lastActiveProblemId: 'two-sum-ii',

  toggleProblemCompleted: (problemId: string) => {
    set((state) => {
      const exists = state.completedProblemIds.includes(problemId);
      const next = exists
        ? state.completedProblemIds.filter((id) => id !== problemId)
        : [...state.completedProblemIds, problemId];
      
      const updated = { ...state, completedProblemIds: next };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(get().getExportData()));
      }
      return { completedProblemIds: next };
    });
  },

  markProblemCompleted: (problemId: string) => {
    set((state) => {
      if (state.completedProblemIds.includes(problemId)) return state;
      const next = [...state.completedProblemIds, problemId];
      const updated = { ...state, completedProblemIds: next };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(get().getExportData()));
      }
      return { completedProblemIds: next };
    });
  },

  toggleProblemBookmarked: (problemId: string) => {
    set((state) => {
      const exists = state.bookmarkedProblemIds.includes(problemId);
      const next = exists
        ? state.bookmarkedProblemIds.filter((id) => id !== problemId)
        : [...state.bookmarkedProblemIds, problemId];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(get().getExportData()));
      }
      return { bookmarkedProblemIds: next };
    });
  },

  saveCodeDraft: (problemId: string, code: string) => {
    set((state) => {
      const nextDrafts = { ...state.customDrafts, [problemId]: code };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get().getExportData(), customDrafts: nextDrafts }));
      }
      return { customDrafts: nextDrafts };
    });
  },

  getCodeDraft: (problemId: string, fallback: string) => {
    return get().customDrafts[problemId] || fallback;
  },

  setLastActive: (patternId: string, problemId?: string) => {
    set({
      lastActivePatternId: patternId,
      lastActiveProblemId: problemId || get().lastActiveProblemId,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().getExportData()));
    }
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({
        completedProblemIds: parsed.completedProblemIds || [],
        bookmarkedProblemIds: parsed.bookmarkedProblemIds || [],
        customDrafts: parsed.customDrafts || {},
        lastActivePatternId: parsed.lastActivePatternId || 'two-pointers',
        lastActiveProblemId: parsed.lastActiveProblemId || 'two-sum-ii',
      });
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
  },

  restoreFromBackup: (data: UserProgressData) => {
    set({
      completedProblemIds: data.completedProblemIds || [],
      bookmarkedProblemIds: data.bookmarkedProblemIds || [],
      customDrafts: data.customDrafts || {},
      lastActivePatternId: data.lastActivePatternId || 'two-pointers',
      lastActiveProblemId: data.lastActiveProblemId || null,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  getExportData: (): UserProgressData => {
    const s = get();
    return {
      version: '1.2.0',
      completedProblemIds: s.completedProblemIds,
      bookmarkedProblemIds: s.bookmarkedProblemIds,
      customDrafts: s.customDrafts,
      settings: {
        theme: 'dark',
        playbackSpeed: 1.0,
        editorFontSize: 14,
      },
      lastActivePatternId: s.lastActivePatternId,
      lastActiveProblemId: s.lastActiveProblemId,
    };
  },
}));
