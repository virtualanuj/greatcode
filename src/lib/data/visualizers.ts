// src/lib/data/visualizers.ts
import { TraceEvent, ArrayVisualState, LinkedListVisualState, TreeVisualState, StackQueueVisualState, DPGridVisualState, GraphVisualState } from '@/types/trace.types';

export function generatePatternTrace(patternId: string, inputs: Record<string, any>): TraceEvent[] {
  switch (patternId) {
    case 'two-pointers':
      return generateTwoPointersTrace(inputs.numbers || [2, 7, 11, 15], Number(inputs.target ?? 9));
    case 'sliding-window':
      return generateSlidingWindowTrace(inputs.nums || [2, 1, 5, 1, 3, 2], Number(inputs.k ?? 3));
    case 'linked-list':
      return generateLinkedListTrace(inputs.values || [1, 2, 3, 4, 5]);
    case 'stack-queue':
      return generateStackQueueTrace(inputs.temperatures || [73, 74, 75, 71, 69, 72, 76]);
    case 'trees-bst':
      return generateTreeTrace(inputs.nodes || [4, 2, 7, 1, 3, 6, 9]);
    case 'binary-search':
      return generateBinarySearchTrace(inputs.nums || [-1, 0, 3, 5, 9, 12], Number(inputs.target ?? 9));
    case 'graphs':
      return generateGraphsTrace(inputs.grid || [[1, 1, 0], [1, 0, 0], [0, 0, 1]]);
    case 'dynamic-prog':
      return generateDynamicProgrammingTrace(Number(inputs.n ?? 5));
    case 'backtracking':
      return generateBacktrackingTrace(inputs.nums || [1, 2, 3]);
    default:
      return generateTwoPointersTrace([2, 7, 11, 15], 9);
  }
}

