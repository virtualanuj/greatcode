# Product Intent Document: Python DSA Learning & Practice Platform

**Document Version:** 1.1.0 (Clarified & Finalized)  
**Target Audience for this Document:** Engineering Leads, System Architects, Full-Stack Engineers, UX Designers  
**Project Identifier:** `learn_dsa` / **AlgoLens (PyDSA)**  

---

## 1. Executive Summary & Core Purpose

### 1.1 Purpose Statement
The purpose of this platform is to bridge the conceptual and practical gap in learning Data Structures and Algorithms (DSA) for university students and entry-level software engineering candidates. It achieves this through a structured two-pillar architecture:
1. **The Concept Lab (`/learn`)**: Interactive step-by-step visual execution of canonical algorithmic patterns with customizable input datasets to build spatial and mental intuition.
2. **The Practice Arena (`/practice`)**: A zero-friction, code-first in-browser Python 3 workspace powered by WebAssembly (Pyodide) with automated test evaluation and progressive hints.

### 1.2 The Core Problem
1. **The "Black Box" Execution Gap**: Students struggle to trace memory states, pointer movements, recursive call stacks, and dynamic programming state transitions purely from static text or videos.
2. **The "Illusion of Competence"**: Passive observation does not translate to independent problem-solving ability under interview and exam conditions.
3. **High Setup Friction**: Installing local Python runtimes, managing dependencies, and setting up debuggers distracts candidates from mastering core algorithmic patterns.

### 1.3 Strategic Solution
A zero-setup, web-native platform built around a distinct **Two-Section Experience**:
* **Section 1: `/learn` (Visual Concept Lab)** — Curated, canonical algorithmic patterns with step-by-step line synchronization, customizable input parameters, and dedicated visual representations.
* **Section 2: `/practice` (Code Practice Arena)** — 45 tiered coding challenges (2 Easy, 2 Medium, 1 Hard across 9 patterns) running native Python 3 via client-side WebAssembly with instant pass/fail test harnesses.

---

## 2. Target Personas & User Goals

### 2.1 Primary User Personas

| Persona | Profile & Background | Primary Needs | Pain Points |
| :--- | :--- | :--- | :--- |
| **Persona A: University CS Student** | 2nd–4th year undergraduate taking DSA, Systems, or Algorithms courses. | Visualizing abstract structures (trees, graphs, recursion stacks, memory pointers); preparing for semester exams and lab assignments. | Professor slides are too abstract; manual dry runs on paper are tedious and prone to off-by-one errors. |
| **Persona B: Aspiring Software Engineer** | Final-year student or self-taught developer preparing for campus placements and technical interviews. | Mastering high-frequency algorithmic patterns (Two Pointers, Sliding Window, Monotonic Stack, Backtracking, DP); writing clean, idiomatic Python. | Grinding hundreds of disjointed LeetCode problems without pattern retention; freezing when facing a blank code editor. |

### 2.2 User Goals
* **G1: Build Spatial & Mental Intuition**: Visually inspect pointer movements, array element swaps, tree traversals, and DP grids dynamically.
* **G2: Master Reusable Patterns**: Focus on the 9 fundamental algorithmic patterns that account for the vast majority of entry-level interview questions.
* **G3: Active Coding with Instant Feedback**: Write idiomatic Python code and receive instant validation without server latency.
* **G4: Progressive Assistance**: Access tiered hints without prematurely revealing full solutions.
* **G5: Zero Friction & Portability**: Jump into learning immediately with zero account creation, with the ability to export and import progress backups.

---

## 3. Scope Definition & Key Decisions

### 3.1 Clarified Core Decisions

1. **Visual Stepper Model**: **Curated Presets with Custom Inputs**. The Visual Stepper provides canonical, annotated Python algorithms where learners can modify the input data (e.g., customize `nums`, `target`, tree nodes) and watch reliable, bug-free step-by-step animations.
2. **Platform Sectioning**: **Distinct `/learn` and `/practice` Sections**.
   - `/learn`: Deep-dive conceptual visualizers organized by pattern.
   - `/practice`: Problem catalog and Monaco code solver organized by difficulty and pattern.
