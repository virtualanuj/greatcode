# Engineering & Design Standards Guide: AlgoLens (PyDSA)

**Document Version:** 1.0.0  
**Target Audience:** Software Engineers, Frontend Specialists, QA Engineers, and AI Coding Agents  
**Project Identifier:** `learn_dsa` / **AlgoLens (PyDSA)**  
**References:** [intent.md](file:///Users/anuj/workspace/learn_dsa/intent.md) | [spec.md](file:///Users/anuj/workspace/learn_dsa/spec.md) | [plan.md](file:///Users/anuj/workspace/learn_dsa/plan.md)  

---

## 1. Core Principles & Philosophy

1. **Intuition First**: Every visual element must reduce cognitive load and clarify abstract algorithmic mechanics (e.g., pointer movement, array swaps, recursion stacks, DP transitions).
2. **Zero-Friction Practice**: The coding arena must be instant, responsive, and distraction-free—running native Python 3 directly in the browser with zero backend latency.
3. **Strict Type Safety & Immutability**: All data models, trace events, and worker RPC protocols must be strictly typed without ambiguous `any` types.
4. **Defensive Sandbox Architecture**: User code execution must be isolated in Web Workers with watchdog timers to guarantee the UI thread never freezes.

---

## 2. UI/UX Design Standards

### 2.1 Theme & Color Palette Tokens

The UI uses a developer-focused, high-contrast palette with **Dark Mode as the default experience**.

| Token Role | Dark Theme (Default) | Light Theme | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-slate-950` / `bg-zinc-900` | `bg-slate-50` / `bg-white` | Visualizer canvas & main workspace |
| **Surface / Card** | `bg-slate-900` / `bg-zinc-800` | `bg-white` / `bg-slate-100` | Panels, cards, modal sheets |
| **Borders & Dividers** | `border-slate-800` / `border-zinc-700` | `border-slate-200` | Resizable panel splits, cell outlines |
| **Primary Accent** | `indigo-500` / `indigo-400` | `indigo-600` | Primary CTA, active navigation, active step |
| **Success / Passed** | `emerald-500` / `emerald-400` | `emerald-600` | Passing tests, sorted array elements |
| **Warning / Active** | `amber-500` / `amber-400` | `amber-600` | Active calculating DP cells, current pointer |
| **Error / Failed** | `rose-500` / `rose-400` | `rose-600` | Failing tests, runtime errors, invalid input |

### 2.2 Data Structure Visual Semantics

To prevent visual confusion, maintain consistent color semantics across all visualizers:

| Data Structure Element | Visual Styling & Semantics | Color / Badge Token |
| :--- | :--- | :--- |
| **`left` / `slow` Pointer** | Blue badge with downward arrow indicator | `bg-blue-500/20 text-blue-400 border-blue-500` |
| **`right` / `fast` Pointer** | Rose badge with downward arrow indicator | `bg-rose-500/20 text-rose-400 border-rose-500` |
| **`pivot` / `mid` Pointer** | Amber badge with upward arrow indicator | `bg-amber-500/20 text-amber-400 border-amber-500` |
| **Sliding Window $[L, R]$** | Semi-transparent highlight bounding box | `bg-indigo-500/15 border-2 border-indigo-400/50` |
| **Array Element (Default)** | Neutral bordered card with index label on top | `bg-slate-800 border-slate-700 text-slate-100` |
| **Array Element (Swapping)** | Elevated card with spring motion translate | `ring-2 ring-amber-400 shadow-lg shadow-amber-500/20` |
| **Linked List Node** | Rounded rectangular container with `.val` & `.next` arrow | `bg-slate-800 border-slate-700 text-slate-100` |
| **Tree Node (Visited)** | Circular SVG node with pulsing outer ring | `stroke-emerald-400 fill-emerald-950/80` |
| **DP Cell (Computing)** | Pulsing border with tooltip showing formula breakdown | `ring-2 ring-amber-400 animate-pulse` |
| **DP Cell (Computed)** | Solid background with computed numeric value | `bg-indigo-950/60 border-indigo-500 text-indigo-200` |

### 2.3 Motion & Animation Principles (Framer Motion)
* **Smooth Transitions**: Use spring physics for physical movements like pointer sliding and element swaps (`transition={{ type: "spring", damping: 25, stiffness: 200 }}`).
* **Respect Reduced Motion**: Wrap animated components with `useReducedMotion()` to provide instant transitions if the user prefers reduced motion.
* **Frame Budget**: Canvas animations must maintain $\ge 60\text{ FPS}$. Avoid expensive SVG filter re-computations during playback.

### 2.4 Ergonomics & Accessibility (a11y)
* **Keyboard Navigation**:
  - `Space`: Toggle Play/Pause in Stepper.
  - `ArrowLeft` / `ArrowRight`: Step backward / forward.
  - `Ctrl + Enter` / `Cmd + Enter`: Run test cases in Practice Arena.
* **Accessible Contrast**: All text must meet **WCAG 2.1 AA** contrast ratios ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text and UI components).
* **Aria Labels**: All icon-only buttons (Play, Pause, Step, Reset, Copy, Backup) MUST include `aria-label` and `title` attributes.

---

## 3. Frontend & TypeScript Coding Standards

### 3.1 Strict TypeScript Rules
* **No Unsafe `any`**: All variables, function parameters, and return types must be explicitly typed. If an unknown payload arrives from Web Workers, use `unknown` with a type guard.
* **Explicit Component Props**: Define props using an interface named `<ComponentName>Props`:
  ```typescript
  // Correct
  interface StepperControlsProps {
    currentStep: number;
    totalSteps: number;
    isPlaying: boolean;
    speed: number;
    onPlayPause: () => void;
    onStepForward: () => void;
    onStepBackward: () => void;
    onSeek: (step: number) => void;
    onSpeedChange: (speed: number) => void;
  }
  export const StepperControls: React.FC<StepperControlsProps> = ({ ... }) => { ... };
  ```
* **Readonly Immutability**: Trace events and curriculum data collections must be typed as `readonly` or immutable where appropriate.

### 3.2 React & Next.js App Router Architecture
* **Client vs Server Boundary**:
  - Use `'use client'` at the top of files that utilize browser APIs, hooks, Monaco editor, or Web Workers.
  - Keep data definitions (`problems.ts`, `patterns.ts`) pure TypeScript without React dependencies so they can be imported anywhere.
* **Dynamic Loading of Heavy Libraries**:
  - Monaco Editor and Pyodide modules must be dynamically imported with SSR disabled:
    ```typescript
    import dynamic from 'next/dynamic';
    const MonacoPythonEditor = dynamic(() => import('./MonacoPythonEditor'), { ssr: false });
    ```
* **Performance & Re-Render Isolation**:
  - Visualizer canvas components must subscribe only to their specific slice of state (e.g. `useTimelineStore(state => state.currentEvent)`).
  - Wrap pure rendering sub-components (like individual array cells or tree nodes) in `React.memo`.

### 3.3 Zustand State Management Guidelines
* **Atomic State Updates**: Do not put unrelated state in a single monolithic store. Maintain distinct stores:
  1. `useTimelineStore.ts` (playback, scrubber, active step)
  2. `useProgressStore.ts` (solved problems, code drafts, bookmarks)
  3. `useSettingsStore.ts` (theme, editor font size, playback speed)
* **Selector Optimization**: Always pass selectors when using stores to prevent redundant renders:
  ```typescript
  // Correct
  const currentStep = useTimelineStore((state) => state.currentStep);
  // Avoid
  const { currentStep } = useTimelineStore(); // Causes re-render on any store change
  ```

---

## 4. Python & Pyodide WebAssembly Standards

### 4.1 Python Code Standards (PEP 8 + Idiomatic Style)
* **Type Annotations**: All Python starter codes and canonical solutions MUST have complete PEP 484 type annotations:
  ```python
  from typing import List, Optional

  def two_sum_ii(numbers: List[int], target: int) -> List[int]:
      """
      Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order,
      find two numbers such that they add up to a specific target number.
      """
      left: int = 0
      right: int = len(numbers) - 1
      while left < right:
          current_sum: int = numbers[left] + numbers[right]
          if current_sum == target:
              return [left + 1, right + 1]
          elif current_sum < target:
              left += 1
          else:
              right -= 1
      return []
  ```
* **Clean Starter Boilerplate**: Starter code should include concise docstrings and an explicit `pass` or `return` statement.

### 4.2 Web Worker Safety & Resource Management
* **Watchdog Enforcement**: Every execution dispatched to `python.worker.ts` MUST attach a `5000ms` watchdog timer on the main thread. If expired, terminate worker immediately.
* **Variable Sanitization**: `tracer.py` must filter out internal Python modules (`sys`, `inspect`, `builtins`) and truncate string representations exceeding 200 characters to prevent memory bloating.
* **Max Step Guard**: Tracing must abort if steps exceed 1,000 steps (`max_steps = 1000`) and emit a warning event.

---

## 5. Testing & Quality Assurance Standards

### 5.1 Problem Test Suite Requirements
Every problem in `problems.ts` MUST satisfy the following test criteria:

1. **Visible Sample Test Cases ($\ge 2$)**:
   - Standard baseline cases covering the problem description examples.
   - Clean expected output with optional explanation.
2. **Hidden Edge Cases ($\ge 3$)**:
   - **Empty / Minimal Input**: `nums = []`, `head = None`, `s = ""`.
   - **Boundary / Single Item**: `nums = [1]`, `target = 1`.
   - **Negative Values & Extremes**: Negative integers, duplicates, maximum value bounds.
   - **Parity / Alternating Cases**: Even vs odd lengths, sorted vs reverse sorted.

### 5.2 Automated Verification Protocol
* **Automated Solution Verification Script**: A test script must run all 45 canonical solutions through the Pyodide test runner harness to ensure a $100\%$ pass rate before release.
* **Trace Schema Validation**: Verify that every visualizer preset produces valid `TraceEvent` structures matching TypeScript interfaces.

---

## 6. Coding Agent (AI) Best Practices & Guidelines

When working on this repository, all AI coding agents must strictly adhere to the following rules:

1. **Preserve Documentation & Comments**: Never remove existing comments, docstrings, or architectural notes unless explicitly asked to rewrite that section.
2. **Atomic & Clean File Modifications**: Keep changes targeted and modular. Do not replace entire 1000-line files when editing a single function or component.
3. **No Phantom Dependencies**: Do not import packages that are not explicitly declared in `package.json`. If a new dependency is required, declare it and verify installation.
4. **Follow Directory Conventions**:
   - Place visualizer components in `src/components/visualizer/`.
   - Place practice editor components in `src/components/editor/`.
   - Place curriculum datasets in `src/lib/data/`.
   - Place Web Worker scripts in `src/lib/pyodide/`.
5. **Clickable Link Formatting**: When referencing files in messages, always format markdown links with `[filename](file:///path/to/file)`.

---

## 7. Git & Commit Conventions

Follow the **Conventional Commits** specification:

```bash
feat(visualizer): add Framer Motion layout animations for two-pointer swaps
fix(pyodide): resolve watchdog race condition on worker termination
refactor(curriculum): polish test cases and hints for dynamic programming
docs(spec): update TraceEvent interface with callStack schema
test(runner): add test harness validation for hidden edge cases
style(theme): enhance dark mode contrast on DP grid cells
```

---

## 8. Engineering Sign-Off Checklist

Before merging any major feature or PR:
- [ ] TypeScript builds with `0` errors (`npm run build` or `tsc --noEmit`).
- [ ] Pyodide executes without blocking the UI thread.
- [ ] Timeline slider scrubs smoothly with 0 frame drops.
- [ ] 1-Click JSON Backup exports and imports cleanly without state corruption.
- [ ] Responsive layout verified on desktop ($1920 \times 1080$), laptop ($1366 \times 768$), and tablet view.