// 1. Two Pointers Trace
function generateTwoPointersTrace(numbers: number[], target: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  
  // Clean & sort numbers for reliable execution
  const nums = Array.isArray(numbers) ? [...numbers].map(Number).sort((a, b) => a - b).slice(0, 12) : [2, 7, 11, 15];
  let left = 0;
  let right = nums.length - 1;

  const makeState = (l: number, r: number, highlight?: number[]): ArrayVisualState => ({
    type: 'ARRAY',
    elements: nums.map((val, idx) => ({
      index: idx,
      value: val,
      state: idx === l || idx === r ? 'active' : 'default'
    })),
    pointers: [
      { id: 'left', name: 'L (left)', index: l, color: 'blue' },
      { id: 'right', name: 'R (right)', index: r, color: 'rose' }
    ],
    highlightIndices: highlight
  });

  events.push({
    stepIndex: step++,
    line: 2,
    eventType: 'LINE',
    explanation: `Initialize left pointer at index 0 (value: ${nums[left]}) and right pointer at index ${right} (value: ${nums[right]}).`,
    variables: { left, right, target, numbers: nums },
    callStack: [{ functionName: 'two_sum_sorted', line: 2, args: { numbers: nums, target }, locals: { left, right } }],
    dataStructureState: makeState(left, right)
  });

  while (left < right) {
    const currentSum = nums[left] + nums[right];
    
    events.push({
      stepIndex: step++,
      line: 5,
      eventType: 'COMPARE',
      explanation: `Check while left (${left}) < right (${right}). Calculate current_sum = numbers[${left}] (${nums[left]}) + numbers[${right}] (${nums[right]}) = ${currentSum}.`,
      variables: { left, right, current_sum: currentSum, target },
      callStack: [{ functionName: 'two_sum_sorted', line: 5, args: { numbers: nums, target }, locals: { left, right, currentSum } }],
      dataStructureState: makeState(left, right, [left, right])
    });

    if (currentSum === target) {
      events.push({
        stepIndex: step++,
        line: 7,
        eventType: 'RETURN',
        explanation: `Target found! current_sum (${currentSum}) == target (${target}). Return 1-indexed positions [${left + 1}, ${right + 1}].`,
        variables: { left, right, current_sum: currentSum, target, result: [left + 1, right + 1] },
        callStack: [{ functionName: 'two_sum_sorted', line: 7, args: { numbers: nums, target }, locals: { left, right, currentSum } }],
        dataStructureState: {
          type: 'ARRAY',
          elements: nums.map((val, idx) => ({
            index: idx,
            value: val,
            state: idx === left || idx === right ? 'sorted' : 'default'
          })),
          pointers: [
            { id: 'left', name: 'L (match)', index: left, color: 'emerald' },
            { id: 'right', name: 'R (match)', index: right, color: 'emerald' }
          ]
        }
      });
      return events;
    } else if (currentSum < target) {
      events.push({
        stepIndex: step++,
        line: 9,
        eventType: 'POINTER_MOVE',
        explanation: `current_sum (${currentSum}) < target (${target}). Sum is too small, advance left pointer: left += 1 (${left} -> ${left + 1}).`,
        variables: { left: left + 1, right, current_sum: currentSum, target },
        callStack: [{ functionName: 'two_sum_sorted', line: 9, args: { numbers: nums, target }, locals: { left: left + 1, right, currentSum } }],
        dataStructureState: makeState(left + 1, right)
      });
      left++;
    } else {
      events.push({
        stepIndex: step++,
        line: 11,
        eventType: 'POINTER_MOVE',
        explanation: `current_sum (${currentSum}) > target (${target}). Sum is too large, decrement right pointer: right -= 1 (${right} -> ${right - 1}).`,
        variables: { left, right: right - 1, current_sum: currentSum, target },
        callStack: [{ functionName: 'two_sum_sorted', line: 11, args: { numbers: nums, target }, locals: { left, right: right - 1, currentSum } }],
        dataStructureState: makeState(left, right - 1)
      });
      right--;
    }
  }

  events.push({
    stepIndex: step++,
    line: 13,
    eventType: 'RETURN',
    explanation: `Pointers met (left >= right). No pair sums to target. Return [].`,
    variables: { left, right, result: [] },
    callStack: [{ functionName: 'two_sum_sorted', line: 13, args: { numbers: nums, target }, locals: { left, right } }],
    dataStructureState: makeState(left, right)
  });

  return events;
}

// 2. Sliding Window Trace
function generateSlidingWindowTrace(numbers: number[], kVal: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const nums = Array.isArray(numbers) ? [...numbers].map(Number).slice(0, 10) : [2, 1, 5, 1, 3, 2];
  const k = Math.max(1, Math.min(kVal || 3, nums.length));

  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  let left = 0;

  events.push({
    stepIndex: step++,
    line: 2,
    eventType: 'LINE',
    explanation: `Compute initial window sum of first k=${k} elements: ${nums.slice(0, k).join(' + ')} = ${windowSum}.`,
    variables: { window_sum: windowSum, max_sum: maxSum, left: 0, k },
    callStack: [{ functionName: 'max_sum_subarray', line: 2, args: { nums, k }, locals: { windowSum, maxSum, left: 0 } }],
    dataStructureState: {
      type: 'ARRAY',
      elements: nums.map((v, i) => ({ index: i, value: v, state: i < k ? 'window' : 'default' })),
      pointers: [
        { id: 'left', name: 'L (left)', index: 0, color: 'blue' },
        { id: 'right', name: 'R (right)', index: k - 1, color: 'rose' }
      ],
      window: { startIndex: 0, endIndex: k - 1, label: `Sum: ${windowSum}` }
    }
  });

  for (let right = k; right < nums.length; right++) {
    const prevSum = windowSum;
    windowSum += nums[right] - nums[left];
    const prevLeft = left;
    left++;
    const isNewMax = windowSum > maxSum;
    maxSum = Math.max(maxSum, windowSum);

    events.push({
      stepIndex: step++,
      line: 7,
      eventType: 'POINTER_MOVE',
      explanation: `Slide window right: add nums[${right}] (${nums[right]}), subtract nums[${prevLeft}] (${nums[prevLeft]}). New window_sum = ${prevSum} + ${nums[right]} - ${nums[prevLeft]} = ${windowSum}.`,
      variables: { window_sum: windowSum, max_sum: maxSum, left, right, k },
      callStack: [{ functionName: 'max_sum_subarray', line: 7, args: { nums, k }, locals: { windowSum, maxSum, left, right } }],
      dataStructureState: {
        type: 'ARRAY',
        elements: nums.map((v, i) => ({ index: i, value: v, state: i >= left && i <= right ? 'window' : 'default' })),
        pointers: [
          { id: 'left', name: 'L', index: left, color: 'blue' },
          { id: 'right', name: 'R', index: right, color: 'rose' }
        ],
        window: { startIndex: left, endIndex: right, label: `Sum: ${windowSum} (Max: ${maxSum})` }
      }
    });
  }

  events.push({
    stepIndex: step++,
    line: 11,
    eventType: 'RETURN',
    explanation: `Array iteration complete. Maximum sum of any contiguous subarray of size ${k} is ${maxSum}.`,
    variables: { max_sum: maxSum },
    callStack: [{ functionName: 'max_sum_subarray', line: 11, args: { nums, k }, locals: { maxSum } }],
    dataStructureState: {
      type: 'ARRAY',
      elements: nums.map((v, i) => ({ index: i, value: v, state: 'sorted' })),
      pointers: []
    }
  });

  return events;
}