3. **Curriculum Scope**: **45 Curated Problems** across **9 Core Patterns**:
   - Exactly **5 problems per pattern** structured as: **2 Easy, 2 Medium, 1 Hard**.
4. **Comprehension Flow**: **Observational Timeline Scrubbing** (Pure playback and timeline control without modal pop-up quizzes in MVP).
5. **Persistence**: **Zero-Setup Local-First Storage** (LocalStorage / IndexedDB with 1-click `Export Progress JSON` and `Import Progress JSON`).

---

### 3.2 In-Scope (Phase 1 / MVP & Core System)

#### A. The Concept Lab (`/learn/[patternId]`)
- **Time-Travel Playback**: Play, pause, step-forward, step-backward, timeline scrub slider, and speed presets ($0.5\times$, $1.0\times$, $1.5\times$, $2.0\times$, $3.0\times$).
- **Synchronized Source Code Highlighting**: Active line marker synced with each execution step.
- **Custom Input Sandbox**: Form inputs allowing users to supply custom arrays, target values, strings, or matrices to re-run visualizers.
- **Dedicated Data Structure Renderers**:
  - **1D/2D Arrays & Pointers**: Pointers (`left`, `right`, `slow`, `fast`, `pivot`), sliding window highlight box, swap animations.
  - **Linked Lists**: Node boxes, pointer arrows, head/tail/curr tags, redirection transitions.
  - **Stacks & Queues**: Push/pop container animations with Top/Front markers.
  - **Trees & Binary Search Trees**: Node graph layout, DFS/BFS visit states, recursion call stack.
  - **Dynamic Programming Grids**: 1D/2D memoization grids with subproblem dependency highlight arrows.
  - **Graphs**: Node-link diagrams with BFS/DFS visit states and edge weights.
- **Step Inspector**: Execution explanation card, local/global variable watch list, and call stack inspector.

#### B. The Practice Arena (`/practice/[problemId]`)
- **Monaco Python 3 Editor**: Syntax highlighting, auto-indentation, error markers, and reset template button.
- **Pyodide Client-Side Execution**: Zero-latency WebAssembly execution in an isolated Web Worker.
- **Automated Test Evaluator**:
  - Visible sample test cases with input, expected output, actual output, and captured `stdout`.
  - Hidden edge case evaluation (empty inputs, single elements, negative numbers, duplicates, large bounds).
- **Progressive 4-Stage Hint Ladder**:
  1. *Level 1: Pattern Recognition Clue*
  2. *Level 2: Invariant & Algorithmic Strategy*
  3. *Level 3: Python Pseudocode & Complexity Target*
  4. *Level 4: Full Annotated Solution with Step-by-Step Breakdown*

#### C. Curated 45-Problem Pattern Catalog ($9 \times 5$)
Structured curriculum covering 9 core interview patterns:
1. **Two Pointers** (2 Easy, 2 Medium, 1 Hard)
2. **Sliding Window** (2 Easy, 2 Medium, 1 Hard)
3. **Linked Lists** (2 Easy, 2 Medium, 1 Hard)
4. **Stacks & Queues (Monotonic)** (2 Easy, 2 Medium, 1 Hard)
5. **Trees & Binary Search Trees** (2 Easy, 2 Medium, 1 Hard)
6. **Binary Search Variations** (2 Easy, 2 Medium, 1 Hard)
7. **Graph Algorithms (BFS/DFS)** (2 Easy, 2 Medium, 1 Hard)
8. **Dynamic Programming (1D & 2D)** (2 Easy, 2 Medium, 1 Hard)
9. **Backtracking & Recursion** (2 Easy, 2 Medium, 1 Hard)

#### D. Local Persistence & Data Portability
- LocalStorage / IndexedDB storage for solved status, bookmarked problems, custom code drafts, and preferences.
- **Data Portability**: 1-click JSON backup download and restore.

---

