#!/usr/bin/env python3
"""
AlgoLens (PyDSA) Solution Verification Test Harness
Executes all 45 canonical solutions in src/lib/data/problems.ts against their test suites.
"""

import json
import re
import subprocess
import sys
import time
from pathlib import Path

# ANSI Color Codes
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

def load_problems():
    root_dir = Path(__file__).resolve().parent.parent
    cache_file = root_dir / ".verify_cache" / "problems.json"
    dump_script = root_dir / "scripts" / "dump_problems.mjs"

    # Auto-generate JSON cache if not present or stale
    if not cache_file.exists():
        subprocess.run(["node", str(dump_script)], check=True, cwd=str(root_dir))

    with open(cache_file, "r", encoding="utf-8") as f:
        problems = json.load(f)

    for prob in problems:
        starter_code = prob.get("starterCode", "")
        fn_m = re.search(r"def\s+([a-zA-Z0-9_]+)\s*\(", starter_code)
        prob["fn_name"] = fn_m.group(1) if fn_m else "solution"

    return problems

def verify_all_solutions():
    print(f"\n{BOLD}{CYAN}======================================================{RESET}")
    print(f"{BOLD}{CYAN}  AlgoLens (PyDSA) Canonical Solution Verification   {RESET}")
    print(f"{BOLD}{CYAN}======================================================{RESET}\n")

    problems = load_problems()
    print(f"Loaded {BOLD}{len(problems)}{RESET} problems from {CYAN}src/lib/data/problems.ts{RESET}\n")

    passed_count = 0
    failed_count = 0
    total_test_cases = 0
    start_total_time = time.perf_counter()

    current_pattern = None

    for prob in problems:
        if prob["patternId"] != current_pattern:
            current_pattern = prob["patternId"]
            print(f"\n{BOLD}--- Pattern: {current_pattern.upper()} ---{RESET}")

        prob_id = prob["id"]
        title = prob["title"]
        fn_name = prob["fn_name"]
        code_str = prob["solutionCode"]
        test_cases = prob.get("testCases", [])
        
        # Prepare environment
        globals_env = {}
        try:
            exec(code_str, globals_env)
            if fn_name not in globals_env:
                print(f"  {RED}✖{RESET} {BOLD}{title}{RESET} ({prob_id}) - Function '{fn_name}' not defined in solutionCode.")
                failed_count += 1
                continue
            target_fn = globals_env[fn_name]
        except Exception as e:
            print(f"  {RED}✖{RESET} {BOLD}{title}{RESET} ({prob_id}) - Syntax / Import error: {e}")
            failed_count += 1
            continue

        problem_passed = True
        failed_case_info = None

        for tc_idx, tc in enumerate(test_cases):
            total_test_cases += 1
            tc_input = tc.get("input", {})
            expected = tc.get("expectedOutput")

            try:
                if isinstance(tc_input, dict):
                    actual = target_fn(**tc_input)
                elif isinstance(tc_input, list):
                    actual = target_fn(*tc_input)
                else:
                    actual = target_fn(tc_input)

                # Custom matching for unordered list comparisons (e.g. 3Sum or Subsets)
                if prob_id in ('three-sum', 'subsets', 'combination-sum'):
                    if isinstance(actual, list) and isinstance(expected, list):
                        actual_sorted = sorted([sorted(x) if isinstance(x, list) else x for x in actual])
                        expected_sorted = sorted([sorted(x) if isinstance(x, list) else x for x in expected])
                        if actual_sorted != expected_sorted:
                            problem_passed = False
                            failed_case_info = f"Case {tc_idx+1}: Input={tc_input} | Expected={expected} | Got={actual}"
                            break
                        continue

                # Assertion comparison
                if actual != expected:
                    # Handle float rounding differences
                    if isinstance(expected, float) and isinstance(actual, (int, float)) and abs(actual - expected) < 1e-5:
                        continue
                    problem_passed = False
                    failed_case_info = f"Case {tc_idx+1}: Input={tc_input} | Expected={expected} | Got={actual}"
                    break
            except Exception as e:
                problem_passed = False
                failed_case_info = f"Case {tc_idx+1}: Raised Exception: {str(e)}"
                break

        if problem_passed:
            passed_count += 1
            diff_color = GREEN if prob["difficulty"] == "Easy" else (YELLOW if prob["difficulty"] == "Medium" else RED)
            print(f"  {GREEN}✔{RESET} [{diff_color}{prob['difficulty'][:1]}{RESET}] {title} ({len(test_cases)} test cases passed)")
        else:
            failed_count += 1
            print(f"  {RED}✖{RESET} {BOLD}{title}{RESET} ({prob_id})")
            print(f"      {RED}→ {failed_case_info}{RESET}")

    total_time_ms = round((time.perf_counter() - start_total_time) * 1000, 2)

    print(f"\n{BOLD}{CYAN}======================================================{RESET}")
    print(f"{BOLD}  VERIFICATION SUMMARY{RESET}")
    print(f"{BOLD}{CYAN}======================================================{RESET}")
    print(f"  Total Problems Tested : {len(problems)}")
    print(f"  Total Test Cases Run  : {total_test_cases}")
    print(f"  Problems Passed       : {GREEN}{passed_count}{RESET} / {len(problems)}")
    print(f"  Problems Failed       : {RED if failed_count > 0 else GREEN}{failed_count}{RESET}")
    print(f"  Total Execution Time  : {total_time_ms} ms")
    print(f"{BOLD}{CYAN}======================================================{RESET}\n")

    if failed_count == 0 and len(problems) == 45:
        print(f"{GREEN}{BOLD}🎉 ALL 45 CANONICAL SOLUTIONS PASSED 100% OF TEST CASES!{RESET}\n")
        sys.exit(0)
    else:
        print(f"{RED}{BOLD}❌ SOME SOLUTIONS FAILED VERIFICATION.{RESET}\n")
        sys.exit(1)

if __name__ == "__main__":
    verify_all_solutions()