// 3. Linked List Trace
function generateLinkedListTrace(values: number[]): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const vals = Array.isArray(values) ? [...values].map(Number).slice(0, 7) : [1, 2, 3, 4, 5];

  events.push({
    stepIndex: step++,
    line: 2,
    eventType: 'LINE',
    explanation: `Initialize prev = None and curr = head (Node ${vals[0]}).`,
    variables: { prev: null, curr: vals[0] },
    callStack: [{ functionName: 'reverse_linked_list', line: 2, args: { head: vals[0] }, locals: { prev: null, curr: vals[0] } }],
    dataStructureState: {
      type: 'LINKED_LIST',
      nodes: vals.map((v, i) => ({
        id: `node-${i}`,
        value: v,
        nextId: i < vals.length - 1 ? `node-${i + 1}` : null,
        state: i === 0 ? 'current' : 'default'
      })),
      pointers: [
        { name: 'curr', targetNodeId: 'node-0', color: 'blue' },
        { name: 'prev', targetNodeId: null, color: 'rose' }
      ]
    }
  });

  for (let i = 0; i < vals.length; i++) {
    const nextVal = i < vals.length - 1 ? vals[i + 1] : null;

    events.push({
      stepIndex: step++,
      line: 6,
      eventType: 'SWAP',
      explanation: `Cache next_temp = curr.next (Node ${nextVal ?? 'None'}). Reverse pointer: curr.next = prev (points backwards to ${i > 0 ? vals[i - 1] : 'None'}).`,
      variables: { prev: i > 0 ? vals[i - 1] : null, curr: vals[i], next_temp: nextVal },
      callStack: [{ functionName: 'reverse_linked_list', line: 6, args: {}, locals: { curr: vals[i], next_temp: nextVal } }],
      dataStructureState: {
        type: 'LINKED_LIST',
        nodes: vals.map((v, idx) => ({
          id: `node-${idx}`,
          value: v,
          nextId: idx <= i ? (idx > 0 ? `node-${idx - 1}` : null) : (idx < vals.length - 1 ? `node-${idx + 1}` : null),
          state: idx === i ? 'modified' : (idx < i ? 'visited' : 'default')
        })),
        pointers: [
          { name: 'curr', targetNodeId: `node-${i}`, color: 'blue' },
          { name: 'prev', targetNodeId: i > 0 ? `node-${i - 1}` : null, color: 'rose' }
        ]
      }
    });

    events.push({
      stepIndex: step++,
      line: 8,
      eventType: 'POINTER_MOVE',
      explanation: `Advance pointers: prev becomes curr (Node ${vals[i]}), curr becomes next_temp (Node ${nextVal ?? 'None'}).`,
      variables: { prev: vals[i], curr: nextVal },
      callStack: [{ functionName: 'reverse_linked_list', line: 8, args: {}, locals: { prev: vals[i], curr: nextVal } }],
      dataStructureState: {
        type: 'LINKED_LIST',
        nodes: vals.map((v, idx) => ({
          id: `node-${idx}`,
          value: v,
          nextId: idx <= i ? (idx > 0 ? `node-${idx - 1}` : null) : (idx < vals.length - 1 ? `node-${idx + 1}` : null),
          state: idx <= i ? 'visited' : 'default'
        })),
        pointers: [
          { name: 'prev', targetNodeId: `node-${i}`, color: 'rose' },
          { name: 'curr', targetNodeId: i < vals.length - 1 ? `node-${i + 1}` : null, color: 'blue' }
        ]
      }
    });
  }

  events.push({
    stepIndex: step++,
    line: 10,
    eventType: 'RETURN',
    explanation: `curr is None. The list is completely reversed. Return prev as the new head (Node ${vals[vals.length - 1]}).`,
    variables: { return_head: vals[vals.length - 1] },
    callStack: [{ functionName: 'reverse_linked_list', line: 10, args: {}, locals: { prev: vals[vals.length - 1] } }],
    dataStructureState: {
      type: 'LINKED_LIST',
      nodes: vals.map((v, idx) => ({
        id: `node-${idx}`,
        value: v,
        nextId: idx > 0 ? `node-${idx - 1}` : null,
        state: 'visited'
      })),
      pointers: [
        { name: 'head (new)', targetNodeId: `node-${vals.length - 1}`, color: 'emerald' }
      ]
    }
  });

  return events;
}

