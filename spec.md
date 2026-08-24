# Technical Specification Document: Python DSA Learning & Practice Platform

**Document Version:** 1.2.0 (Final Architecture & Edge Constraints)  
**Project Identifier:** `learn_dsa` / **AlgoLens (PyDSA)**  
**Status:** Approved for Engineering Implementation  
**Target Audience:** Frontend Engineers, Systems Engineers, UX Engineers, QA  

---

## 1. System Architecture & Routing Structure

### 1.1 Routing Architecture (Next.js App Router)

The application separates conceptual learning from hands-on coding practice into two distinct, high-focus sections:

```
src/app/
├── layout.tsx                # Global layout with Top Navigation (Theme Toggle, Engine Status, Backup)
├── page.tsx                  # Home Dashboard & Pattern Progression Overview
├── learn/                    # [Section 1: The Concept Lab]
│   ├── page.tsx              # Index of all 9 Visual Pattern Modules
│   └── [patternId]/page.tsx  # Interactive Visual Stepper with custom input sandbox & safety bounds
└── practice/                 # [Section 2: The Practice Arena]
    ├── page.tsx              # 45-Problem Catalog (filter by Pattern & Difficulty)
    └── [problemId]/page.tsx  # Monaco Python Editor & Direct Primitive Test Harness
```

### 1.2 High-Level Component Topology

```mermaid
graph TB
    subgraph "Client Layer (Next.js 14+ / React 18+ App Router)"
        UI[Global Navbar: Dark/Light Toggle & Python Status Pill]
        
        subgraph "Section 1: /learn/[patternId] (Visual Concept Lab)"
            InputSandbox[Custom Input Parameter Form with Safety Bounds]
            StepperCtrl[Timeline Playback & Scrub Controller]
            CodeSync[Python Code Line Synchronizer]
            CanvasEngine[Data Structure Visual Canvas: Array/Tree/DP/List]
            StateInspector[Variables & Call Stack Watcher]
        end

        subgraph "Section 2: /practice/[problemId] (Practice Arena)"
            ProblemDesc[Problem Specs, Constraints & Target Complexity]
            Editor[Monaco Python 3 Editor]
            TestRunnerUI[Test Suite Runner: Visible + Hidden Edge Cases]
            HintEngine[4-Tier Progressive Hint Ladder]
        end
        
        Store[Zustand Central Store]
        StorageAdapter[Local Storage & JSON Export / Import Service]
    end

    subgraph "Execution Layer (Isolated Web Worker)"
        WorkerBridge[python.worker.ts RPC Message Protocol]
        PyodideCore[Pyodide WASM Python 3.12 Engine]
        TracerPy[tracer.py: sys.settrace Event Generator]
        TestRunnerPy[test_runner.py: Direct Primitive Test Evaluator & stdout buffer]
    end

    UI --> Store
    InputSandbox --> WorkerBridge
    Editor --> WorkerBridge
    
    WorkerBridge <--> PyodideCore
    PyodideCore --> TracerPy
    PyodideCore --> TestRunnerPy
    
    TracerPy -. TraceEvents .-> WorkerBridge
    TestRunnerPy -. TestResults .-> WorkerBridge
    
    WorkerBridge --> Store
    Store --> CanvasEngine
    Store --> CodeSync
    Store --> StateInspector
    Store --> TestRunnerUI
    Store --> StorageAdapter
```

---

## 2. Core Data Models & Schemas

### 2.1 Trace Event Schema (`TraceEvent`)

```typescript
export type EventType = 
  | 'LINE'           // Line executed
  | 'CALL'           // Function entry
  | 'RETURN'         // Function return
  | 'POINTER_MOVE'   // Specific pointer shifted (e.g. left += 1)
  | 'COMPARE'        // Element comparison (e.g. nums[i] < nums[j])
  | 'SWAP'           // Element swap in array
  | 'VISIT_NODE'     // Tree/Graph node visited
  | 'UPDATE_DP_CELL' // DP Table cell calculation
  | 'PUSH_STACK'     // Stack push
  | 'POP_STACK';     // Stack pop

export interface CallStackFrame {
  functionName: string;
  line: number;
  args: Record<string, any>;
  locals: Record<string, any>;
}

export interface TraceEvent {
  stepIndex: number;
  line: number;                     // 1-indexed source code line number
  eventType: EventType;
  explanation: string;              // Clear human explanation of this step
  codeSnippet?: string;             // Exact code expression evaluated
  variables: Record<string, any>;   // Global/local variable state snapshot
  callStack: CallStackFrame[];      // Current call stack frames
  dataStructureState: DataStructureState; // Specialized state for visual canvas
}

export type DataStructureState =
  | ArrayVisualState
  | LinkedListVisualState
  | TreeVisualState
  | StackQueueVisualState
  | DPGridVisualState
  | GraphVisualState;
```

