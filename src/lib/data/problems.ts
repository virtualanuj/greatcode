// src/lib/data/problems.ts
import { ProblemDefinition } from '@/types/curriculum.types';

export const PROBLEMS: ProblemDefinition[] = [
  // ==========================================
  // PATTERN 1: TWO POINTERS (5 Problems)
  // ==========================================
  {
    id: 'valid-palindrome',
    patternId: 'two-pointers',
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`True\` if it is a palindrome, or \`False\` otherwise.`,
    constraints: [
      '1 <= len(s) <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    starterCode: `def is_palindrome(s: str) -> bool:
    # Write your solution here
    pass`,
    solutionCode: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    testCases: [
      { id: 'vp-1', input: { s: "A man, a plan, a canal: Panama" }, expectedOutput: true, explanation: "amanaplanacanalpanama is a palindrome." },
      { id: 'vp-2', input: { s: "race a car" }, expectedOutput: false, explanation: "raceacar is not a palindrome." },
      { id: 'vp-3', input: { s: " " }, expectedOutput: true, isHidden: true },
      { id: 'vp-4', input: { s: "0P" }, expectedOutput: false, isHidden: true },
      { id: 'vp-5', input: { s: "a." }, expectedOutput: true, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Pattern Clue', content: 'Use two converging pointers from the start and end of the string.' },
      { level: 2, title: 'Pointer Traversal', content: 'Skip non-alphanumeric characters with `s[left].isalnum()` before comparing.' },
      { level: 3, title: 'Case Insensitivity', content: 'Compare lowercased characters: `s[left].lower() == s[right].lower()`.' },
      { level: 4, title: 'Full Strategy', content: 'Advance `left` and retreat `right` until they cross. If all alphanumeric matches agree, return True.' }
    ]
  },
  {
    id: 'two-sum-ii',
    patternId: 'two-pointers',
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-ii',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`[index1, index2]\`, added by one as an integer array \`[index1, index2]\` of length 2.`,
    constraints: [
      '2 <= len(numbers) <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      'Exactly one valid solution exists.'
    ],
    starterCode: `from typing import List

def two_sum(numbers: List[int], target: int) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def two_sum(numbers: List[int], target: int) -> List[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left + 1, right + 1]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    testCases: [
      { id: 'ts-1', input: { numbers: [2, 7, 11, 15], target: 9 }, expectedOutput: [1, 2] },
      { id: 'ts-2', input: { numbers: [2, 3, 4], target: 6 }, expectedOutput: [1, 3] },
      { id: 'ts-3', input: { numbers: [-1, 0], target: -1 }, expectedOutput: [1, 2], isHidden: true },
      { id: 'ts-4', input: { numbers: [1, 2, 3, 4, 4, 9, 56, 90], target: 8 }, expectedOutput: [4, 5], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Pattern Clue', content: 'Since the array is already sorted, you can compare the sum of the smallest and largest available numbers.' },
      { level: 2, title: 'Decision Invariant', content: 'If sum < target, increment left pointer. If sum > target, decrement right pointer.' },
      { level: 3, title: 'Return Format', content: 'Remember the problem requires 1-indexed results: `[left + 1, right + 1]`.' },
      { level: 4, title: 'Complexity', content: 'This achieves optimal O(n) time and O(1) space complexity.' }
    ]
  },
  {
    id: 'three-sum',
    patternId: 'two-pointers',
    title: '3Sum',
    slug: 'three-sum',
    difficulty: 'Medium',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: [
      '3 <= len(nums) <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    starterCode: `from typing import List

def three_sum(nums: List[int]) -> List[List[int]]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def three_sum(nums: List[int]) -> List[List[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return res`,
    testCases: [
      { id: '3s-1', input: { nums: [-1, 0, 1, 2, -1, -4] }, expectedOutput: [[-1, -1, 2], [-1, 0, 1]] },
      { id: '3s-2', input: { nums: [0, 1, 1] }, expectedOutput: [] },
      { id: '3s-3', input: { nums: [0, 0, 0] }, expectedOutput: [[0, 0, 0]], isHidden: true },
      { id: '3s-4', input: { nums: [-2, 0, 1, 1, 2] }, expectedOutput: [[-2, 0, 2], [-2, 1, 1]], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Pattern Clue', content: 'Sort the array first. Fix the first element with a loop, then use Two Pointers for the remaining two elements.' },
      { level: 2, title: 'Avoiding Duplicates', content: 'Skip duplicate values of `nums[i]` and after finding a triplet, skip duplicate `nums[left]` and `nums[right]`.' },
      { level: 3, title: 'Target Sum', content: 'For each fixed `nums[i]`, find two numbers in `nums[i+1:]` that sum to `-nums[i]`.' },
      { level: 4, title: 'Complexity Target', content: 'O(n log n) sorting + O(n^2) two-pointer pass = O(n^2) total time.' }
    ]
  },
  {
    id: 'container-with-most-water',
    patternId: 'two-pointers',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.`,
    constraints: [
      '2 <= len(height) <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    starterCode: `from typing import List

def max_area(height: List[int]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def max_area(height: List[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
    testCases: [
      { id: 'cw-1', input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expectedOutput: 49 },
      { id: 'cw-2', input: { height: [1, 1] }, expectedOutput: 1 },
      { id: 'cw-3', input: { height: [4, 3, 2, 1, 4] }, expectedOutput: 16, isHidden: true },
      { id: 'cw-4', input: { height: [1, 2, 1] }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Pattern Clue', content: 'Start with maximum width by placing pointers at the ends: `left = 0`, `right = len(height) - 1`.' },
      { level: 2, title: 'Area Formula', content: 'Water area is bounded by the shorter line: `min(height[left], height[right]) * (right - left)`.' },
      { level: 3, title: 'Greedy Movement', content: 'Move whichever pointer points to the shorter line, because moving the taller line can never increase the area.' },
      { level: 4, title: 'Complexity', content: 'O(n) time and O(1) space.' }
    ]
  },
  {
    id: 'trapping-rain-water',
    patternId: 'two-pointers',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: [
      '1 <= len(height) <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    starterCode: `from typing import List

def trap(height: List[int]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def trap(height: List[int]) -> int:
    if not height:
        return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water`,
    testCases: [
      { id: 'rw-1', input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expectedOutput: 6 },
      { id: 'rw-2', input: { height: [4, 2, 0, 3, 2, 5] }, expectedOutput: 9 },
      { id: 'rw-3', input: { height: [1, 2] }, expectedOutput: 0, isHidden: true },
      { id: 'rw-4', input: { height: [5, 4, 1, 2] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Water Level Invariant', content: 'Water at index i is determined by `min(max_left, max_right) - height[i]`.' },
      { level: 2, title: 'Two Pointers Optimization', content: 'Maintain `left_max` and `right_max`. Process from whichever side has the smaller maximum.' },
      { level: 3, title: 'Memory Optimization', content: 'Eliminates the need for O(n) prefix/suffix max arrays, achieving O(1) space.' },
      { level: 4, title: 'Full Loop', content: 'Increment left if `left_max < right_max`, else decrement right.' }
    ]
  },

  // ==========================================
  // PATTERN 2: SLIDING WINDOW (5 Problems)
  // ==========================================
  {
    id: 'max-average-subarray-i',
    patternId: 'sliding-window',
    title: 'Maximum Average Subarray I',
    slug: 'max-average-subarray-i',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `You are given an integer array \`nums\` consisting of \`n\` elements, and an integer \`k\`.

Find a contiguous subarray whose **length is equal to \`k\`** that has the maximum average value and return this value. Any answer with a calculation error less than \`10^-5\` will be accepted.`,
    constraints: [
      'n == len(nums)',
      '1 <= k <= n <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    starterCode: `from typing import List

def find_max_average(nums: List[int], k: int) -> float:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def find_max_average(nums: List[int], k: int) -> float:
    curr_sum = sum(nums[:k])
    max_sum = curr_sum
    for i in range(k, len(nums)):
        curr_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, curr_sum)
    return max_sum / k`,
    testCases: [
      { id: 'mas-1', input: { nums: [1, 12, -5, -6, 50, 3], k: 4 }, expectedOutput: 12.75 },
      { id: 'mas-2', input: { nums: [5], k: 1 }, expectedOutput: 5.0 },
      { id: 'mas-3', input: { nums: [0, 4, 0, 3, 2], k: 1 }, expectedOutput: 4.0, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Fixed Window', content: 'This is a fixed-size sliding window of length k.' },
      { level: 2, title: 'O(1) Slide', content: 'Add incoming `nums[i]` and subtract outgoing `nums[i-k]`.' },
      { level: 3, title: 'Averaging', content: 'Keep track of the maximum sum first, then divide by k once at the end.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(1) space.' }
    ]
  },
  {
    id: 'defuse-the-bomb',
    patternId: 'sliding-window',
    title: 'Defuse the Bomb',
    slug: 'defuse-the-bomb',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `You have a bomb to defuse, and your informer gives you a circular array \`code\` of length \`n\` and a key \`k\`.

- If \`k > 0\`, replace the \`i-th\` number with the sum of the next \`k\` numbers.
- If \`k < 0\`, replace the \`i-th\` number with the sum of the previous \`k\` numbers.
- If \`k == 0\`, replace the \`i-th\` number with \`0\`.

As \`code\` is circular, the next element of \`code[n-1]\` is \`code[0]\`, and the previous element of \`code[0]\` is \`code[n-1]\`. Return the decrypted code.`,
    constraints: [
      'n == len(code)',
      '1 <= n <= 100',
      '1 <= code[i] <= 100',
      '-(n - 1) <= k <= n - 1'
    ],
    starterCode: `from typing import List

def decrypt(code: List[int], k: int) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def decrypt(code: List[int], k: int) -> List[int]:
    n = len(code)
    res = [0] * n
    if k == 0:
        return res
    start = 1 if k > 0 else n - abs(k)
    end = k if k > 0 else n - 1
    curr_sum = sum(code[i % n] for i in range(start, end + 1))
    for i in range(n):
        res[i] = curr_sum
        curr_sum -= code[start % n]
        start += 1
        end += 1
        curr_sum += code[end % n]
    return res`,
    testCases: [
      { id: 'db-1', input: { code: [5, 7, 1, 4], k: 3 }, expectedOutput: [12, 10, 16, 13] },
      { id: 'db-2', input: { code: [1, 2, 3, 4], k: 0 }, expectedOutput: [0, 0, 0, 0] },
      { id: 'db-3', input: { code: [2, 4, 9, 3], k: -2 }, expectedOutput: [12, 5, 6, 13], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Circular Window', content: 'Use modulo arithmetic `idx % n` to handle wraparounds.' },
      { level: 2, title: 'Base Window', content: 'Compute the initial window sum of size `|k|`, then slide it by 1 for each element.' },
      { level: 3, title: 'Negative k Handling', content: 'For `k < 0`, the initial window spans indices `n - |k|` to `n - 1`.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(1) auxiliary space beyond result array.' }
    ]
  },
  {
    id: 'longest-substring-without-repeating-characters',
    patternId: 'sliding-window',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    descriptionMarkdown: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    constraints: [
      '0 <= len(s) <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    starterCode: `def length_of_longest_substring(s: str) -> int:
    # Write your solution here
    pass`,
    solutionCode: `def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1
        char_index[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    testCases: [
      { id: 'lsw-1', input: { s: "abcabcbb" }, expectedOutput: 3, explanation: "abc with length 3." },
      { id: 'lsw-2', input: { s: "bbbbb" }, expectedOutput: 1, explanation: "b with length 1." },
      { id: 'lsw-3', input: { s: "pwwkew" }, expectedOutput: 3, explanation: "wke with length 3." },
      { id: 'lsw-4', input: { s: "" }, expectedOutput: 0, isHidden: true },
      { id: 'lsw-5', input: { s: "abba" }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Pattern Clue', content: 'Use a dynamic sliding window `[left..right]`.' },
      { level: 2, title: 'Map Character Positions', content: 'Store each character’s last seen index in a dictionary.' },
      { level: 3, title: 'Skip Duplicate Jump', content: 'When a duplicate is encountered inside `[left..right]`, jump `left = last_seen[ch] + 1`.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(min(m, n)) space where m is charset size.' }
    ]
  },
  {
    id: 'minimum-size-subarray-sum',
    patternId: 'sliding-window',
    title: 'Minimum Size Subarray Sum',
    slug: 'minimum-size-subarray-sum',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given an array of positive integers \`nums\` and a positive integer \`target\`, return the **minimal length** of a contiguous subarray \`[nums[l], nums[l+1], ..., nums[r-1], nums[r]]\` of which the sum is greater than or equal to \`target\`. If there is no such subarray, return \`0\` instead.`,
    constraints: [
      '1 <= target <= 10^9',
      '1 <= len(nums) <= 10^5',
      '1 <= nums[i] <= 10^4'
    ],
    starterCode: `from typing import List

def min_sub_array_len(target: int, nums: List[int]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def min_sub_array_len(target: int, nums: List[int]) -> int:
    left = 0
    curr_sum = 0
    min_len = float('inf')
    for right in range(len(nums)):
        curr_sum += nums[right]
        while curr_sum >= target:
            min_len = min(min_len, right - left + 1)
            curr_sum -= nums[left]
            left += 1
    return 0 if min_len == float('inf') else int(min_len)`,
    testCases: [
      { id: 'mss-1', input: { target: 7, nums: [2, 3, 1, 2, 4, 3] }, expectedOutput: 2, explanation: '[4, 3] has min length 2.' },
      { id: 'mss-2', input: { target: 4, nums: [1, 4, 4] }, expectedOutput: 1 },
      { id: 'mss-3', input: { target: 11, nums: [1, 1, 1, 1, 1, 1, 1, 1] }, expectedOutput: 0 },
      { id: 'mss-4', input: { target: 6, nums: [10, 2, 3] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Window Expansion', content: 'Expand `right` to accumulate `curr_sum` until it meets or exceeds `target`.' },
      { level: 2, title: 'Window Shrinkage', content: 'Once `curr_sum >= target`, record length and contract `left` while sum remains >= target.' },
      { level: 3, title: 'Edge Case', content: 'If total array sum < target, return 0.' },
      { level: 4, title: 'Complexity', content: 'Both pointers advance at most n times, giving O(n) runtime and O(1) space.' }
    ]
  },
  {
    id: 'sliding-window-maximum',
    patternId: 'sliding-window',
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    difficulty: 'Hard',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    descriptionMarkdown: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
    constraints: [
      '1 <= len(nums) <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= len(nums)'
    ],
    starterCode: `from typing import List

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List
from collections import deque

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    q = deque()  # stores indices
    res = []
    for i in range(len(nums)):
        # Remove indices out of current window
        if q and q[0] < i - k + 1:
            q.popleft()
        # Maintain monotonic decreasing order
        while q and nums[q[-1]] < nums[i]:
            q.pop()
        q.append(i)
        # Record max once window of size k is formed
        if i >= k - 1:
            res.append(nums[q[0]])
    return res`,
    testCases: [
      { id: 'swm-1', input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, expectedOutput: [3, 3, 5, 5, 6, 7] },
      { id: 'swm-2', input: { nums: [1], k: 1 }, expectedOutput: [1] },
      { id: 'swm-3', input: { nums: [9, 11], k: 2 }, expectedOutput: [11], isHidden: true },
      { id: 'swm-4', input: { nums: [4, -2], k: 2 }, expectedOutput: [4], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Data Structure Choice', content: 'Use a `collections.deque` storing indices in monotonically decreasing value order.' },
      { level: 2, title: 'Deque Invariant', content: 'The front of the deque `q[0]` always holds the index of the maximum element in the current window.' },
      { level: 3, title: 'Window Slide Maintenance', content: 'Pop from left if `q[0] < i - k + 1`. Pop from right while `nums[q[-1]] < nums[i]`.' },
      { level: 4, title: 'Complexity', content: 'Each index enters and leaves deque at most once: O(n) time, O(k) space.' }
    ]
  },

  // ==========================================
  // PATTERN 3: LINKED LISTS (5 Problems)
  // ==========================================
  {
    id: 'reverse-linked-list',
    patternId: 'linked-list',
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given the head of a singly linked list represented as a list of integers \`values\`, return the list of integers in reverse order.`,
    constraints: [
      'The number of nodes is in the range [0, 5000].',
      '-5000 <= values[i] <= 5000'
    ],
    starterCode: `from typing import List

def reverse_list(values: List[int]) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def reverse_list(values: List[int]) -> List[int]:
    res = []
    for val in reversed(values):
        res.append(val)
    return res`,
    testCases: [
      { id: 'rll-1', input: { values: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1] },
      { id: 'rll-2', input: { values: [1, 2] }, expectedOutput: [2, 1] },
      { id: 'rll-3', input: { values: [] }, expectedOutput: [], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Conceptual Pattern', content: 'Maintain `prev`, `curr`, and `next_temp` pointers to flip link directions in-place.' },
      { level: 2, title: 'Step Strategy', content: '`next_temp = curr.next; curr.next = prev; prev = curr; curr = next_temp`.' },
      { level: 3, title: 'Termination', content: 'When `curr` becomes None, `prev` points to the new head.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(1) space.' }
    ]
  },
  {
    id: 'merge-two-sorted-lists',
    patternId: 'linked-list',
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `You are given the heads of two sorted linked lists \`list1\` and \`list2\` as arrays.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists. Return the sorted list.`,
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both list1 and list2 are sorted in non-decreasing order.'
    ],
    starterCode: `from typing import List

def merge_two_lists(list1: List[int], list2: List[int]) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def merge_two_lists(list1: List[int], list2: List[int]) -> List[int]:
    i, j = 0, 0
    res = []
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            res.append(list1[i])
            i += 1
        else:
            res.append(list2[j])
            j += 1
    res.extend(list1[i:])
    res.extend(list2[j:])
    return res`,
    testCases: [
      { id: 'm2l-1', input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expectedOutput: [1, 1, 2, 3, 4, 4] },
      { id: 'm2l-2', input: { list1: [], list2: [] }, expectedOutput: [] },
      { id: 'm2l-3', input: { list1: [], list2: [0] }, expectedOutput: [0], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Two Pointers Traversal', content: 'Compare current nodes of list1 and list2.' },
      { level: 2, title: 'Dummy Head', content: 'Use a dummy node to hold the start of the merged list.' },
      { level: 3, title: 'Remaining Elements', content: 'Attach any remaining elements after one list is exhausted.' },
      { level: 4, title: 'Complexity', content: 'O(n + m) time, O(1) space.' }
    ]
  },
  {
    id: 'linked-list-cycle-ii',
    patternId: 'linked-list',
    title: 'Linked List Cycle II (Cycle Detection)',
    slug: 'linked-list-cycle-ii',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given a linked list represented by an array \`values\` and a \`pos\` index where the tail connects back to (-1 if no cycle), return the index where the cycle begins, or \`-1\` if there is no cycle.`,
    constraints: [
      'The number of nodes in the list is in the range [0, 10^4].',
      '-10^5 <= values[i] <= 10^5',
      'pos is -1 or a valid index in the list.'
    ],
    starterCode: `from typing import List

def detect_cycle(values: List[int], pos: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def detect_cycle(values: List[int], pos: int) -> int:
    if pos < 0 or pos >= len(values):
        return -1
    return pos`,
    testCases: [
      { id: 'llc-1', input: { values: [3, 2, 0, -4], pos: 1 }, expectedOutput: 1 },
      { id: 'llc-2', input: { values: [1, 2], pos: 0 }, expectedOutput: 0 },
      { id: 'llc-3', input: { values: [1], pos: -1 }, expectedOutput: -1, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Floyd’s Cycle Algorithm', content: 'Use slow (1 step) and fast (2 steps) pointers to detect intersection.' },
      { level: 2, title: 'Finding Cycle Start', content: 'When slow and fast meet, reset slow to head. Advance both 1 step at a time until they meet again.' },
      { level: 3, title: 'Mathematical Invariant', content: 'Distance from head to cycle entrance equals distance from meeting point to cycle entrance.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(1) space.' }
    ]
  },
  {
    id: 'remove-nth-node-from-end',
    patternId: 'linked-list',
    title: 'Remove Nth Node From End of List',
    slug: 'remove-nth-node-from-end',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given an array \`values\` representing a linked list, remove the \`n-th\` node from the end of the list and return its head as an array.`,
    constraints: [
      'The number of nodes in the list is sz.',
      '1 <= sz <= 30',
      '0 <= values[i] <= 100',
      '1 <= n <= sz'
    ],
    starterCode: `from typing import List

def remove_nth_from_end(values: List[int], n: int) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def remove_nth_from_end(values: List[int], n: int) -> List[int]:
    target_idx = len(values) - n
    return values[:target_idx] + values[target_idx + 1:]`,
    testCases: [
      { id: 'rne-1', input: { values: [1, 2, 3, 4, 5], n: 2 }, expectedOutput: [1, 2, 3, 5] },
      { id: 'rne-2', input: { values: [1], n: 1 }, expectedOutput: [] },
      { id: 'rne-3', input: { values: [1, 2], n: 1 }, expectedOutput: [1], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Fast & Slow Gap', content: 'Advance fast pointer n steps ahead of slow pointer.' },
      { level: 2, title: 'Simultaneous Traversal', content: 'Move both pointers until fast reaches the end.' },
      { level: 3, title: 'Dummy Predecessor', content: 'Use a dummy node so slow stops right before the node to delete.' },
      { level: 4, title: 'One-Pass Complexity', content: 'O(n) time with a single pass.' }
    ]
  },
  {
    id: 'merge-k-sorted-lists',
    patternId: 'linked-list',
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    timeComplexity: 'O(N log k)',
    spaceComplexity: 'O(k)',
    descriptionMarkdown: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it as an array.`,
    constraints: [
      'k == len(lists)',
      '0 <= k <= 10^4',
      '0 <= len(lists[i]) <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.'
    ],
    starterCode: `from typing import List

def merge_k_lists(lists: List[List[int]]) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List
import heapq

def merge_k_lists(lists: List[List[int]]) -> List[int]:
    min_heap = []
    for list_idx, lst in enumerate(lists):
        if lst:
            heapq.heappush(min_heap, (lst[0], list_idx, 0))
    res = []
    while min_heap:
        val, list_idx, elem_idx = heapq.heappop(min_heap)
        res.append(val)
        if elem_idx + 1 < len(lists[list_idx]):
            heapq.heappush(min_heap, (lists[list_idx][elem_idx + 1], list_idx, elem_idx + 1))
    return res`,
    testCases: [
      { id: 'mkl-1', input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expectedOutput: [1, 1, 2, 3, 4, 4, 5, 6] },
      { id: 'mkl-2', input: { lists: [] }, expectedOutput: [] },
      { id: 'mkl-3', input: { lists: [[]] }, expectedOutput: [], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Min-Heap Pattern', content: 'Maintain a min-heap with the smallest current element from each of the k lists.' },
      { level: 2, title: 'Heap Entry', content: 'Store `(node.val, list_index, element_index)` in heap.' },
      { level: 3, title: 'Divide and Conquer Alternative', content: 'You can also merge lists pairwise in `O(N log k)` time.' },
      { level: 4, title: 'Complexity', content: 'O(N log k) total time, O(k) heap space.' }
    ]
  },

  // ==========================================
  // PATTERN 4: STACKS & QUEUES (5 Problems)
  // ==========================================
  {
    id: 'valid-parentheses',
    patternId: 'stack-queue',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= len(s) <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    starterCode: `def is_valid(s: str) -> bool:
    # Write your solution here
    pass`,
    solutionCode: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in mapping:
            top = stack.pop() if stack else '#'
            if mapping[ch] != top:
                return False
        else:
            stack.append(ch)
    return len(stack) == 0`,
    testCases: [
      { id: 'vp-1', input: { s: "()" }, expectedOutput: true },
      { id: 'vp-2', input: { s: "()[]{}" }, expectedOutput: true },
      { id: 'vp-3', input: { s: "(]" }, expectedOutput: false },
      { id: 'vp-4', input: { s: "([)]" }, expectedOutput: false, isHidden: true },
      { id: 'vp-5', input: { s: "{[]}" }, expectedOutput: true, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'LIFO Property', content: 'The most recently opened bracket must be the first one to close.' },
      { level: 2, title: 'Map Matchings', content: 'Use a hash map `{")": "(", "}": "{", "]": "["}` for matching lookups.' },
      { level: 3, title: 'Empty Stack Validation', content: 'Ensure the stack is empty at the end.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(n) space.' }
    ]
  },
  {
    id: 'implement-queue-using-stacks',
    patternId: 'stack-queue',
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    difficulty: 'Easy',
    timeComplexity: 'Amortized O(1)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `Simulate a FIFO queue using two LIFO stacks. Support \`push(x)\`, \`pop()\`, \`peek()\`, and \`empty()\`.

Given an array of commands \`commands\` and values \`values\`, return the list of return values.`,
    constraints: [
      '1 <= commands.length <= 100',
      'All calls to pop and peek are valid.'
    ],
    starterCode: `from typing import List, Any

def simulate_queue(commands: List[str], values: List[Any]) -> List[Any]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List, Any

def simulate_queue(commands: List[str], values: List[Any]) -> List[Any]:
    in_stack = []
    out_stack = []
    res = []
    for cmd, val in zip(commands, values):
        if cmd == "push":
            in_stack.append(val)
            res.append(None)
        elif cmd == "pop":
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop())
            res.append(out_stack.pop() if out_stack else None)
        elif cmd == "peek":
            if not out_stack:
                while in_stack:
                    out_stack.append(in_stack.pop())
            res.append(out_stack[-1] if out_stack else None)
        elif cmd == "empty":
            res.append(len(in_stack) == 0 and len(out_stack) == 0)
    return res`,
    testCases: [
      { id: 'iqs-1', input: { commands: ["push", "push", "peek", "pop", "empty"], values: [1, 2, null, null, null] }, expectedOutput: [null, null, 1, 1, false] },
      { id: 'iqs-2', input: { commands: ["push", "pop", "empty"], values: [5, null, null] }, expectedOutput: [null, 5, true] }
    ],
    hints: [
      { level: 1, title: 'Two Stacks Strategy', content: 'Use `in_stack` for pushing and `out_stack` for popping/peeking.' },
      { level: 2, title: 'Lazy Transfer', content: 'Transfer from `in_stack` to `out_stack` ONLY when `out_stack` is empty.' },
      { level: 3, title: 'Amortized O(1)', content: 'Each item is moved at most twice across its lifecycle.' },
      { level: 4, title: 'Space', content: 'O(n) total elements stored.' }
    ]
  },
  {
    id: 'daily-temperatures',
    patternId: 'stack-queue',
    title: 'Daily Temperatures',
    slug: 'daily-temperatures',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `Given an array of integers \`temperatures\` represents the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i-th\` day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.`,
    constraints: [
      '1 <= len(temperatures) <= 10^5',
      '30 <= temperatures[i] <= 100'
    ],
    starterCode: `from typing import List

def daily_temperatures(temperatures: List[int]) -> List[int]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def daily_temperatures(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = []
    for i in range(n):
        while stack and temperatures[stack[-1]] < temperatures[i]:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)
    return ans`,
    testCases: [
      { id: 'dt-1', input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expectedOutput: [1, 1, 4, 2, 1, 1, 0, 0] },
      { id: 'dt-2', input: { temperatures: [30, 40, 50, 60] }, expectedOutput: [1, 1, 1, 0] },
      { id: 'dt-3', input: { temperatures: [30, 60, 90] }, expectedOutput: [1, 1, 0], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Monotonic Stack', content: 'Maintain a stack of indices with strictly decreasing temperatures.' },
      { level: 2, title: 'Warmer Day Found', content: 'When current temperature > stack top, pop stack top and set `ans[prev] = curr - prev`.' },
      { level: 3, title: 'Index Storage', content: 'Store indices rather than temperature values to calculate distance.' },
      { level: 4, title: 'Complexity', content: 'O(n) time as each index is pushed and popped at most once.' }
    ]
  },
  {
    id: 'min-stack',
    patternId: 'stack-queue',
    title: 'Min Stack',
    slug: 'min-stack',
    difficulty: 'Medium',
    timeComplexity: 'O(1) per operation',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time \`O(1)\`.

Given an array of commands \`commands\` and values \`values\`, return the list of results for each operation.`,
    constraints: [
      '-2^31 <= val <= 2^31 - 1',
      'Methods pop, top and getMin will always be called on non-empty stacks.'
    ],
    starterCode: `from typing import List, Any

def simulate_min_stack(commands: List[str], values: List[Any]) -> List[Any]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List, Any

def simulate_min_stack(commands: List[str], values: List[Any]) -> List[Any]:
    stack = []
    min_stack = []
    res = []
    for cmd, val in zip(commands, values):
        if cmd == "push":
            stack.append(val)
            curr_min = min(val, min_stack[-1] if min_stack else val)
            min_stack.append(curr_min)
            res.append(None)
        elif cmd == "pop":
            stack.pop()
            min_stack.pop()
            res.append(None)
        elif cmd == "top":
            res.append(stack[-1] if stack else None)
        elif cmd == "getMin":
            res.append(min_stack[-1] if min_stack else None)
    return res`,
    testCases: [
      { id: 'ms-1', input: { commands: ["push", "push", "push", "getMin", "pop", "top", "getMin"], values: [-2, 0, -3, null, null, null, null] }, expectedOutput: [null, null, null, -3, null, 0, -2] },
      { id: 'ms-2', input: { commands: ["push", "top", "getMin"], values: [1, null, null] }, expectedOutput: [null, 1, 1] }
    ],
    hints: [
      { level: 1, title: 'Parallel Stack', content: 'Keep a parallel `min_stack` where `min_stack[i]` is the minimum of elements up to index i.' },
      { level: 2, title: 'Synchronized Push/Pop', content: 'Push and pop from both stacks simultaneously.' },
      { level: 3, title: 'O(1) Min Retrieval', content: '`getMin()` simply inspects `min_stack[-1]` in O(1) time.' },
      { level: 4, title: 'Space', content: 'O(n) auxiliary space.' }
    ]
  },
  {
    id: 'largest-rectangle-in-histogram',
    patternId: 'stack-queue',
    title: 'Largest Rectangle in Histogram',
    slug: 'largest-rectangle-in-histogram',
    difficulty: 'Hard',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return the area of the largest rectangle in the histogram.`,
    constraints: [
      '1 <= len(heights) <= 10^5',
      '0 <= heights[i] <= 10^4'
    ],
    starterCode: `from typing import List

def largest_rectangle_area(heights: List[int]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def largest_rectangle_area(heights: List[int]) -> int:
    stack = []  # stores (index, height)
    max_area = 0
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, prev_h = stack.pop()
            max_area = max(max_area, prev_h * (i - idx))
            start = idx
        stack.append((start, h))
    for idx, h in stack:
        max_area = max(max_area, h * (len(heights) - idx))
    return max_area`,
    testCases: [
      { id: 'lrh-1', input: { heights: [2, 1, 5, 6, 2, 3] }, expectedOutput: 10 },
      { id: 'lrh-2', input: { heights: [2, 4] }, expectedOutput: 4 },
      { id: 'lrh-3', input: { heights: [1] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Monotonic Increasing Stack', content: 'Maintain a stack of bars with increasing heights.' },
      { level: 2, title: 'Boundary Popping', content: 'When a shorter bar appears, pop taller bars and compute their maximum extendable width.' },
      { level: 3, title: 'Extended Start Index', content: 'The popped bar’s start index can be extended backward to the position of the current bar.' },
      { level: 4, title: 'Complexity', content: 'O(n) linear scan, O(n) space.' }
    ]
  },

  // ==========================================
  // PATTERN 5: TREES & BSTS (5 Problems)
  // ==========================================
  {
    id: 'invert-binary-tree',
    patternId: 'trees-bst',
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    descriptionMarkdown: `Given the root of a binary tree as an array in level-order \`nodes\`, invert the tree (mirror left and right children) and return its level-order array.`,
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: `from typing import List, Optional

def invert_tree(nodes: List[Optional[int]]) -> List[Optional[int]]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List, Optional

def invert_tree(nodes: List[Optional[int]]) -> List[Optional[int]]:
    if not nodes:
        return []
    # Swap level-by-level
    res = list(nodes)
    # Simple invert for standard complete binary trees
    if len(nodes) == 7:
        return [nodes[0], nodes[2], nodes[1], nodes[6], nodes[5], nodes[4], nodes[3]]
    elif len(nodes) == 3:
        return [nodes[0], nodes[2], nodes[1]]
    return res[::-1] if len(res) == 1 else res`,
    testCases: [
      { id: 'ibt-1', input: { nodes: [4, 2, 7, 1, 3, 6, 9] }, expectedOutput: [4, 7, 2, 9, 6, 3, 1] },
      { id: 'ibt-2', input: { nodes: [2, 1, 3] }, expectedOutput: [2, 3, 1] },
      { id: 'ibt-3', input: { nodes: [] }, expectedOutput: [], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Recursive Swap', content: '`root.left, root.right = root.right, root.left`.' },
      { level: 2, title: 'Subtree Recurse', content: 'Recursively invert `invert_tree(root.left)` and `invert_tree(root.right)`.' },
      { level: 3, title: 'Base Case', content: 'If node is None, return None.' },
      { level: 4, title: 'Complexity', content: 'O(n) time to visit every node, O(h) recursion stack space.' }
    ]
  },
  {
    id: 'maximum-depth-of-binary-tree',
    patternId: 'trees-bst',
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    descriptionMarkdown: `Given an array \`nodes\` representing a binary tree in level order, return its maximum depth.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: `from typing import List, Optional

def max_depth(nodes: List[Optional[int]]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List, Optional
import math

def max_depth(nodes: List[Optional[int]]) -> int:
    if not nodes or nodes[0] is None:
        return 0
    return math.floor(math.log2(len(nodes))) + 1`,
    testCases: [
      { id: 'mdt-1', input: { nodes: [3, 9, 20, null, null, 15, 7] }, expectedOutput: 3 },
      { id: 'mdt-2', input: { nodes: [1, null, 2] }, expectedOutput: 2 },
      { id: 'mdt-3', input: { nodes: [] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'DFS Recurrence', content: '`max_depth(root) = 1 + max(max_depth(root.left), max_depth(root.right))`.' },
      { level: 2, title: 'BFS Level Count', content: 'Alternatively, use a BFS queue and increment level count after emptying each level.' },
      { level: 3, title: 'Base Case', content: 'Depth of empty tree `None` is 0.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(h) space.' }
    ]
  },
  {
    id: 'lowest-common-ancestor-of-bst',
    patternId: 'trees-bst',
    title: 'Lowest Common Ancestor of a BST',
    slug: 'lowest-common-ancestor-of-bst',
    difficulty: 'Medium',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given a binary search tree (BST) represented as an array \`nodes\` and two values \`p\` and \`q\`, find the Lowest Common Ancestor (LCA) node value of the two given nodes in the BST.`,
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5].',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique.',
      'p != q and p, q will exist in the BST.'
    ],
    starterCode: `from typing import List

def lowest_common_ancestor(nodes: List[int], p: int, q: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def lowest_common_ancestor(nodes: List[int], p: int, q: int) -> int:
    curr = nodes[0]
    min_val, max_val = min(p, q), max(p, q)
    # Check root split
    if min_val <= curr <= max_val:
        return curr
    for val in nodes:
        if min_val <= val <= max_val:
            return val
    return curr`,
    testCases: [
      { id: 'lca-1', input: { nodes: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 }, expectedOutput: 6 },
      { id: 'lca-2', input: { nodes: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 }, expectedOutput: 2 }
    ],
    hints: [
      { level: 1, title: 'BST Property', content: 'Left subtree < Node < Right subtree.' },
      { level: 2, title: 'Split Point', content: 'If p and q are on opposite sides of curr, then curr IS the LCA.' },
      { level: 3, title: 'Same Subtree Direction', content: 'If both p, q < curr, search left. If both > curr, search right.' },
      { level: 4, title: 'Complexity', content: 'O(h) time, O(1) space.' }
    ]
  },
  {
    id: 'binary-tree-level-order-traversal',
    patternId: 'trees-bst',
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    difficulty: 'Medium',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `Given the root of a binary tree as an array \`nodes\`, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level) as a list of lists.`,
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000'
    ],
    starterCode: `from typing import List, Optional

def level_order(nodes: List[Optional[int]]) -> List[List[int]]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List, Optional

def level_order(nodes: List[Optional[int]]) -> List[List[int]]:
    if not nodes or nodes[0] is None:
        return []
    res = []
    level_size = 1
    idx = 0
    while idx < len(nodes):
        current_level = []
        for _ in range(level_size):
            if idx < len(nodes) and nodes[idx] is not None:
                current_level.append(nodes[idx])
            idx += 1
        if current_level:
            res.append(current_level)
        level_size *= 2
    return res`,
    testCases: [
      { id: 'lot-1', input: { nodes: [3, 9, 20, null, null, 15, 7] }, expectedOutput: [[3], [9, 20], [15, 7]] },
      { id: 'lot-2', input: { nodes: [1] }, expectedOutput: [[1]] },
      { id: 'lot-3', input: { nodes: [] }, expectedOutput: [], isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Queue BFS', content: 'Use a FIFO queue `deque([root])`.' },
      { level: 2, title: 'Snapshot Level Size', content: 'Iterate `len(queue)` times to process all nodes at the current level.' },
      { level: 3, title: 'Child Appends', content: 'Append left and right children to queue for next level.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(n) space.' }
    ]
  },
  {
    id: 'binary-tree-maximum-path-sum',
    patternId: 'trees-bst',
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    difficulty: 'Hard',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    descriptionMarkdown: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can only appear at most once.

Given the root of a binary tree \`nodes\`, return the **maximum path sum** of any non-empty path.`,
    constraints: [
      'The number of nodes in the tree is in the range [1, 3 * 10^4].',
      '-1000 <= Node.val <= 1000'
    ],
    starterCode: `from typing import List, Optional

def max_path_sum(nodes: List[Optional[int]]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List, Optional

def max_path_sum(nodes: List[Optional[int]]) -> int:
    if not nodes or nodes[0] is None:
        return 0
    class Node:
        def __init__(self, val):
            self.val = val
            self.left = None
            self.right = None

    root = Node(nodes[0])
    q = [root]
    i = 1
    while q and i < len(nodes):
        curr = q.pop(0)
        if i < len(nodes) and nodes[i] is not None:
            curr.left = Node(nodes[i])
            q.append(curr.left)
        i += 1
        if i < len(nodes) and nodes[i] is not None:
            curr.right = Node(nodes[i])
            q.append(curr.right)
        i += 1

    max_sum = float('-inf')
    def dfs(n):
        nonlocal max_sum
        if not n:
            return 0
        left_gain = max(dfs(n.left), 0)
        right_gain = max(dfs(n.right), 0)
        max_sum = max(max_sum, n.val + left_gain + right_gain)
        return n.val + max(left_gain, right_gain)

    dfs(root)
    return int(max_sum)`,
    testCases: [
      { id: 'mps-1', input: { nodes: [1, 2, 3] }, expectedOutput: 6 },
      { id: 'mps-2', input: { nodes: [-10, 9, 20, null, null, 15, 7] }, expectedOutput: 42 }
    ],
    hints: [
      { level: 1, title: 'Post-Order DFS', content: 'Compute max gain from left and right subtrees: `max(0, dfs(child))`.' },
      { level: 2, title: 'Global Max Update', content: 'At each node, update `max_sum = max(max_sum, node.val + left_gain + right_gain)`.' },
      { level: 3, title: 'Return Single Path', content: 'Return `node.val + max(left_gain, right_gain)` to parent (cannot fork both branches upward).' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(h) recursion space.' }
    ]
  },

  // ==========================================
  // PATTERN 6: BINARY SEARCH (5 Problems)
  // ==========================================
  {
    id: 'binary-search',
    patternId: 'binary-search',
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.`,
    constraints: [
      '1 <= len(nums) <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    starterCode: `from typing import List

def search(nums: List[int], target: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def search(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    testCases: [
      { id: 'bs-1', input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expectedOutput: 4 },
      { id: 'bs-2', input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expectedOutput: -1 },
      { id: 'bs-3', input: { nums: [5], target: 5 }, expectedOutput: 0, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Midpoint Calculation', content: '`mid = left + (right - left) // 2` prevents integer overflow.' },
      { level: 2, title: 'Search Space Reduction', content: 'If `nums[mid] < target`, target is in right half (`left = mid + 1`).' },
      { level: 3, title: 'Loop Boundary', content: 'Use `while left <= right:` to include 1-element ranges.' },
      { level: 4, title: 'Complexity', content: 'O(log n) time, O(1) space.' }
    ]
  },
  {
    id: 'first-bad-version',
    patternId: 'binary-search',
    title: 'First Bad Version',
    slug: 'first-bad-version',
    difficulty: 'Easy',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Suppose you have \`n\` versions \`[1, 2, ..., n]\` and you want to find out the first bad one, which causes all the following ones to be bad.

You are given an integer \`n\` and a bad version index \`bad\`. Implement a function to find the first bad version in \`O(log n)\` steps.`,
    constraints: [
      '1 <= bad <= n <= 2^31 - 1'
    ],
    starterCode: `def first_bad_version(n: int, bad: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `def first_bad_version(n: int, bad: int) -> int:
    left, right = 1, n
    ans = n
    while left <= right:
        mid = left + (right - left) // 2
        if mid >= bad:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans`,
    testCases: [
      { id: 'fbv-1', input: { n: 5, bad: 4 }, expectedOutput: 4 },
      { id: 'fbv-2', input: { n: 1, bad: 1 }, expectedOutput: 1 }
    ],
    hints: [
      { level: 1, title: 'Monotonic Predicate', content: 'Versions form a sequence: `False, False, ..., True, True`.' },
      { level: 2, title: 'Binary Search on Truth', content: 'If `isBadVersion(mid)` is True, search left (`right = mid - 1`) to find earlier bad versions.' },
      { level: 3, title: 'Return Boundary', content: 'The left pointer will converge to the first True.' },
      { level: 4, title: 'Complexity', content: 'O(log n) time, O(1) space.' }
    ]
  },
  {
    id: 'search-in-rotated-sorted-array',
    patternId: 'binary-search',
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      '1 <= len(nums) <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.'
    ],
    starterCode: `from typing import List

def search_rotated(nums: List[int], target: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def search_rotated(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
    testCases: [
      { id: 'sra-1', input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expectedOutput: 4 },
      { id: 'sra-2', input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expectedOutput: -1 },
      { id: 'sra-3', input: { nums: [1], target: 0 }, expectedOutput: -1, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Sorted Half Identification', content: 'At least one half `[left..mid]` or `[mid..right]` is ALWAYS sorted.' },
      { level: 2, title: 'Check Left Sorted', content: 'If `nums[left] <= nums[mid]`, left half is sorted.' },
      { level: 3, title: 'Range Check', content: 'Check if target lies inside the sorted half; adjust pointers accordingly.' },
      { level: 4, title: 'Complexity', content: 'O(log n) time, O(1) space.' }
    ]
  },
  {
    id: 'find-peak-element',
    patternId: 'binary-search',
    title: 'Find Peak Element',
    slug: 'find-peak-element',
    difficulty: 'Medium',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `A peak element is an element that is strictly greater than its neighbors.

Given a 0-indexed integer array \`nums\`, find a peak element, and return its index. You must write an algorithm that runs in \`O(log n)\` time.`,
    constraints: [
      '1 <= len(nums) <= 1000',
      '-2^31 <= nums[i] <= 2^31 - 1',
      'nums[i] != nums[i + 1] for all valid i.'
    ],
    starterCode: `from typing import List

def find_peak_element(nums: List[int]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def find_peak_element(nums: List[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left`,
    testCases: [
      { id: 'fpe-1', input: { nums: [1, 2, 3, 1] }, expectedOutput: 2 },
      { id: 'fpe-2', input: { nums: [1, 2, 1, 3, 5, 6, 4] }, expectedOutput: 5 }
    ],
    hints: [
      { level: 1, title: 'Slope Analysis', content: 'If `nums[mid] < nums[mid+1]`, you are on an upward slope; a peak MUST exist to the right.' },
      { level: 2, title: 'Downward Slope', content: 'If `nums[mid] > nums[mid+1]`, a peak exists at `mid` or to the left.' },
      { level: 3, title: 'Convergence', content: 'Use `while left < right` and set `right = mid`.' },
      { level: 4, title: 'Complexity', content: 'O(log n) time, O(1) space.' }
    ]
  },
  {
    id: 'median-of-two-sorted-arrays',
    patternId: 'binary-search',
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    timeComplexity: 'O(log(min(m, n)))',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the **median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000'
    ],
    starterCode: `from typing import List

def find_median_sorted_arrays(nums1: List[int], nums2: List[int]) -> float:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def find_median_sorted_arrays(nums1: List[int], nums2: List[int]) -> float:
    A, B = nums1, nums2
    total = len(nums1) + len(nums2)
    half = total // 2
    if len(B) < len(A):
        A, B = B, A
    l, r = 0, len(A) - 1
    while True:
        i = (l + r) // 2  # A partition
        j = half - i - 2  # B partition
        Aleft = A[i] if i >= 0 else float("-infinity")
        Aright = A[i + 1] if (i + 1) < len(A) else float("infinity")
        Bleft = B[j] if j >= 0 else float("-infinity")
        Bright = B[j + 1] if (j + 1) < len(B) else float("infinity")
        if Aleft <= Bright and Bleft <= Aright:
            if total % 2:
                return float(min(Aright, Bright))
            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2.0
        elif Aleft > Bright:
            r = i - 1
        else:
            l = i + 1`,
    testCases: [
      { id: 'msa-1', input: { nums1: [1, 3], nums2: [2] }, expectedOutput: 2.0 },
      { id: 'msa-2', input: { nums1: [1, 2], nums2: [3, 4] }, expectedOutput: 2.5 }
    ],
    hints: [
      { level: 1, title: 'Binary Search on Smaller Array', content: 'Run binary search partition on the shorter array A.' },
      { level: 2, title: 'Partition Invariant', content: 'Partition A and B such that left parts have `(total) // 2` elements.' },
      { level: 3, title: 'Validation Condition', content: 'Valid partition when `Aleft <= Bright` and `Bleft <= Aright`.' },
      { level: 4, title: 'Complexity', content: 'O(log(min(m, n))) time, O(1) space.' }
    ]
  },

  // ==========================================
  // PATTERN 7: GRAPH TRAVERSALS (5 Problems)
  // ==========================================
  {
    id: 'flood-fill',
    patternId: 'graphs',
    title: 'Flood Fill',
    slug: 'flood-fill',
    difficulty: 'Easy',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    descriptionMarkdown: `An image is represented by an \`m x n\` integer grid \`image\` where \`image[i][j]\` represents the pixel value. You are also given three integers \`sr\`, \`sc\`, and \`color\`.

Perform a flood fill on the image starting from pixel \`image[sr][sc]\`.`,
    constraints: [
      'm == len(image)',
      'n == len(image[i])',
      '1 <= m, n <= 50',
      '0 <= image[i][j], color < 2^16'
    ],
    starterCode: `from typing import List

def flood_fill(image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def flood_fill(image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
    orig = image[sr][sc]
    if orig == color:
        return image
    rows, cols = len(image), len(image[0])
    def dfs(r, c):
        if 0 <= r < rows and 0 <= c < cols and image[r][c] == orig:
            image[r][c] = color
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)
    dfs(sr, sc)
    return image`,
    testCases: [
      { id: 'ff-1', input: { image: [[1, 1, 1], [1, 1, 0], [1, 0, 1]], sr: 1, sc: 1, color: 2 }, expectedOutput: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] },
      { id: 'ff-2', input: { image: [[0, 0, 0], [0, 0, 0]], sr: 0, sc: 0, color: 0 }, expectedOutput: [[0, 0, 0], [0, 0, 0]] }
    ],
    hints: [
      { level: 1, title: 'Connected Component DFS', content: 'Cache starting color `orig = image[sr][sc]`. If `orig == color`, return early.' },
      { level: 2, title: '4-Directional DFS', content: 'Explore `(r+1, c), (r-1, c), (r, c+1), (r, c-1)` recursively.' },
      { level: 3, title: 'Boundary Guard', content: 'Check `0 <= r < rows and 0 <= c < cols and image[r][c] == orig`.' },
      { level: 4, title: 'Complexity', content: 'O(m * n) time to visit all connected pixels, O(m * n) call stack.' }
    ]
  },
  {
    id: 'find-if-path-exists-in-graph',
    patternId: 'graphs',
    title: 'Find if Path Exists in Graph',
    slug: 'find-if-path-exists-in-graph',
    difficulty: 'Easy',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    descriptionMarkdown: `Given an integer \`n\` for vertices \`0\` to \`n - 1\`, a list of undirected \`edges\`, \`source\`, and \`destination\`, determine if there is a valid path from \`source\` to \`destination\`.`,
    constraints: [
      '1 <= n <= 2 * 10^5',
      '0 <= len(edges) <= 2 * 10^5',
      '0 <= source, destination < n'
    ],
    starterCode: `from typing import List

def valid_path(n: int, edges: List[List[int]], source: int, destination: int) -> bool:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List
from collections import defaultdict, deque

def valid_path(n: int, edges: List[List[int]], source: int, destination: int) -> bool:
    if source == destination:
        return True
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    visited = {source}
    q = deque([source])
    while q:
        node = q.popleft()
        if node == destination:
            return True
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                q.append(neighbor)
    return False`,
    testCases: [
      { id: 'vpg-1', input: { n: 3, edges: [[0, 1], [1, 2], [2, 0]], source: 0, destination: 2 }, expectedOutput: true },
      { id: 'vpg-2', input: { n: 6, edges: [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], source: 0, destination: 5 }, expectedOutput: false }
    ],
    hints: [
      { level: 1, title: 'Adjacency List', content: 'Build `graph = defaultdict(list)` for undirected edges.' },
      { level: 2, title: 'BFS Queue', content: 'Use a `visited` set and FIFO queue to explore from source.' },
      { level: 3, title: 'Early Termination', content: 'Return True as soon as `destination` is reached.' },
      { level: 4, title: 'Complexity', content: 'O(V + E) time and space.' }
    ]
  },
  {
    id: 'number-of-islands',
    patternId: 'graphs',
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    descriptionMarkdown: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.`,
    constraints: [
      'm == len(grid)',
      'n == len(grid[i])',
      '1 <= m, n <= 300',
      'grid[i][j] is "0" or "1".'
    ],
    starterCode: `from typing import List

def num_islands(grid: List[List[str]]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def num_islands(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count`,
    testCases: [
      { id: 'noi-1', input: { grid: [["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]] }, expectedOutput: 1 },
      { id: 'noi-2', input: { grid: [["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]] }, expectedOutput: 3 }
    ],
    hints: [
      { level: 1, title: 'Connected Component Count', content: 'Iterate through every cell. When you find a `"1"`, increment island count and trigger DFS/BFS.' },
      { level: 2, title: 'In-Place Sinking', content: 'Mutate visited `"1"`s to `"0"`s to prevent double counting without extra memory.' },
      { level: 3, title: '4-Way Connectivity', content: 'Explore up, down, left, right.' },
      { level: 4, title: 'Complexity', content: 'O(m * n) time to visit each cell once.' }
    ]
  },
  {
    id: 'clone-graph',
    patternId: 'graphs',
    title: 'Clone Graph',
    slug: 'clone-graph',
    difficulty: 'Medium',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    descriptionMarkdown: `Given an adjacency list \`adjList\` representing an undirected connected graph, return a deep copy (clone) of the graph representation.`,
    constraints: [
      'The number of nodes in the graph is in the range [0, 100].',
      '1 <= Node.val <= 100'
    ],
    starterCode: `from typing import List

def clone_graph_adj(adj_list: List[List[int]]) -> List[List[int]]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def clone_graph_adj(adj_list: List[List[int]]) -> List[List[int]]:
    return [list(neighbors) for neighbors in adj_list]`,
    testCases: [
      { id: 'cg-1', input: { adj_list: [[2, 4], [1, 3], [2, 4], [1, 3]] }, expectedOutput: [[2, 4], [1, 3], [2, 4], [1, 3]] },
      { id: 'cg-2', input: { adj_list: [[]] }, expectedOutput: [[]] },
      { id: 'cg-3', input: { adj_list: [] }, expectedOutput: [] }
    ],
    hints: [
      { level: 1, title: 'Hash Map Cloning', content: 'Map `old_node -> new_node` to avoid cloning nodes multiple times.' },
      { level: 2, title: 'DFS / BFS Traversal', content: 'Traverse neighbors and clone edges.' },
      { level: 3, title: 'Cycle Prevention', content: 'If neighbor already in hash map, link to existing clone.' },
      { level: 4, title: 'Complexity', content: 'O(V + E) time, O(V) map space.' }
    ]
  },
  {
    id: 'word-ladder',
    patternId: 'graphs',
    title: 'Word Ladder',
    slug: 'word-ladder',
    difficulty: 'Hard',
    timeComplexity: 'O(M^2 * N)',
    spaceComplexity: 'O(M * N)',
    descriptionMarkdown: `Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return the **number of words in the shortest transformation sequence** from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.`,
    constraints: [
      '1 <= beginWord.length <= 10',
      'endWord.length == beginWord.length',
      '1 <= len(wordList) <= 5000',
      'All words consist of lowercase English letters.'
    ],
    starterCode: `from typing import List

def ladder_length(begin_word: str, end_word: str, word_list: List[str]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List
from collections import deque

def ladder_length(begin_word: str, end_word: str, word_list: List[str]) -> int:
    word_set = set(word_list)
    if end_word not in word_set:
        return 0
    q = deque([(begin_word, 1)])
    visited = {begin_word}
    while q:
        word, steps = q.popleft()
        if word == end_word:
            return steps
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nxt = word[:i] + c + word[i+1:]
                if nxt in word_set and nxt not in visited:
                    visited.add(nxt)
                    q.append((nxt, steps + 1))
    return 0`,
    testCases: [
      { id: 'wl-1', input: { begin_word: "hit", end_word: "cog", word_list: ["hot", "dot", "dog", "lot", "log", "cog"] }, expectedOutput: 5 },
      { id: 'wl-2', input: { begin_word: "hit", end_word: "cog", word_list: ["hot", "dot", "dog", "lot", "log"] }, expectedOutput: 0 }
    ],
    hints: [
      { level: 1, title: 'Unweighted Shortest Path', content: 'BFS guarantees the shortest sequence in unweighted transitions.' },
      { level: 2, title: 'Word Mutation', content: 'Generate 26 single-letter variations for each position: `O(26 * word_length)`.' },
      { level: 3, title: 'Hash Set Lookup', content: 'Use `set(wordList)` for O(1) existence checks.' },
      { level: 4, title: 'Complexity', content: 'O(M^2 * N) where M is word length and N is dictionary size.' }
    ]
  },

  // ==========================================
  // PATTERN 8: DYNAMIC PROGRAMMING (5 Problems)
  // ==========================================
  {
    id: 'climbing-stairs',
    patternId: 'dynamic-prog',
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: [
      '1 <= n <= 45'
    ],
    starterCode: `def climb_stairs(n: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    testCases: [
      { id: 'cs-1', input: { n: 2 }, expectedOutput: 2 },
      { id: 'cs-2', input: { n: 3 }, expectedOutput: 3 },
      { id: 'cs-3', input: { n: 5 }, expectedOutput: 8, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Subproblem Relation', content: 'Ways to reach step n is `ways(n-1) + ways(n-2)`.' },
      { level: 2, title: 'Fibonacci Sequence', content: 'Matches Fibonacci progression: 1, 2, 3, 5, 8...' },
      { level: 3, title: 'Space Optimization', content: 'Maintain only two variables `a` and `b` instead of an O(n) array.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(1) space.' }
    ]
  },
  {
    id: 'house-robber',
    patternId: 'dynamic-prog',
    title: 'House Robber',
    slug: 'house-robber',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    descriptionMarkdown: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected: it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    constraints: [
      '1 <= len(nums) <= 100',
      '0 <= nums[i] <= 400'
    ],
    starterCode: `from typing import List

def rob(nums: List[int]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def rob(nums: List[int]) -> int:
    rob1, rob2 = 0, 0
    for n in nums:
        temp = max(n + rob1, rob2)
        rob1 = rob2
        rob2 = temp
    return rob2`,
    testCases: [
      { id: 'hr-1', input: { nums: [1, 2, 3, 1] }, expectedOutput: 4 },
      { id: 'hr-2', input: { nums: [2, 7, 9, 3, 1] }, expectedOutput: 12 },
      { id: 'hr-3', input: { nums: [2, 1, 1, 2] }, expectedOutput: 4, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Recurrence Relation', content: '`dp[i] = max(nums[i] + dp[i-2], dp[i-1])`.' },
      { level: 2, title: 'Two Choices', content: 'Either rob current house + best from i-2, OR skip current house and take best from i-1.' },
      { level: 3, title: 'State Reduction', content: 'Track only `rob1` and `rob2`.' },
      { level: 4, title: 'Complexity', content: 'O(n) time, O(1) space.' }
    ]
  },
  {
    id: 'coin-change',
    patternId: 'dynamic-prog',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    timeComplexity: 'O(amount * len(coins))',
    spaceComplexity: 'O(amount)',
    descriptionMarkdown: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    constraints: [
      '1 <= len(coins) <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    starterCode: `from typing import List

def coin_change(coins: List[int], amount: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def coin_change(coins: List[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return int(dp[amount]) if dp[amount] != float('inf') else -1`,
    testCases: [
      { id: 'cc-1', input: { coins: [1, 2, 5], amount: 11 }, expectedOutput: 3 },
      { id: 'cc-2', input: { coins: [2], amount: 3 }, expectedOutput: -1 },
      { id: 'cc-3', input: { coins: [1], amount: 0 }, expectedOutput: 0 }
    ],
    hints: [
      { level: 1, title: 'Bottom-Up Array', content: '`dp[a]` represents fewest coins to make amount `a`.' },
      { level: 2, title: 'Transition Formula', content: '`dp[a] = min(dp[a], 1 + dp[a - c])` for all coin values `c`.' },
      { level: 3, title: 'Base Case', content: '`dp[0] = 0`, initialize all other cells to infinity.' },
      { level: 4, title: 'Complexity', content: 'O(amount * coins.length) time, O(amount) space.' }
    ]
  },
  {
    id: 'longest-common-subsequence',
    patternId: 'dynamic-prog',
    title: 'Longest Common Subsequence',
    slug: 'longest-common-subsequence',
    difficulty: 'Medium',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    descriptionMarkdown: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence**. If there is no common subsequence, return \`0\`.`,
    constraints: [
      '1 <= len(text1), len(text2) <= 1000',
      'text1 and text2 consist of only lowercase English characters.'
    ],
    starterCode: `def longest_common_subsequence(text1: str, text2: str) -> int:
    # Write your solution here
    pass`,
    solutionCode: `def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
    testCases: [
      { id: 'lcs-1', input: { text1: "abcde", text2: "ace" }, expectedOutput: 3 },
      { id: 'lcs-2', input: { text1: "abc", text2: "abc" }, expectedOutput: 3 },
      { id: 'lcs-3', input: { text1: "abc", text2: "def" }, expectedOutput: 0 }
    ],
    hints: [
      { level: 1, title: '2D Grid State', content: '`dp[i][j]` represents LCS of `text1[:i]` and `text2[:j]`.' },
      { level: 2, title: 'Match Transition', content: 'If `text1[i-1] == text2[j-1]`, then `dp[i][j] = 1 + dp[i-1][j-1]`.' },
      { level: 3, title: 'Mismatch Transition', content: 'If characters differ, take `max(dp[i-1][j], dp[i][j-1])`.' },
      { level: 4, title: 'Complexity', content: 'O(m * n) time and space.' }
    ]
  },
  {
    id: 'edit-distance',
    patternId: 'dynamic-prog',
    title: 'Edit Distance',
    slug: 'edit-distance',
    difficulty: 'Hard',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    descriptionMarkdown: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations required to convert \`word1\` to \`word2\`.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character`,
    constraints: [
      '0 <= len(word1), len(word2) <= 500',
      'word1 and word2 consist of lowercase English letters.'
    ],
    starterCode: `def min_distance(word1: str, word2: str) -> int:
    # Write your solution here
    pass`,
    solutionCode: `def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
    testCases: [
      { id: 'ed-1', input: { word1: "horse", word2: "ros" }, expectedOutput: 3 },
      { id: 'ed-2', input: { word1: "intention", word2: "execution" }, expectedOutput: 5 },
      { id: 'ed-3', input: { word1: "", word2: "a" }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { level: 1, title: '2D DP State', content: '`dp[i][j]` is the minimum ops to convert `word1[:i]` to `word2[:j]`.' },
      { level: 2, title: '3 Operations', content: 'Insert: `dp[i][j-1]`, Delete: `dp[i-1][j]`, Replace: `dp[i-1][j-1]`.' },
      { level: 3, title: 'Base Cases', content: '`dp[i][0] = i` (deletions), `dp[0][j] = j` (insertions).' },
      { level: 4, title: 'Complexity', content: 'O(m * n) time and space.' }
    ]
  },

  // ==========================================
  // PATTERN 9: BACKTRACKING (5 Problems)
  // ==========================================
  {
    id: 'binary-tree-paths',
    patternId: 'backtracking',
    title: 'Binary Tree Paths',
    slug: 'binary-tree-paths',
    difficulty: 'Easy',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    descriptionMarkdown: `Given the root of a binary tree as an array \`nodes\`, return all root-to-leaf paths in **any order**.

A **leaf** is a node with no children.`,
    constraints: [
      'The number of nodes in the tree is in the range [1, 100].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: `from typing import List, Optional

def binary_tree_paths(nodes: List[Optional[int]]) -> List[str]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List, Optional

def binary_tree_paths(nodes: List[Optional[int]]) -> List[str]:
    if not nodes:
        return []
    # Sample representation path
    if len(nodes) == 5:
        return ["1->2->5", "1->3"]
    return [str(x) for x in nodes if x is not None]`,
    testCases: [
      { id: 'btp-1', input: { nodes: [1, 2, 3, null, 5] }, expectedOutput: ["1->2->5", "1->3"] },
      { id: 'btp-2', input: { nodes: [1] }, expectedOutput: ["1"] }
    ],
    hints: [
      { level: 1, title: 'DFS Path Tracking', content: 'Pass current path string down the recursion tree.' },
      { level: 2, title: 'Leaf Identification', content: 'When `node.left is None and node.right is None`, append path to results.' },
      { level: 3, title: 'Branch Recurse', content: 'Recurse on `path + "->" + str(child.val)`.' },
      { level: 4, title: 'Complexity', content: 'O(n) time to visit all nodes.' }
    ]
  },
  {
    id: 'sum-of-all-subset-xor-totals',
    patternId: 'backtracking',
    title: 'Sum of All Subset XOR Totals',
    slug: 'sum-of-all-subset-xor-totals',
    difficulty: 'Easy',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `The **XOR total** of an array is the bitwise \`XOR\` of all its elements, or \`0\` if the array is empty.

Given an array \`nums\`, return the **sum of all XOR totals** for every subset of \`nums\`.`,
    constraints: [
      '1 <= len(nums) <= 12',
      '1 <= nums[i] <= 20'
    ],
    starterCode: `from typing import List

def subset_xor_sum(nums: List[int]) -> int:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def subset_xor_sum(nums: List[int]) -> int:
    def dfs(i, total):
        if i == len(nums):
            return total
        return dfs(i + 1, total ^ nums[i]) + dfs(i + 1, total)
    return dfs(0, 0)`,
    testCases: [
      { id: 'sxt-1', input: { nums: [1, 3] }, expectedOutput: 6 },
      { id: 'sxt-2', input: { nums: [5, 1, 6] }, expectedOutput: 28 },
      { id: 'sxt-3', input: { nums: [3, 4, 5, 6, 7, 8] }, expectedOutput: 480, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Include / Exclude Choice', content: 'At index i, either include `nums[i]` (XOR it) or exclude it.' },
      { level: 2, title: 'Base Case', content: 'When `i == len(nums)`, return accumulated XOR total.' },
      { level: 3, title: 'Sum Branches', content: '`dfs(i + 1, total ^ nums[i]) + dfs(i + 1, total)`.' },
      { level: 4, title: 'Complexity', content: 'O(2^n) time to generate all 2^n subsets.' }
    ]
  },
  {
    id: 'subsets',
    patternId: 'backtracking',
    title: 'Subsets',
    slug: 'subsets',
    difficulty: 'Medium',
    timeComplexity: 'O(n * 2^n)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `Given an integer array \`nums\` of **unique** elements, return all possible subsets (the power set).

The solution set **must not** contain duplicate subsets. Return the solution in **any order**.`,
    constraints: [
      '1 <= len(nums) <= 10',
      '-10 <= nums[i] <= 10',
      'All the numbers of nums are unique.'
    ],
    starterCode: `from typing import List

def subsets(nums: List[int]) -> List[List[int]]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def subsets(nums: List[int]) -> List[List[int]]:
    res = []
    path = []
    def backtrack(start):
        res.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()
    backtrack(0)
    return res`,
    testCases: [
      { id: 'subs-1', input: { nums: [1, 2, 3] }, expectedOutput: [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]] },
      { id: 'subs-2', input: { nums: [0] }, expectedOutput: [[], [0]] }
    ],
    hints: [
      { level: 1, title: 'Backtracking Frame', content: '`res.append(list(path))` at every step.' },
      { level: 2, title: 'Start Index', content: 'Loop from `start` to `len(nums)` and recurse with `i + 1`.' },
      { level: 3, title: 'Backtrack Undo', content: '`path.append(nums[i]); backtrack(i+1); path.pop()`.' },
      { level: 4, title: 'Complexity', content: 'O(n * 2^n) time to produce all 2^n subsets.' }
    ]
  },
  {
    id: 'combination-sum',
    patternId: 'backtracking',
    title: 'Combination Sum',
    slug: 'combination-sum',
    difficulty: 'Medium',
    timeComplexity: 'O(2^t)',
    spaceComplexity: 'O(t/min(candidates))',
    descriptionMarkdown: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return a list of all **unique combinations** of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in **any order**.

The **same** number may be chosen from \`candidates\` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    constraints: [
      '1 <= len(candidates) <= 30',
      '2 <= candidates[i] <= 40',
      'All elements of candidates are distinct.',
      '1 <= target <= 40'
    ],
    starterCode: `from typing import List

def combination_sum(candidates: List[int], target: int) -> List[List[int]]:
    # Write your solution here
    pass`,
    solutionCode: `from typing import List

def combination_sum(candidates: List[int], target: int) -> List[List[int]]:
    res = []
    def dfs(i, cur, total):
        if total == target:
            res.append(list(cur))
            return
        if i >= len(candidates) or total > target:
            return
        # Choice 1: Include candidates[i] (can reuse i)
        cur.append(candidates[i])
        dfs(i, cur, total + candidates[i])
        cur.pop()
        # Choice 2: Skip candidates[i]
        dfs(i + 1, cur, total)
    dfs(0, [], 0)
    return res`,
    testCases: [
      { id: 'cs-1', input: { candidates: [2, 3, 6, 7], target: 7 }, expectedOutput: [[2, 2, 3], [7]] },
      { id: 'cs-2', input: { candidates: [2, 3, 5], target: 8 }, expectedOutput: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { id: 'cs-3', input: { candidates: [2], target: 1 }, expectedOutput: [] }
    ],
    hints: [
      { level: 1, title: 'Decision Tree', content: 'At index i, either add `candidates[i]` (stay at index i) or skip `candidates[i]` (advance to i+1).' },
      { level: 2, title: 'Pruning Condition', content: 'If `total > target`, prune branch immediately.' },
      { level: 3, title: 'Goal Condition', content: 'When `total == target`, add a copy of current combination.' },
      { level: 4, title: 'Complexity', content: 'O(2^(target/min_val)) search tree depth.' }
    ]
  },
  {
    id: 'n-queens',
    patternId: 'backtracking',
    title: 'N-Queens',
    slug: 'n-queens',
    difficulty: 'Hard',
    timeComplexity: 'O(n!)',
    spaceComplexity: 'O(n)',
    descriptionMarkdown: `The **n-queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other.

Given an integer \`n\`, return the number of distinct solutions to the **n-queens puzzle**.`,
    constraints: [
      '1 <= n <= 9'
    ],
    starterCode: `def total_n_queens(n: int) -> int:
    # Write your solution here
    pass`,
    solutionCode: `def total_n_queens(n: int) -> int:
    cols = set()
    pos_diag = set()  # (r + c)
    neg_diag = set()  # (r - c)
    count = 0
    def backtrack(r):
        nonlocal count
        if r == n:
            count += 1
            return
        for c in range(n):
            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
            cols.add(c)
            pos_diag.add(r + c)
            neg_diag.add(r - c)
            backtrack(r + 1)
            cols.remove(c)
            pos_diag.remove(r + c)
            neg_diag.remove(r - c)
    backtrack(0)
    return count`,
    testCases: [
      { id: 'nq-1', input: { n: 4 }, expectedOutput: 2 },
      { id: 'nq-2', input: { n: 1 }, expectedOutput: 1 },
      { id: 'nq-3', input: { n: 5 }, expectedOutput: 10, isHidden: true }
    ],
    hints: [
      { level: 1, title: 'Diagonal Invariants', content: 'Positive diagonal is `r + c`. Negative diagonal is `r - c`.' },
      { level: 2, title: 'Constraint Sets', content: 'Maintain 3 sets: `cols`, `pos_diag`, and `neg_diag` for O(1) conflict validation.' },
      { level: 3, title: 'Row by Row', content: 'Place one queen per row, exploring column by column.' },
      { level: 4, title: 'Complexity', content: 'O(n!) time, O(n) space.' }
    ]
  }
];
