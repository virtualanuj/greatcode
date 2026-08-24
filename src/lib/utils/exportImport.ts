// src/lib/utils/exportImport.ts
import { UserProgressData } from '@/types/store.types';

export function exportProgressToJson(data: UserProgressData): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute("download", `algolens_progress_backup_${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function validateBackupJson(jsonString: string): { valid: boolean; data?: UserProgressData; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: "Invalid JSON format." };
    }
    if (!Array.isArray(parsed.completedProblemIds) || !Array.isArray(parsed.bookmarkedProblemIds)) {
      return { valid: false, error: "Missing completed or bookmarked problem arrays." };
    }
    if (!parsed.customDrafts || typeof parsed.customDrafts !== 'object') {
      return { valid: false, error: "Missing custom drafts object." };
    }
    return { valid: true, data: parsed as UserProgressData };
  } catch (err: any) {
    return { valid: false, error: err.message || "Failed to parse JSON." };
  }
}
