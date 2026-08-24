// src/lib/store/useTimelineStore.ts
import { create } from 'zustand';
import { TimelineState } from '@/types/store.types';
import { TraceEvent } from '@/types/trace.types';

export const useTimelineStore = create<TimelineState>((set, get) => ({
  events: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1.0,
  isLoadingTrace: false,
  error: null,

  setEvents: (events: TraceEvent[]) => {
    set({
      events,
      currentStep: 0,
      isPlaying: false,
      error: null,
    });
  },

  setCurrentStep: (step: number) => {
    const total = get().events.length;
    const bounded = Math.max(0, Math.min(step, total > 0 ? total - 1 : 0));
    set({ currentStep: bounded });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  stepForward: () => {
    const { currentStep, events } = get();
    if (currentStep < events.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  stepBackward: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  seekTo: (step: number) => {
    const total = get().events.length;
    const bounded = Math.max(0, Math.min(step, total > 0 ? total - 1 : 0));
    set({ currentStep: bounded });
  },

  setSpeed: (speed: number) => set({ speed }),
  setIsLoadingTrace: (isLoadingTrace: boolean) => set({ isLoadingTrace }),
  setError: (error: string | null) => set({ error }),

  reset: () => {
    set({
      currentStep: 0,
      isPlaying: false,
    });
  },
}));
