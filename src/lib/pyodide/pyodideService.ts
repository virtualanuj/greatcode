// src/lib/pyodide/pyodideService.ts
'use client';
import { TestCase } from '@/types/curriculum.types';
import { TestResultItem } from '@/types/worker.types';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

declare global {
  interface Window {
    loadPyodide?: any;
    pyodideInstance?: any;
  }
}

class PyodideService {
  private pyodide: any = null;
  private isInitializing: boolean = false;
  private initPromise: Promise<any> | null = null;

  public async init(): Promise<any> {
    if (this.pyodide) {
      return this.pyodide;
    }
    if (this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    useSettingsStore.getState().setEngineStatus(false, 'Loading Pyodide WebAssembly...');

    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        if (typeof window === 'undefined') {
          resolve(null);
          return;
        }

        // Dynamically load Pyodide script if not present
        if (!window.loadPyodide) {
          await new Promise<void>((res, rej) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
            script.onload = () => res();
            script.onerror = (err) => rej(new Error('Failed to load Pyodide CDN script.'));
            document.head.appendChild(script);
          });
        }

        useSettingsStore.getState().setEngineStatus(false, 'Compiling Python 3.12 Runtime...');
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
        });

        this.pyodide = pyodide;
        window.pyodideInstance = pyodide;
        useSettingsStore.getState().setEngineStatus(true, 'Python 3.12 Ready');
        resolve(pyodide);
      } catch (err: any) {
        console.error('Pyodide initialization error:', err);
        useSettingsStore.getState().setEngineStatus(false, 'Engine Error: Offline Fallback');
        reject(err);
      } finally {
        this.isInitializing = false;
      }
    });

    return this.initPromise;
  }

  public async runTests(
    code: string,
    entryFunction: string,
    testCases: TestCase[]
  ): Promise<{ success: boolean; allPassed: boolean; results: TestResultItem[]; error?: string }> {
    try {
      const py = await this.init();
      if (!py) {
        throw new Error('Pyodide runtime is not available in SSR.');
      }

      // Python test harness runner
      const testCasesJson = JSON.stringify(testCases);
      const runnerScript = `
import json
import time
import sys
import io

def _execute_harness(user_code, func_name, tc_json_str):
    test_cases = json.loads(tc_json_str)
    results = []
    
    stdout_capture = io.StringIO()
    sys.stdout = stdout_capture
    
    globals_env = {}
    try:
        exec(user_code, globals_env)
        if func_name not in globals_env:
            sys.stdout = sys.__stdout__
            return json.dumps({
                "success": False,
                "error": f"Function '{func_name}' was not defined in your code.",
                "allPassed": False,
                "results": []
            })
        target_fn = globals_env[func_name]
    except Exception as e:
        sys.stdout = sys.__stdout__
        return json.dumps({
            "success": False,
            "error": f"Syntax / Execution Error: {str(e)}",
            "allPassed": False,
            "results": []
        })

    all_passed = True
    for tc in test_cases:
        tc_id = tc.get("id", "")
        tc_input = tc.get("input", {})
        expected = tc.get("expectedOutput")
        is_hidden = tc.get("isHidden", False)
        
        stdout_capture.seek(0)
        stdout_capture.truncate(0)
        
        start_t = time.perf_counter()
        try:
            if isinstance(tc_input, dict):
                actual = target_fn(**tc_input)
            elif isinstance(tc_input, list):
                actual = target_fn(*tc_input)
            else:
                actual = target_fn(tc_input)
                
            elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
            passed = (actual == expected)
            if not passed:
                all_passed = False
                
            results.append({
                "testCaseId": tc_id,
                "passed": passed,
                "input": tc_input if not is_hidden else "[Hidden Test Case]",
                "expectedOutput": expected if not is_hidden else "[Hidden]",
                "actualOutput": actual if not is_hidden else ("[Hidden: Failed]" if not passed else "[Hidden: Passed]"),
                "stdout": stdout_capture.getvalue(),
                "executionTimeMs": elapsed_ms,
                "isHidden": is_hidden
            })
        except Exception as err:
            all_passed = False
            results.append({
                "testCaseId": tc_id,
                "passed": False,
                "input": tc_input if not is_hidden else "[Hidden Test Case]",
                "expectedOutput": expected if not is_hidden else "[Hidden]",
                "actualOutput": None,
                "error": str(err),
                "stdout": stdout_capture.getvalue(),
                "executionTimeMs": 0,
                "isHidden": is_hidden
            })
            
    sys.stdout = sys.__stdout__
    return json.dumps({
        "success": True,
        "allPassed": all_passed,
        "results": results
    })
`;

      await py.runPythonAsync(runnerScript);
      const harnessFn = py.globals.get('_execute_harness');
      const rawResult = await harnessFn(code, entryFunction, testCasesJson);
      return JSON.parse(rawResult);
    } catch (err: any) {
      return {
        success: false,
        allPassed: false,
        results: [],
        error: err.message || 'Execution error during test run.',
      };
    }
  }
}

export const pyodideService = new PyodideService();
