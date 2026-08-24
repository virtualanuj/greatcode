// src/components/navigation/BackupModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProgressStore } from '@/lib/store/useProgressStore';
import { exportProgressToJson, validateBackupJson } from '@/lib/utils/exportImport';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { getExportData, restoreFromBackup, completedProblemIds } = useProgressStore();
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleExport = () => {
    const data = getExportData();
    exportProgressToJson(data);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = validateBackupJson(content);
      if (result.valid && result.data) {
        restoreFromBackup(result.data);
        setImportStatus({
          success: true,
          message: `Successfully restored ${result.data.completedProblemIds.length} solved problems and custom drafts!`,
        });
      } else {
        setImportStatus({
          success: false,
          message: result.error || 'Invalid backup file format.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Backup & Restore Progress">
      <div className="space-y-6 text-xs text-slate-300">
        <p className="leading-relaxed">
          AlgoLens is 100% offline and local-first. You can download a copy of your solved problems, bookmarked items, and custom Python code drafts at any time, or restore from a previous backup file.
        </p>

        {/* Current Stats */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
          <span className="text-slate-400">Current Solved Count:</span>
          <span className="font-bold text-emerald-400">{completedProblemIds.length} / 45 Problems</span>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-400" /> Export Backup
              </h4>
              <p className="text-[11px] text-slate-400">
                Download a timestamped JSON file with all your progress and drafts.
              </p>
            </div>
            <Button onClick={handleExport} size="sm" variant="primary" className="w-full gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download JSON
            </Button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-400" /> Restore Backup
              </h4>
              <p className="text-[11px] text-slate-400">
                Select a previously exported JSON backup file to restore your progress.
              </p>
            </div>
            <label className="w-full">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 cursor-pointer transition-colors text-center">
                <Upload className="w-3.5 h-3.5" /> Upload Backup JSON
              </span>
            </label>
          </div>
        </div>

        {/* Feedback Alert */}
        {importStatus && (
          <div
            className={`p-3 rounded-lg border flex items-center gap-2 ${
              importStatus.success
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}
          >
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
