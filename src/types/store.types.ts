// src/types/store.types.ts
import { TraceEvent } from './trace.types';

export interface UserProgressData {
  version: string;
  completedProblemIds: string[];
  bookmarkedProblemIds: string[];
  customDrafts: Record<string, string>; // problemId -> code string
  settings: {
    theme: 'dark' | 'light';
    playbackSpeed: number;
    editorFontSize: number;
  };
  lastActivePatternId: string;
  lastActiveProblemId: string | null;
}

export interface TimelineState {
  events: TraceEvent[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  isLoadingTrace: boolean;
  error: string | null;
  
  // Actions
  setEvents: (events: TraceEvent[]) => void;
  setCurrentStep: (step: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seekTo: (step: number) => void;
  setSpeed: (speed: number) => void;
  setIsLoadingTrace: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