### 2.2 Specialized Visualizer States & Input Safety Bounds

#### A. Custom Input Safety Constraints
To maintain smooth rendering and clean visual layouts, the Concept Lab enforces strict input bounds:
* **1D Arrays**: Length between $2$ and $12$ elements; integers between $-999$ and $999$.
* **Strings**: Length between $1$ and $16$ characters.
* **DP 2D Grids**: Matrix dimensions up to $6 \times 6$; strings for 2D DP (LCS/Edit Distance) up to $8$ characters.
* **Binary Trees**: Maximum $15$ nodes (depth $\le 4$).

#### B. Array & Pointer State (`ArrayVisualState`)
```typescript
export interface ArrayPointer {
  id: string;               // 'left', 'right', 'slow', 'fast', 'pivot'
  name: string;             // Display label
  index: number;            // Current array index
  color: string;            // Tailwind color token ('blue', 'rose', 'amber', 'emerald')
}

export interface ArrayElement {
  index: number;
  value: number | string;
  state: 'default' | 'active' | 'compared' | 'swapping' | 'sorted' | 'window';
}

export interface SlidingWindowBoundary {
  startIndex: number;
  endIndex: number;
  label?: string;
}

export interface ArrayVisualState {
  type: 'ARRAY';
  elements: ArrayElement[];
  pointers: ArrayPointer[];
  window?: SlidingWindowBoundary;
  highlightIndices?: number[];
  auxiliaryArray?: ArrayElement[];
}
```

#### C. Linked List State (`LinkedListVisualState`)
```typescript
export interface LinkedListNode {
  id: string;
  value: number | string;
  nextId: string | null;
  prevId?: string | null;
  state: 'default' | 'current' | 'visited' | 'modified';
}

export interface LinkedListVisualState {
  type: 'LINKED_LIST';
  nodes: LinkedListNode[];
  pointers: {
    name: string;                  // 'head', 'curr', 'prev', 'fast', 'slow'
    targetNodeId: string | null;
    color: string;
  }[];
}
```

#### D. Binary Tree State (`TreeVisualState`)
```typescript
export interface TreeNode {
  id: string;
  value: number | string;
  leftId: string | null;
  rightId: string | null;
  state: 'unvisited' | 'active' | 'processing' | 'completed' | 'match';
}

export interface TreeVisualState {
  type: 'TREE';
  rootId: string | null;
  nodes: Record<string, TreeNode>;
  currentNodeId: string | null;
  traversalOrder: string[];
}
```

#### E. Dynamic Programming Table State (`DPGridVisualState`)
```typescript
export interface DPCell {
  row: number;
  col: number;
  value: number | string | null;
  state: 'uncomputed' | 'computing' | 'computed' | 'base_case';
  dependsOn?: Array<{ row: number; col: number }>;
}

export interface DPGridVisualState {
  type: 'DP_GRID';
  dimensions: { rows: number; cols: number };
  rowHeaders?: string[];
  colHeaders?: string[];
  grid: DPCell[][];
  activeCell: { row: number; col: number } | null;
  formulaDescription?: string;
}
```

---

## 3. The 45-Problem Curated Curriculum ($9 \times 5$)

The platform ships with exactly **45 high-frequency interview problems** organized across the **9 essential patterns**, with **2 Easy, 2 Medium, and 1 Hard** problem in each pattern:

```typescript
export type ComplexityClass = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n^2)' | 'O(2^n)';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  id: string;
  input: Record<string, any>;       // Standard primitive / array inputs
  expectedOutput: any;              // Standard primitive / array outputs
  isHidden?: boolean;              // Hidden edge case test
  explanation?: string;
}

export interface HintLadderItem {
  level: 1 | 2 | 3 | 4;
  title: string;
  content: string;
}

export interface ProblemDefinition {
  id: string;
  patternId: string;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  timeComplexity: ComplexityClass;
  spaceComplexity: ComplexityClass;
  descriptionMarkdown: string;
  constraints: string[];
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  hints: HintLadderItem[];
}
```

### Complete 45-Problem Distribution Matrix

