// src/types/worker.types.ts
import { TestCase } from './curriculum.types';
import { TraceEvent } from './trace.types';

export interface TestResultItem {
  testCaseId: string;
  passed: boolean;
  input: any;
  expectedOutput: any;
  actualOutput: any;
  stdout: string;
  executionTimeMs?: number;
  isHidden?: boolean;
  error?: string;
}

export type WorkerRequest =
  | { type: 'INIT_PYODIDE' }
  | { 
      type: 'RUN_TESTS'; 
      payload: { 
        code: string; 
        entryFunction: string; 
        testCases: TestCase[];
      } 
    }
  | { 
      type: 'GENERATE_TRACE'; 
      payload: { 
        patternId: string;
        customInputs: Record<string, any>;
      } 
    };

export type WorkerResponse =
  | { type: 'PYODIDE_READY' }
  | { type: 'INIT_ERROR'; error: string }
  | { 
      type: 'TESTS_COMPLETED'; 
      payload: { 
        success: boolean; 
        allPassed: boolean; 
        results: TestResultItem[]; 
        error?: string;
      } 
    }
  | { 
      type: 'TRACE_COMPLETED'; 
      payload: { 
        events: TraceEvent[]; 
        result: any;
      } 
    }
  | { type: 'EXECUTION_TIMEOUT' }
  | { type: 'EXECUTION_ERROR'; error: string };
