---
name: tdd
description: "用行为测试驱动核心逻辑实现与回归修复。适用于可测试的复杂行为或用户要求先写测试；简单样式、文案和纯配置改动直接处理。"
license: MIT
metadata:
  upstream: "https://github.com/mattpocock/skills"
  upstream-path: "skills/engineering/tdd"
  upstream-revision: "c55ee46073ed923f86ce59a5eb3b6d895095d1b7"
  adaptation: "2026-09-22 proportional behavior-first testing"
---

# Test-Driven Development

Use a short failing-test → minimal implementation → passing-test cycle where it protects meaningful behavior. Match the test investment to the change.

## Choose a meaningful boundary

Derive expected behavior and the test boundary from the user's request, accepted spec, real callers and existing tests. State a non-obvious choice briefly and proceed. Do not ask the user to reconfirm an already established boundary. Ask only when unresolved product behavior changes the expected result.

Reuse existing runners, fixtures and test helpers. Prefer public/observable behavior and the narrowest boundary that reproduces the relevant caller, lifecycle or identity interaction. Do not add a framework or restructure the product merely to make this skill runnable.

For an existing fix or supplied patch, verify it and add a meaningful missing regression check when useful; do not revert user work to manufacture a red phase. If regression sensitivity cannot be demonstrated safely, say so.

## One useful behavior per cycle

1. Select one required behavior or an actual bug pattern.
2. Add or adapt the narrow test. Run it and establish that a failure is due to the expected behavior, not setup, syntax or missing dependencies.
3. Make the smallest implementation change within the request.
4. Rerun the affected check, then add the next behavior only when the change warrants it.

Expected values must come from an independent source: an explicit contract, worked example, known-good observation or invariant. Avoid recomputing the expected result with the production algorithm, checking a constant against itself, or snapshotting the implementation as its own oracle.

For stateful behavior, include the transition or interaction that actually makes it risky, such as reset, return navigation, multiple callers, stale results or identity changes. Do not mechanically cover every possible permutation.

## Keep tests proportionate

Prefer real local logic with controlled external boundaries. Use the project's mocks/fakes for unavailable services, clocks, randomness or native hosts; preserve the interaction being tested. Do not mock away the defect and call the test a regression.

Small internal refactors needed by the authorized change can happen under passing tests. Avoid unrelated refactors, speculative abstractions and wholesale replacement of existing tests.

For UI-only adjustments, docs, pure configuration or a task without a meaningful automated surface, use the relevant visual, static or configuration check. Do not create low-value tests just to complete a ritual. When the user explicitly requests a testing method, follow that request within its scope.

After affected checks pass, run additional checks only when changed risk, an observed failure or a required project gate calls for them. Do not turn every small patch into a full suite, device run or stress test.

Report the behavior protected, checks actually run and remaining evidence gap. Local test success does not replace required real-device, account or service acceptance. No commit, dependency installation or external mutation is authorized solely by this skill.
