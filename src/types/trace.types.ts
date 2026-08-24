// src/types/trace.types.ts

export type EventType = 
  | 'LINE'           // Standard line execution
  | 'CALL'           // Function call entry
  | 'RETURN'         // Function return
  | 'POINTER_MOVE'   // Specific pointer shifted (e.g. left += 1)
  | 'COMPARE'        // Element comparison (e.g. nums[i] < nums[j])
  | 'SWAP'           // Element swap in array
  | 'VISIT_NODE'     // Tree / Graph node visited
  | 'UPDATE_DP_CELL' // DP Table cell calculation
  | 'PUSH_STACK'     // Stack push
  | 'POP_STACK';     // Stack pop

export interface CallStackFrame {
  functionName: string;
  line: number;
  args: Record<string, any>;
  locals: Record<string, any>;
}

// Array & Pointer Visual State
export interface ArrayPointer {
  id: string;               // 'left', 'right', 'slow', 'fast', 'pivot', 'mid'
  name: string;             // Display label ('L', 'R', 'Slow', 'Fast', 'Mid')
  index: number;            // 0-indexed array index
  color: 'blue' | 'rose' | 'amber' | 'emerald' | 'purple' | 'cyan';
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

// Linked List Visual State
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
    color: 'blue' | 'rose' | 'amber' | 'emerald' | 'purple';
  }[];
}

// Binary Tree / BST Visual State
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

// Dynamic Programming Grid Visual State
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

// Stack & Queue Visual State
export interface StackQueueItem {
  id: string;
  value: any;
  state: 'default' | 'pushing' | 'popping' | 'top';
}

export interface StackQueueVisualState {
  type: 'STACK_QUEUE';
  structureType: 'STACK' | 'QUEUE';
  items: StackQueueItem[];
}

// Graph Visual State
export interface GraphNode {
  id: string;
  label: string;
  state: 'unvisited' | 'visiting' | 'visited';
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state: 'default' | 'traversing' | 'path';
}

export interface GraphVisualState {
  type: 'GRAPH';
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeNodeId: string | null;
}

export type DataStructureState =
  | ArrayVisualState
  | LinkedListVisualState
  | TreeVisualState
  | StackQueueVisualState
  | DPGridVisualState
  | GraphVisualState;

export interface TraceEvent {
  stepIndex: number;
  line: number;                     // 1-indexed line number in source code
  eventType: EventType;
  explanation: string;              // Human-readable rationale for this step
  codeSnippet?: string;
  variables: Record<string, any>;   // Sanitized variable snapshot
  callStack: CallStackFrame[];
  dataStructureState: DataStructureState;
}
