// src/lib/data/patterns.ts
import { PatternDefinition } from '@/types/curriculum.types';

export const PATTERNS: PatternDefinition[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    slug: 'two-pointers',
    shortDescription: 'Converging or parallel pointers navigating sorted arrays or palindromes in O(n) time.',
    detailedConcept: `The Two Pointers pattern utilizes two memory indices that iterate across a collection in tandem. In converging two-pointers, one pointer begins at index 0 and the other at index n-1. By comparing the elements under both pointers, we can deterministically eliminate half the search space without nested loops. In parallel two-pointers (slow/fast), pointers advance at different intervals to detect cycles or find midpoints.`,
    iconName: 'MoveHorizontal',
    timeComplexityTypical: 'O(n)',
    spaceComplexityTypical: 'O(1)',
    keyInsights: [
      'Array sorting enables monotonic decisions: if current sum < target, advance left; if > target, retreat right.',
      'Eliminates O(n^2) nested loops into a single linear O(n) pass.',
      'Saves auxiliary memory by performing computations in-place.'
    ],
    visualizerDefaultCode: `def two_sum_sorted(numbers, target):
    left = 0
    right = len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
            
    return []`,
    visualizerDefaultInputs: {
      numbers: [2, 7, 11, 15],
      target: 9
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'numbers',
          label: 'Sorted Array (numbers)',
          type: 'array_number',
          placeholder: 'e.g. 2, 7, 11, 15',
          defaultValue: [2, 7, 11, 15]
        },
        {
          key: 'target',
          label: 'Target Sum',
          type: 'number',
          placeholder: 'e.g. 9',
          defaultValue: 9
        }
      ]
    }
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    slug: 'sliding-window',
    shortDescription: 'Dynamically expanding and contracting contiguous subarrays/substrings.',
    detailedConcept: `The Sliding Window pattern is used to track and maintain an invariant across a contiguous segment of data. A right pointer expands the window to include new elements, while a left pointer contracts the window when a constraint is violated (e.g. duplicate characters or exceeding sum limits). This prevents recalculating sub-segments from scratch, reducing O(n*k) or O(n^2) complexities to O(n).`,
    iconName: 'Maximize2',
    timeComplexityTypical: 'O(n)',
    spaceComplexityTypical: 'O(k) or O(1)',
    keyInsights: [
      'Expand window with right pointer to find valid candidate solutions.',
      'Contract window with left pointer as soon as invariant/constraint is violated.',
      'Use hash maps or sets to track character frequencies inside the active window.'
    ],
    visualizerDefaultCode: `def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    left = 0
    
    for right in range(k, len(nums)):
        window_sum += nums[right] - nums[left]
        left += 1
        max_sum = max(max_sum, window_sum)
        
    return max_sum`,
    visualizerDefaultInputs: {
      nums: [2, 1, 5, 1, 3, 2],
      k: 3
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'nums',
          label: 'Array of Integers',
          type: 'array_number',
          placeholder: 'e.g. 2, 1, 5, 1, 3, 2',
          defaultValue: [2, 1, 5, 1, 3, 2]
        },
        {
          key: 'k',
          label: 'Window Size (k)',
          type: 'number',
          min: 1,
          max: 6,
          placeholder: 'e.g. 3',
          defaultValue: 3
        }
      ]
    }
  },
  {
    id: 'linked-list',
    name: 'Linked Lists',
    slug: 'linked-list',
    shortDescription: 'In-place pointer manipulation, reversals, and fast/slow pointer cycles.',
    detailedConcept: `Linked lists store nodes sequentially where each node points to its successor via a reference. Mastering linked lists requires safely mutating pointer links (.next) without losing access to downstream nodes, and using Floyd's Tortoise and Hare (Fast & Slow pointers) for cycle detection and middle node discovery in O(1) auxiliary space.`,
    iconName: 'GitCommit',
    timeComplexityTypical: 'O(n)',
    spaceComplexityTypical: 'O(1)',
    keyInsights: [
      'Always cache next_node = curr.next before mutating curr.next.',
      'Use dummy head nodes to simplify edge cases when modifying the list head.',
      'Fast pointer moves 2 steps, slow pointer moves 1 step to detect cycles or find midpoint.'
    ],
    visualizerDefaultCode: `def reverse_linked_list(head):
    prev = None
    curr = head
    
    while curr is not None:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
        
    return prev`,
    visualizerDefaultInputs: {
      values: [1, 2, 3, 4, 5]
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'values',
          label: 'Node Values in Order',
          type: 'array_number',
          placeholder: 'e.g. 1, 2, 3, 4, 5',
          defaultValue: [1, 2, 3, 4, 5]
        }
      ]
    }
  },
  {
    id: 'stack-queue',
    name: 'Stacks & Queues',
    slug: 'stack-queue',
    shortDescription: 'LIFO and FIFO data buffers with Monotonic Stack patterns for next-greater elements.',
    detailedConcept: `Stacks operate on Last-In, First-Out (LIFO) and Queues operate on First-In, First-Out (FIFO). The Monotonic Stack is an advanced pattern where stack elements are strictly maintained in increasing or decreasing order. Whenever an incoming element violates the monotonic invariant, elements are popped and processed, yielding O(n) solutions for range queries, histogram areas, and daily temperature spikes.`,
    iconName: 'Layers',
    timeComplexityTypical: 'O(n)',
    spaceComplexityTypical: 'O(n)',
    keyInsights: [
      'Monotonic decreasing stack finds Next Greater Element in O(n) total time.',
      'Stack depth correlates directly with matching parentheses or active nested scopes.',
      'Each element is pushed and popped at most once across the entire algorithm.'
    ],
    visualizerDefaultCode: `def daily_temperatures(temperatures):
    n = len(temperatures)
    answer = [0] * n
    stack = []  # indices of temperatures
    
    for curr_idx in range(n):
        curr_temp = temperatures[curr_idx]
        while stack and temperatures[stack[-1]] < curr_temp:
            prev_idx = stack.pop()
            answer[prev_idx] = curr_idx - prev_idx
        stack.append(curr_idx)
        
    return answer`,
    visualizerDefaultInputs: {
      temperatures: [73, 74, 75, 71, 69, 72, 76]
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'temperatures',
          label: 'Temperatures Array',
          type: 'array_number',
          placeholder: 'e.g. 73, 74, 75, 71, 69, 72, 76',
          defaultValue: [73, 74, 75, 71, 69, 72, 76]
        }
      ]
    }
  },
  {
    id: 'trees-bst',
    name: 'Trees & BSTs',
    slug: 'trees-bst',
    shortDescription: 'Hierarchical node traversal: DFS (Pre/In/Post-order) and BFS Level-Order.',
    detailedConcept: `Binary Trees and Binary Search Trees (BSTs) organize data hierarchically. In a BST, all nodes in the left subtree are smaller than the root, and all nodes in the right subtree are larger. Traversal techniques include Depth-First Search (DFS: pre-order, in-order, post-order via call stack) and Breadth-First Search (BFS: level-order via queue).`,
    iconName: 'BinaryTree',
    timeComplexityTypical: 'O(n)',
    spaceComplexityTypical: 'O(h) where h is tree height',
    keyInsights: [
      'In-order traversal of a valid BST always yields strictly sorted values.',
      'Recursive DFS leverages the call stack to process subtrees from the bottom up.',
      'BFS level-order traversal visits nodes layer by layer using a FIFO queue.'
    ],
    visualizerDefaultCode: `def invert_tree(root):
    if root is None:
        return None
        
    root.left, root.right = root.right, root.left
    
    invert_tree(root.left)
    invert_tree(root.right)
    
    return root`,
    visualizerDefaultInputs: {
      nodes: [4, 2, 7, 1, 3, 6, 9]
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'nodes',
          label: 'Tree Nodes in Level Order',
          type: 'array_number',
          placeholder: 'e.g. 4, 2, 7, 1, 3, 6, 9',
          defaultValue: [4, 2, 7, 1, 3, 6, 9]
        }
      ]
    }
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    slug: 'binary-search',
    shortDescription: 'Logarithmic search space reduction on sorted ranges or monotonic predicates.',
    detailedConcept: `Binary Search finds the position of a target value within a sorted array in O(log n) time. By comparing the target with the middle element, it eliminates half of the remaining elements in each step. Binary search also applies beyond sorted arrays to search on answers (monotonic boolean predicates).`,
    iconName: 'Search',
    timeComplexityTypical: 'O(log n)',
    spaceComplexityTypical: 'O(1)',
    keyInsights: [
      'Calculate mid with left + (right - left) // 2 to prevent integer overflow.',
      'Maintain clear loop invariants: left <= right vs left < right.',
      'Applicable whenever the search space possesses a monotonic (True -> False) boundary.'
    ],
    visualizerDefaultCode: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
    visualizerDefaultInputs: {
      nums: [-1, 0, 3, 5, 9, 12],
      target: 9
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'nums',
          label: 'Sorted Array (nums)',
          type: 'array_number',
          placeholder: 'e.g. -1, 0, 3, 5, 9, 12',
          defaultValue: [-1, 0, 3, 5, 9, 12]
        },
        {
          key: 'target',
          label: 'Target Value',
          type: 'number',
          placeholder: 'e.g. 9',
          defaultValue: 9
        }
      ]
    }
  },
  {
    id: 'graphs',
    name: 'Graph Traversals',
    slug: 'graphs',
    shortDescription: 'Network explorations, 2D Grid Islands, Breadth-First and Depth-First Search.',
    detailedConcept: `Graphs represent entities (vertices) and their relationships (edges). Graph traversals navigate connected components, cycle detections, and topological orderings. 2D grid matrix problems (e.g. Number of Islands, Flood Fill) represent implicit graphs where each cell connects to its 4 cardinal neighbors.`,
    iconName: 'Network',
    timeComplexityTypical: 'O(V + E) or O(R * C)',
    spaceComplexityTypical: 'O(V) visited set / queue',
    keyInsights: [
      'Always maintain a visited set or mutate cells in-place to prevent infinite cycles.',
      'BFS guarantees the shortest path in unweighted graphs.',
      'DFS is ideal for connected component counting, flood fills, and cycle detection.'
    ],
    visualizerDefaultCode: `def count_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 1:
            return
        grid[r][c] = 0  # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                islands += 1
                dfs(r, c)
                
    return islands`,
    visualizerDefaultInputs: {
      grid: [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'grid',
          label: '2D Matrix (0 = water, 1 = land)',
          type: 'matrix_number',
          placeholder: 'e.g. 4x4 matrix',
          defaultValue: [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
          ]
        }
      ]
    }
  },
  {
    id: 'dynamic-prog',
    name: 'Dynamic Programming',
    slug: 'dynamic-prog',
    shortDescription: 'Breaking problems into overlapping subproblems with memoization and tabulation grids.',
    detailedConcept: `Dynamic Programming (DP) optimizes recursive problems that exhibit Optimal Substructure and Overlapping Subproblems. By storing the results of subproblems in a 1D array or 2D table, we avoid recalculating identical states exponentially, transforming O(2^n) brute force algorithms into polynomial O(n) or O(n * m) solutions.`,
    iconName: 'Table',
    timeComplexityTypical: 'O(n) or O(n * m)',
    spaceComplexityTypical: 'O(n) or O(n * m)',
    keyInsights: [
      'Identify the subproblem state: dp[i] represents optimal solution up to index i.',
      'Formulate the state transition recurrence relation: dp[i] = min/max/sum of previous dp values.',
      'Establish base cases (e.g. dp[0] = 1, dp[1] = 1).'
    ],
    visualizerDefaultCode: `def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
        
    return dp[n]`,
    visualizerDefaultInputs: {
      n: 5
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'n',
          label: 'Number of Steps (n)',
          type: 'number',
          min: 2,
          max: 7,
          placeholder: 'e.g. 5',
          defaultValue: 5
        }
      ]
    }
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    slug: 'backtracking',
    shortDescription: 'Exhaustive combinatorial exploration: Choice, Constraint, Goal, and Undo.',
    detailedConcept: `Backtracking builds candidate solutions incrementally and abandons (backtracks) candidates as soon as it determines that they cannot lead to a valid full solution. The mental model follows the four pillars: Choice (which element to pick), Constraint (validate candidate), Goal (add to results if complete), and Undo/Backtrack (pop element from current path before exploring sibling branches).`,
    iconName: 'GitFork',
    timeComplexityTypical: 'O(2^n) or O(n!)',
    spaceComplexityTypical: 'O(n) recursion depth',
    keyInsights: [
      'Structure code around: choices -> make choice -> recurse -> unmake choice.',
      'Pruning branches early prevents exploring unviable subtrees.',
      'Pass a mutable list path and append a copy path[:] to result.'
    ],
    visualizerDefaultCode: `def subsets(nums):
    result = []
    path = []
    
    def backtrack(start):
        result.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()
            
    backtrack(0)
    return result`,
    visualizerDefaultInputs: {
      nums: [1, 2, 3]
    },
    visualizerInputSchema: {
      fields: [
        {
          key: 'nums',
          label: 'Distinct Integers (nums)',
          type: 'array_number',
          placeholder: 'e.g. 1, 2, 3',
          defaultValue: [1, 2, 3]
        }
      ]
    }
  }
];