### 3.3 Out-of-Scope (Explicit Boundaries)

| Feature / Capability | Rationale for Exclusion in Phase 1 | Future Consideration |
| :--- | :--- | :--- |
| **Multi-Language Support (C++, Java, Rust)** | Focus intensely on delivering an exceptional Python 3 experience for students and interviewees first. | Phase 2 candidate (via WebAssembly or server sandbox). |
| **Arbitrary Custom Code Visualization** | Inferring pointers and layout for unstructured arbitrary code is prone to rendering bugs; curated presets with custom inputs provide a guaranteed high-quality experience. | Phase 3 auto-tracer research. |
| **Micro-Quiz Popups during Playback** | Keep stepper playback smooth, non-intrusive, and scrubbable. | Phase 2 optional quiz mode. |
| **User Authentication / Cloud Backend** | Eliminate friction for students; zero signup required. | Phase 2 cloud sync. |
| **Live Multiplayer / Mock Interviews** | Infrastructure complexity; out of alignment with core self-paced learning. | Phase 3 community feature. |

---

## 4. Key Functional Requirements (FR)

* **FR-1 [Visual Engine]**: The system MUST generate execution trace events (line number, variable snapshots, call stack depth, pointer coordinates) when running a visualizer preset.
* **FR-2 [Custom Input Execution]**: The user MUST be able to modify input values in the Concept Lab and immediately generate a refreshed visual execution trace.
* **FR-3 [Timeline Scrubbing]**: The UI MUST allow instantaneous scrubbing to any step index $i \in [0, N]$ without desynchronizing code highlight or canvas state.
* **FR-4 [In-Browser Sandboxed Execution]**: User code in the Practice Arena MUST execute client-side via Pyodide in a dedicated Web Worker, with a 5000ms timeout watchdog against infinite loops.
* **FR-5 [Automated Test Suite]**: Test evaluation MUST return structured results for visible sample tests and hidden edge cases.
* **FR-6 [Data Portability]**: The platform MUST provide a mechanism to export all user progress and code drafts as a JSON file, and restore from a previously exported JSON file.

---

## 5. Non-Functional Requirements (NFR)

* **NFR-1 Performance & Latency**:
  - Visual stepper frame rate $\ge 60\text{ FPS}$ during playback.
  - Python execution start time $\le 1.5\text{s}$ on first load (Pyodide WASM cacheable in browser IndexedDB/ServiceWorker), subsequent runs $\le 100\text{ms}$.
* **NFR-2 Security & Isolation**:
  - Web Worker sandbox prevents user code from accessing cookies, local storage, or manipulating DOM outside Pyodide.
* **NFR-3 Usability & Ergonomics**:
  - Support high-contrast dark/light modes.
  - Resizable split-pane layout for code editor and problem description.
  - Keyboard shortcuts for timeline playback (`Space` to Play/Pause, `Left/Right Arrows` to Step).
* **NFR-4 Maintainability & Extensibility**:
  - Declarative TypeScript problem schema making it simple to add or adjust any of the 45 curated problems and test suites.

---

## 6. Target Technical Stack Recommendations

* **Client Framework**: Next.js 14+ (App Router), TypeScript
* **Styling & Animation**: Tailwind CSS, Framer Motion (for fluid pointer and element transitions)
* **Code Editor**: Monaco Editor (`@monaco-editor/react`)
* **Python Runtime**: Pyodide (CPython 3.12 WebAssembly) in a dedicated Web Worker
* **State Management**: Zustand
* **Local Storage**: `idb-keyval` / `localStorage` with JSON export/import

---

## 7. Engineering Handover & Actionable Next Steps

1. **Architecture & Specification Alignment**: [spec.md](file:///Users/anuj/workspace/learn_dsa/spec.md) updated with 45-problem curriculum structure, `/learn` vs `/practice` routing, and Web Worker RPC protocol.
2. **Component Implementation**: Build foundational scaffolding, Pyodide worker bridge, Visual Stepper canvas components, Monaco editor test console, and seed the 45-problem curriculum catalog.