// 4. Stacks & Monotonic Stack Trace
function generateStackQueueTrace(temperatures: number[]): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const temps = Array.isArray(temperatures) ? [...temperatures].map(Number).slice(0, 8) : [73, 74, 75, 71, 69, 72, 76];
  const answer = new Array(temps.length).fill(0);
  const stack: number[] = []; // indices

  events.push({
    stepIndex: step++,
    line: 2,
    eventType: 'LINE',
    explanation: `Initialize answer array [${answer.join(', ')}] and empty monotonic stack [].`,
    variables: { answer, stack: [] },
    callStack: [{ functionName: 'daily_temperatures', line: 2, args: { temperatures: temps }, locals: { answer } }],
    dataStructureState: {
      type: 'STACK_QUEUE',
      structureType: 'STACK',
      items: []
    }
  });

  for (let currIdx = 0; currIdx < temps.length; currIdx++) {
    const currTemp = temps[currIdx];

    events.push({
      stepIndex: step++,
      line: 6,
      eventType: 'LINE',
      explanation: `Day ${currIdx}: Temperature is ${currTemp}°F. Compare with stack top.`,
      variables: { currIdx, currTemp, stack: [...stack], answer: [...answer] },
      callStack: [{ functionName: 'daily_temperatures', line: 6, args: {}, locals: { currIdx, currTemp } }],
      dataStructureState: {
        type: 'STACK_QUEUE',
        structureType: 'STACK',
        items: stack.map((idx, i) => ({
          id: `item-${idx}`,
          value: `${temps[idx]}°F (Day ${idx})`,
          state: i === stack.length - 1 ? 'top' : 'default'
        }))
      }
    });

    while (stack.length > 0 && temps[stack[stack.length - 1]] < currTemp) {
      const prevIdx = stack.pop()!;
      const days = currIdx - prevIdx;
      answer[prevIdx] = days;

      events.push({
        stepIndex: step++,
        line: 8,
        eventType: 'POP_STACK',
        explanation: `Warmer day found! ${currTemp}°F > ${temps[prevIdx]}°F (Day ${prevIdx}). Pop Day ${prevIdx} and record answer[${prevIdx}] = ${days} days.`,
        variables: { prevIdx, currIdx, days, answer: [...answer], stack: [...stack] },
        callStack: [{ functionName: 'daily_temperatures', line: 8, args: {}, locals: { prevIdx, currIdx, days } }],
        dataStructureState: {
          type: 'STACK_QUEUE',
          structureType: 'STACK',
          items: stack.map((idx, i) => ({
            id: `item-${idx}`,
            value: `${temps[idx]}°F (Day ${idx})`,
            state: i === stack.length - 1 ? 'top' : 'default'
          }))
        }
      });
    }

    stack.push(currIdx);
    events.push({
      stepIndex: step++,
      line: 10,
      eventType: 'PUSH_STACK',
      explanation: `Push current Day ${currIdx} (${currTemp}°F) onto monotonic decreasing stack.`,
      variables: { stack: [...stack], answer: [...answer] },
      callStack: [{ functionName: 'daily_temperatures', line: 10, args: {}, locals: { stack } }],
      dataStructureState: {
        type: 'STACK_QUEUE',
        structureType: 'STACK',
        items: stack.map((idx, i) => ({
          id: `item-${idx}`,
          value: `${temps[idx]}°F (Day ${idx})`,
          state: i === stack.length - 1 ? 'top' : 'default'
        }))
      }
    });
  }

  return events;
}