| Pattern ID & Name | Easy Problem 1 | Easy Problem 2 | Medium Problem 1 | Medium Problem 2 | Hard Problem |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Two Pointers** | Valid Palindrome | Two Sum II (Sorted) | 3Sum | Container With Most Water | Trapping Rain Water |
| **2. Sliding Window** | Maximum Average Subarray I | Defuse the Bomb | Longest Substring Without Repeating Characters | Minimum Size Subarray Sum | Sliding Window Maximum |
| **3. Linked Lists** | Reverse Linked List | Merge Two Sorted Lists | Linked List Cycle II | Remove Nth Node From End | Merge K Sorted Lists |
| **4. Stacks & Queues** | Valid Parentheses | Implement Queue using Stacks | Daily Temperatures | Min Stack | Largest Rectangle in Histogram |
| **5. Trees & BSTs** | Invert Binary Tree | Maximum Depth of Binary Tree | Lowest Common Ancestor of BST | Binary Tree Level Order Traversal | Binary Tree Maximum Path Sum |
| **6. Binary Search** | Binary Search | First Bad Version | Search in Rotated Sorted Array | Find Peak Element | Median of Two Sorted Arrays |
| **7. Graph Traversals** | Flood Fill | Find if Path Exists in Graph | Number of Islands | Clone Graph | Word Ladder |
| **8. Dynamic Programming** | Climbing Stairs | House Robber | Coin Change | Longest Common Subsequence | Edit Distance |
| **9. Backtracking** | Binary Tree Paths | Sum of All Subset XOR Totals | Subsets | Combination Sum | N-Queens |

---

## 4. Python Web Worker & Direct Execution Harness

### 4.1 Pyodide Web Worker Architecture (`python.worker.ts`)
* Worker loads Pyodide 0.26+ via WebAssembly asynchronously from CDN with background initialization.
* Main thread broadcasts engine state (`INITIALIZING` $\rightarrow$ `READY`).
* Watchdog Timer ($5000\text{ms}$) terminates and respawns the worker on runaway loops.

### 4.2 Direct Primitive Test Evaluator (`test_runner.py`)
To maintain architectural simplicity and transparency for learners, the test harness operates directly on Python primitives (lists, integers, strings, dicts) with zero hidden AST magic or complex conversions:

```python
# test_runner.py (Embedded within Pyodide Worker)
import json
import time
import sys
import io

def run_test_suite(user_code_str, entry_function, test_cases_json):
    test_cases = json.loads(test_cases_json)
    results = []
    
    stdout_buffer = io.StringIO()
    sys.stdout = stdout_buffer
    
    globals_dict = {}
    try:
        exec(user_code_str, globals_dict)
        if entry_function not in globals_dict:
            return {
                "success": False,
                "error": f"Function '{entry_function}' was not found in your code.",
                "results": []
            }
        func = globals_dict[entry_function]
    except Exception as e:
        sys.stdout = sys.__stdout__
        return {
            "success": False,
            "error": f"Syntax/Runtime Error: {str(e)}",
            "results": []
        }

    all_passed = True
    for tc in test_cases:
        tc_id = tc["id"]
        tc_inputs = tc["input"]
        expected = tc["expectedOutput"]
        is_hidden = tc.get("isHidden", False)
        
        stdout_buffer.seek(0)
        stdout_buffer.truncate(0)
        
        start_time = time.perf_counter()
        try:
            if isinstance(tc_inputs, dict):
                actual = func(**tc_inputs)
            elif isinstance(tc_inputs, list):
                actual = func(*tc_inputs)
            else:
                actual = func(tc_inputs)
                
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            passed = (actual == expected)
            if not passed:
                all_passed = False
                
            captured_stdout = stdout_buffer.getvalue()
            
            results.append({
                "testCaseId": tc_id,
                "passed": passed,
                "input": tc_inputs if not is_hidden else "[Hidden]",
                "expectedOutput": expected if not is_hidden else "[Hidden]",
                "actualOutput": actual if not is_hidden else ("[Hidden: Failed]" if not passed else "[Hidden: Passed]"),
                "stdout": captured_stdout,
                "executionTimeMs": round(elapsed_ms, 2),
                "isHidden": is_hidden
            })
        except Exception as err:
            all_passed = False
            results.append({
                "testCaseId": tc_id,
                "passed": False,
                "error": str(err),
                "stdout": stdout_buffer.getvalue(),
                "isHidden": is_hidden
            })
            
    sys.stdout = sys.__stdout__
    return {
        "success": True,
        "allPassed": all_passed,
        "results": results
    }
```

---

## 5. Persistence & Data Portability Schema

### 5.1 Local Storage Schema (`dsa_user_data`)
```typescript
export interface UserProgressData {
  version: '1.2.0';
  completedProblemIds: string[];
  bookmarkedProblemIds: string[];
  customDrafts: Record<string, string>;
  settings: {
    theme: 'dark' | 'light';
    playbackSpeed: number;
    editorFontSize: number;
  };
  lastActivePatternId: string;
}
```

### 5.2 1-Click JSON Backup & Restore API
* **Export**: Downloads timestamped `algolens_progress_backup.json`.
* **Import**: Validates schema and restores all code drafts, bookmarks, and solved statuses into LocalStorage / IndexedDB.
