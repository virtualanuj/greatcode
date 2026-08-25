// src/lib/store/useProgressStore.ts
import { create } from 'zustand';
import { UserProgressData } from '@/types/store.types';
import { syncService } from '@/lib/sync/syncService';
import { useAuthStore } from '@/lib/store/useAuthStore';

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
  syncWithCloud: (userId: string) => Promise<void>;
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

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get().getExportData(), completedProblemIds: next }));
      }

      // Cloud background sync if authenticated
      const user = useAuthStore.getState().user;
      if (user) {
        syncService.queueProgressSync(user.id, {
          ...get().getExportData(),
          completedProblemIds: next,
        });
      }

      return { completedProblemIds: next };
    });
  },

  markProblemCompleted: (problemId: string) => {
    set((state) => {
      if (state.completedProblemIds.includes(problemId)) return state;
      const next = [...state.completedProblemIds, problemId];

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get().getExportData(), completedProblemIds: next }));
      }

      // Cloud background sync if authenticated
      const user = useAuthStore.getState().user;
      if (user) {
        syncService.queueProgressSync(user.id, {
          ...get().getExportData(),
          completedProblemIds: next,
        });
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get().getExportData(), bookmarkedProblemIds: next }));
      }

      // Cloud background sync if authenticated
      const user = useAuthStore.getState().user;
      if (user) {
        syncService.queueProgressSync(user.id, {
          ...get().getExportData(),
          bookmarkedProblemIds: next,
        });
      }

      return { bookmarkedProblemIds: next };
    });
  },

  saveCodeDraft: (problemId: string, code: string) => {
    set((state) => {
      const nextDrafts = { ...state.customDrafts, [problemId]: code };

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...get().getExportData(), customDrafts: nextDrafts })
        );
      }

      // Cloud background sync for code drafts if authenticated
      const user = useAuthStore.getState().user;
      if (user) {
        syncService.queueDraftSync(user.id, problemId, code);
      }

      return { customDrafts: nextDrafts };
    });
  },

  getCodeDraft: (problemId: string, fallback: string) => {
    return get().customDrafts[problemId] || fallback;
  },

  setLastActive: (patternId: string, problemId?: string) => {
    const nextProblemId = problemId || get().lastActiveProblemId;
    set({
      lastActivePatternId: patternId,
      lastActiveProblemId: nextProblemId,
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
        customDrafts: parsed.customDrafts || parsed.codeDrafts || {},
        lastActivePatternId: parsed.lastActivePatternId || 'two-pointers',
        lastActiveProblemId: parsed.lastActiveProblemId || 'two-sum-ii',
      });
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
  },

  syncWithCloud: async (userId: string) => {
    const localData = get().getExportData();
    const merged = await syncService.syncOnLogin(userId, localData);
    set({
      completedProblemIds: merged.completedProblemIds,
      bookmarkedProblemIds: merged.bookmarkedProblemIds,
      customDrafts: merged.codeDrafts || {},
      lastActivePatternId: merged.lastActivePatternId || 'two-pointers',
      lastActiveProblemId: merged.lastActiveProblemId || 'two-sum-ii',
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().getExportData()));
    }
  },

  restoreFromBackup: (data: UserProgressData) => {
    const drafts = data.customDrafts || data.codeDrafts || {};
    set({
      completedProblemIds: data.completedProblemIds || [],
      bookmarkedProblemIds: data.bookmarkedProblemIds || [],
      customDrafts: drafts,
      lastActivePatternId: data.lastActivePatternId || 'two-pointers',
      lastActiveProblemId: data.lastActiveProblemId || null,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    const user = useAuthStore.getState().user;
    if (user) {
      syncService.queueProgressSync(user.id, data);
    }
  },

  getExportData: (): UserProgressData => {
    const s = get();
    return {
      version: '1.2.0',
      completedProblemIds: s.completedProblemIds,
      bookmarkedProblemIds: s.bookmarkedProblemIds,
      customDrafts: s.customDrafts,
      codeDrafts: s.customDrafts,
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