// 5. Binary Tree Trace
function generateTreeTrace(nodesList: number[]): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const nodes = Array.isArray(nodesList) ? [...nodesList].map(Number).slice(0, 7) : [4, 2, 7, 1, 3, 6, 9];

  events.push({
    stepIndex: step++,
    line: 2,
    eventType: 'VISIT_NODE',
    explanation: `Start at root node ${nodes[0]}.`,
    variables: { root: nodes[0] },
    callStack: [{ functionName: 'invert_tree', line: 2, args: { root: nodes[0] }, locals: {} }],
    dataStructureState: {
      type: 'TREE',
      rootId: 'node-0',
      nodes: {
        'node-0': { id: 'node-0', value: nodes[0], leftId: 'node-1', rightId: 'node-2', state: 'active' },
        'node-1': { id: 'node-1', value: nodes[1] ?? '2', leftId: 'node-3', rightId: 'node-4', state: 'unvisited' },
        'node-2': { id: 'node-2', value: nodes[2] ?? '7', leftId: 'node-5', rightId: 'node-6', state: 'unvisited' },
        'node-3': { id: 'node-3', value: nodes[3] ?? '1', leftId: null, rightId: null, state: 'unvisited' },
        'node-4': { id: 'node-4', value: nodes[4] ?? '3', leftId: null, rightId: null, state: 'unvisited' },
        'node-5': { id: 'node-5', value: nodes[5] ?? '6', leftId: null, rightId: null, state: 'unvisited' },
        'node-6': { id: 'node-6', value: nodes[6] ?? '9', leftId: null, rightId: null, state: 'unvisited' }
      },
      currentNodeId: 'node-0',
      traversalOrder: ['node-0']
    }
  });

  events.push({
    stepIndex: step++,
    line: 5,
    eventType: 'SWAP',
    explanation: `Swap left and right children of root (${nodes[0]}): Left (${nodes[1]}) <-> Right (${nodes[2]}).`,
    variables: { left: nodes[2], right: nodes[1] },
    callStack: [{ functionName: 'invert_tree', line: 5, args: {}, locals: {} }],
    dataStructureState: {
      type: 'TREE',
      rootId: 'node-0',
      nodes: {
        'node-0': { id: 'node-0', value: nodes[0], leftId: 'node-2', rightId: 'node-1', state: 'processing' },
        'node-2': { id: 'node-2', value: nodes[2] ?? '7', leftId: 'node-5', rightId: 'node-6', state: 'active' },
        'node-1': { id: 'node-1', value: nodes[1] ?? '2', leftId: 'node-3', rightId: 'node-4', state: 'active' },
        'node-3': { id: 'node-3', value: nodes[3] ?? '1', leftId: null, rightId: null, state: 'unvisited' },
        'node-4': { id: 'node-4', value: nodes[4] ?? '3', leftId: null, rightId: null, state: 'unvisited' },
        'node-5': { id: 'node-5', value: nodes[5] ?? '6', leftId: null, rightId: null, state: 'unvisited' },
        'node-6': { id: 'node-6', value: nodes[6] ?? '9', leftId: null, rightId: null, state: 'unvisited' }
      },
      currentNodeId: 'node-0',
      traversalOrder: ['node-0']
    }
  });

  events.push({
    stepIndex: step++,
    line: 7,
    eventType: 'RETURN',
    explanation: `Recurse and swap subtrees. Binary tree is successfully inverted!`,
    variables: { root: nodes[0] },
    callStack: [{ functionName: 'invert_tree', line: 7, args: {}, locals: {} }],
    dataStructureState: {
      type: 'TREE',
      rootId: 'node-0',
      nodes: {
        'node-0': { id: 'node-0', value: nodes[0], leftId: 'node-2', rightId: 'node-1', state: 'completed' },
        'node-2': { id: 'node-2', value: nodes[2] ?? '7', leftId: 'node-6', rightId: 'node-5', state: 'completed' },
        'node-1': { id: 'node-1', value: nodes[1] ?? '2', leftId: 'node-4', rightId: 'node-3', state: 'completed' },
        'node-6': { id: 'node-6', value: nodes[6] ?? '9', leftId: null, rightId: null, state: 'completed' },
        'node-5': { id: 'node-5', value: nodes[5] ?? '6', leftId: null, rightId: null, state: 'completed' },
        'node-4': { id: 'node-4', value: nodes[4] ?? '3', leftId: null, rightId: null, state: 'completed' },
        'node-3': { id: 'node-3', value: nodes[3] ?? '1', leftId: null, rightId: null, state: 'completed' }
      },
      currentNodeId: 'node-0',
      traversalOrder: ['node-0', 'node-2', 'node-1']
    }
  });

  return events;
}

