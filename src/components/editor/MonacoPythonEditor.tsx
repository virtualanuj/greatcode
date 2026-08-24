// src/components/editor/MonacoPythonEditor.tsx
'use client';
import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

interface MonacoPythonEditorProps {
  code: string;
  onChange: (value: string) => void;
  highlightLine?: number;
  readOnly?: boolean;
}

export const MonacoPythonEditor: React.FC<MonacoPythonEditorProps> = ({
  code,
  onChange,
  highlightLine,
  readOnly = false,
}) => {
  const { theme, editorFontSize } = useSettingsStore();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Custom python syntax configuration if needed
  };

  return (
    <div className="w-full h-full min-h-[300px] overflow-hidden bg-slate-950">
      <Editor
        height="100%"
        language="python"
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={code}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          fontSize: editorFontSize,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: 'on',
          tabSize: 4,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          fontLigatures: true,
          padding: { top: 12, bottom: 12 },
          lineDecorationsWidth: 10,
        }}
      />
    </div>
  );
};
