// src/lib/store/useSettingsStore.ts
import { create } from 'zustand';

interface SettingsState {
  theme: 'dark' | 'light';
  editorFontSize: number;
  isEngineReady: boolean;
  engineStatusText: string;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setEditorFontSize: (size: number) => void;
  setEngineStatus: (ready: boolean, text: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  editorFontSize: 14,
  isEngineReady: false,
  engineStatusText: 'Initializing Python Engine...',
  
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('dsa_theme', theme);
    }
    set({ theme });
  },

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('dsa_theme', nextTheme);
      }
      return { theme: nextTheme };
    });
  },

  setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
  setEngineStatus: (isEngineReady, engineStatusText) => set({ isEngineReady, engineStatusText }),
}));