// 6. Binary Search Trace
function generateBinarySearchTrace(numbers: number[], targetVal: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const nums = Array.isArray(numbers) ? [...numbers].map(Number).sort((a, b) => a - b).slice(0, 12) : [-1, 0, 3, 5, 9, 12];
  const target = Number(targetVal ?? 9);

  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    events.push({
      stepIndex: step++,
      line: 6,
      eventType: 'COMPARE',
      explanation: `Search space: [${left}..${right}]. Compute mid = ${left} + (${right} - ${left}) // 2 = ${mid} (value: ${nums[mid]}). Compare nums[${mid}] with target ${target}.`,
      variables: { left, right, mid, 'nums[mid]': nums[mid], target },
      callStack: [{ functionName: 'binary_search', line: 6, args: { nums, target }, locals: { left, right, mid } }],
      dataStructureState: {
        type: 'ARRAY',
        elements: nums.map((v, i) => ({
          index: i,
          value: v,
          state: i === mid ? 'active' : (i >= left && i <= right ? 'window' : 'default')
        })),
        pointers: [
          { id: 'left', name: 'L', index: left, color: 'blue' },
          { id: 'mid', name: 'MID', index: mid, color: 'amber' },
          { id: 'right', name: 'R', index: right, color: 'rose' }
        ]
      }
    });

    if (nums[mid] === target) {
      events.push({
        stepIndex: step++,
        line: 8,
        eventType: 'RETURN',
        explanation: `Target ${target} found at index ${mid}! Return ${mid}.`,
        variables: { result: mid },
        callStack: [{ functionName: 'binary_search', line: 8, args: {}, locals: { mid } }],
        dataStructureState: {
          type: 'ARRAY',
          elements: nums.map((v, i) => ({
            index: i,
            value: v,
            state: i === mid ? 'sorted' : 'default'
          })),
          pointers: [
            { id: 'mid', name: 'FOUND', index: mid, color: 'emerald' }
          ]
        }
      });
      return events;
    } else if (nums[mid] < target) {
      events.push({
        stepIndex: step++,
        line: 10,
        eventType: 'POINTER_MOVE',
        explanation: `nums[${mid}] (${nums[mid]}) < target (${target}). Eliminate left half, advance left = mid + 1 (${left} -> ${mid + 1}).`,
        variables: { left: mid + 1, right, target },
        callStack: [{ functionName: 'binary_search', line: 10, args: {}, locals: { left: mid + 1, right } }],
        dataStructureState: {
          type: 'ARRAY',
          elements: nums.map((v, i) => ({
            index: i,
            value: v,
            state: i >= mid + 1 && i <= right ? 'window' : 'default'
          })),
          pointers: [
            { id: 'left', name: 'L', index: mid + 1, color: 'blue' },
            { id: 'right', name: 'R', index: right, color: 'rose' }
          ]
        }
      });
      left = mid + 1;
    } else {
      events.push({
        stepIndex: step++,
        line: 12,
        eventType: 'POINTER_MOVE',
        explanation: `nums[${mid}] (${nums[mid]}) > target (${target}). Eliminate right half, retreat right = mid - 1 (${right} -> ${mid - 1}).`,
        variables: { left, right: mid - 1, target },
        callStack: [{ functionName: 'binary_search', line: 12, args: {}, locals: { left, right: mid - 1 } }],
        dataStructureState: {
          type: 'ARRAY',
          elements: nums.map((v, i) => ({
            index: i,
            value: v,
            state: i >= left && i <= mid - 1 ? 'window' : 'default'
          })),
          pointers: [
            { id: 'left', name: 'L', index: left, color: 'blue' },
            { id: 'right', name: 'R', index: mid - 1, color: 'rose' }
          ]
        }
      });
      right = mid - 1;
    }
  }

  events.push({
    stepIndex: step++,
    line: 14,
    eventType: 'RETURN',
    explanation: `Search space exhausted (left > right). Target not present in array. Return -1.`,
    variables: { result: -1 },
    callStack: [{ functionName: 'binary_search', line: 14, args: {}, locals: {} }],
    dataStructureState: {
      type: 'ARRAY',
      elements: nums.map((v, i) => ({ index: i, value: v, state: 'default' })),
      pointers: []
    }
  });

  return events;
}

