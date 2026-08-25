// src/lib/sync/syncService.ts
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserProgressData } from '@/types/store.types';
import { useAuthStore } from '@/lib/store/useAuthStore';

class SyncService {
  private debounceTimer: NodeJS.Timeout | null = null;
  private draftTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * On login: Reconciles local guest storage with remote Supabase records
   * using a union-based zero-data-loss merge strategy.
   */
  async syncOnLogin(
    userId: string,
    localData: UserProgressData
  ): Promise<UserProgressData> {
    if (!isSupabaseConfigured || !supabase) {
      return localData;
    }

    useAuthStore.getState().setSyncStatus('syncing');

    try {
      // 1. Fetch Cloud Progress Record
      const { data: cloudProgress, error: progressErr } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (progressErr) {
        console.warn('Error fetching cloud progress:', progressErr.message);
      }

      // 2. Fetch Cloud Code Drafts
      const { data: cloudDrafts, error: draftsErr } = await supabase
        .from('user_code_drafts')
        .select('problem_id, code')
        .eq('user_id', userId);

      if (draftsErr) {
        console.warn('Error fetching cloud drafts:', draftsErr.message);
      }

      const cloudCompleted: string[] = cloudProgress?.completed_problem_ids || [];
      const cloudBookmarks: string[] = cloudProgress?.bookmarked_problem_ids || [];

      const cloudDraftMap: Record<string, string> = {};
      if (cloudDrafts) {
        cloudDrafts.forEach((d) => {
          cloudDraftMap[d.problem_id] = d.code;
        });
      }

      // 3. Perform Union Merge
      const mergedCompleted = Array.from(
        new Set([...localData.completedProblemIds, ...cloudCompleted])
      );
      const mergedBookmarks = Array.from(
        new Set([...localData.bookmarkedProblemIds, ...cloudBookmarks])
      );
      const mergedDrafts = {
        ...cloudDraftMap,
        ...(localData.customDrafts || localData.codeDrafts || {}),
      };

      const mergedLastPattern =
        localData.lastActivePatternId || cloudProgress?.last_active_pattern_id || 'two-pointers';
      const mergedLastProblem =
        localData.lastActiveProblemId || cloudProgress?.last_active_problem_id || 'two-sum-ii';

      const mergedData: UserProgressData = {
        version: '1.2.0',
        completedProblemIds: mergedCompleted,
        bookmarkedProblemIds: mergedBookmarks,
        customDrafts: mergedDrafts,
        codeDrafts: mergedDrafts,
        settings: localData.settings || {
          theme: 'dark',
          playbackSpeed: 1.0,
          editorFontSize: 14,
        },
        lastActivePatternId: mergedLastPattern,
        lastActiveProblemId: mergedLastProblem,
      };

      // 4. Save Merged State Back to Supabase
      await supabase.from('user_progress').upsert(
        {
          user_id: userId,
          completed_problem_ids: mergedCompleted,
          bookmarked_problem_ids: mergedBookmarks,
          last_active_pattern_id: mergedLastPattern,
          last_active_problem_id: mergedLastProblem,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      // 5. Upload Any Local Code Drafts Not Yet in Cloud
      const draftUpserts = Object.entries(mergedDrafts).map(([probId, code]) => ({
        user_id: userId,
        problem_id: probId,
        code,
        updated_at: new Date().toISOString(),
      }));

      if (draftUpserts.length > 0) {
        await supabase
          .from('user_code_drafts')
          .upsert(draftUpserts, { onConflict: 'user_id,problem_id' });
      }

      useAuthStore.getState().setSyncStatus('synced');
      return mergedData;
    } catch (err: any) {
      console.error('Error during login sync:', err);
      useAuthStore.getState().setSyncStatus('error');
      return localData;
    }
  }

  /**
   * Debounced background push when problems are solved or bookmarked
   */
  queueProgressSync(userId: string, data: UserProgressData) {
    if (!isSupabaseConfigured || !supabase || !userId) return;

    useAuthStore.getState().setSyncStatus('syncing');

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      try {
        await supabase!.from('user_progress').upsert(
          {
            user_id: userId,
            completed_problem_ids: data.completedProblemIds,
            bookmarked_problem_ids: data.bookmarkedProblemIds,
            last_active_pattern_id: data.lastActivePatternId,
            last_active_problem_id: data.lastActiveProblemId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
        useAuthStore.getState().setSyncStatus('synced');
      } catch (err) {
        console.warn('Failed to sync progress to cloud:', err);
        useAuthStore.getState().setSyncStatus('error');
      }
    }, 600);
  }

  /**
   * Debounced background push when user modifies code in Monaco Editor
   */
  queueDraftSync(userId: string, problemId: string, code: string) {
    if (!isSupabaseConfigured || !supabase || !userId) return;

    useAuthStore.getState().setSyncStatus('syncing');

    const existingTimer = this.draftTimers.get(problemId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(async () => {
      try {
        await supabase!.from('user_code_drafts').upsert(
          {
            user_id: userId,
            problem_id: problemId,
            code,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,problem_id' }
        );
        this.draftTimers.delete(problemId);
        useAuthStore.getState().setSyncStatus('synced');
      } catch (err) {
        console.warn(`Failed to sync code draft for ${problemId}:`, err);
        useAuthStore.getState().setSyncStatus('error');
      }
    }, 1000);

    this.draftTimers.set(problemId, timer);
  }
}

export const syncService = new SyncService();