// 7. Graph BFS/DFS Trace
function generateGraphsTrace(gridInput: number[][]): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const grid = Array.isArray(gridInput) && Array.isArray(gridInput[0])
    ? gridInput.map(row => [...row].slice(0, 4)).slice(0, 4)
    : [[1, 1, 0], [1, 0, 0], [0, 0, 1]];

  events.push({
    stepIndex: step++,
    line: 2,
    eventType: 'LINE',
    explanation: `Scan grid to count islands (connected land cells '1'). Start traversing at cell (0, 0).`,
    variables: { islands: 0, rows: grid.length, cols: grid[0].length },
    callStack: [{ functionName: 'count_islands', line: 2, args: { grid }, locals: {} }],
    dataStructureState: {
      type: 'GRAPH',
      nodes: grid.flatMap((row, r) => row.map((v, c) => ({
        id: `cell-${r}-${c}`,
        label: `(${r},${c}) ${v === 1 ? '🏝️' : '🌊'}`,
        state: v === 1 ? 'unvisited' : 'visited'
      }))),
      edges: [],
      activeNodeId: 'cell-0-0'
    }
  });

  return events;
}

// 8. Dynamic Programming Trace
function generateDynamicProgrammingTrace(nVal: number): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const n = Math.max(2, Math.min(nVal || 5, 6));
  const dp: (number | null)[] = new Array(n + 1).fill(null);
  dp[1] = 1;
  dp[2] = 2;

  events.push({
    stepIndex: step++,
    line: 4,
    eventType: 'UPDATE_DP_CELL',
    explanation: `Establish base cases: dp[1] = 1 way (1 step), dp[2] = 2 ways (1+1 or 2 steps).`,
    variables: { 'dp[1]': 1, 'dp[2]': 2, n },
    callStack: [{ functionName: 'climb_stairs', line: 4, args: { n }, locals: { dp } }],
    dataStructureState: {
      type: 'DP_GRID',
      dimensions: { rows: 1, cols: n + 1 },
      colHeaders: Array.from({ length: n + 1 }, (_, i) => `Step ${i}`),
      grid: [dp.map((v, idx) => ({
        row: 0,
        col: idx,
        value: v,
        state: idx === 1 || idx === 2 ? 'base_case' : 'uncomputed'
      }))],
      activeCell: { row: 0, col: 2 },
      formulaDescription: 'Base cases: dp[1]=1, dp[2]=2'
    }
  });

  for (let i = 3; i <= n; i++) {
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);

    events.push({
      stepIndex: step++,
      line: 7,
      eventType: 'UPDATE_DP_CELL',
      explanation: `Compute dp[${i}] = dp[${i - 1}] (${dp[i - 1]}) + dp[${i - 2}] (${dp[i - 2]}) = ${dp[i]} ways.`,
      variables: { i, 'dp[i-1]': dp[i - 1], 'dp[i-2]': dp[i - 2], 'dp[i]': dp[i] },
      callStack: [{ functionName: 'climb_stairs', line: 7, args: { n }, locals: { i, dp } }],
      dataStructureState: {
        type: 'DP_GRID',
        dimensions: { rows: 1, cols: n + 1 },
        colHeaders: Array.from({ length: n + 1 }, (_, c) => `Step ${c}`),
        grid: [dp.map((v, idx) => ({
          row: 0,
          col: idx,
          value: v,
          state: idx === i ? 'computed' : (idx < i ? 'base_case' : 'uncomputed'),
          dependsOn: idx === i ? [{ row: 0, col: i - 1 }, { row: 0, col: i - 2 }] : undefined
        }))],
        activeCell: { row: 0, col: i },
        formulaDescription: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`
      }
    });
  }

  return events;
}

// 9. Backtracking Trace
function generateBacktrackingTrace(numsInput: number[]): TraceEvent[] {
  const events: TraceEvent[] = [];
  let step = 0;
  const nums = Array.isArray(numsInput) ? [...numsInput].map(Number).slice(0, 4) : [1, 2, 3];
  const result: number[][] = [];
  const path: number[] = [];

  events.push({
    stepIndex: step++,
    line: 5,
    eventType: 'CALL',
    explanation: `Start backtracking: backtrack(start=0). Current path is empty: []. Append [] to subsets result.`,
    variables: { start: 0, path: [], result: [[]] },
    callStack: [{ functionName: 'backtrack', line: 5, args: { start: 0 }, locals: { path: [] } }],
    dataStructureState: {
      type: 'ARRAY',
      elements: nums.map((v, i) => ({ index: i, value: v, state: 'default' })),
      pointers: [{ id: 'start', name: 'Start', index: 0, color: 'blue' }]
    }
  });

  for (let i = 0; i < nums.length; i++) {
    path.push(nums[i]);
    events.push({
      stepIndex: step++,
      line: 7,
      eventType: 'PUSH_STACK',
      explanation: `Choice: Include element ${nums[i]}. Path is now [${path.join(', ')}]. Recurse deeper.`,
      variables: { i, path: [...path] },
      callStack: [{ functionName: 'backtrack', line: 7, args: { start: i + 1 }, locals: { path: [...path] } }],
      dataStructureState: {
        type: 'ARRAY',
        elements: nums.map((v, idx) => ({ index: idx, value: v, state: idx <= i ? 'active' : 'default' })),
        pointers: [{ id: 'curr', name: 'Choice', index: i, color: 'emerald' }]
      }
    });
  }

  return events;
}
