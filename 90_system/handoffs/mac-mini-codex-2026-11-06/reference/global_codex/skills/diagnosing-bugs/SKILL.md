---
name: diagnosing-bugs
description: "排查疑难、偶现或回归故障及性能退化。用于根因尚不明确或修复反复失败；明显的小修复直接处理。"
license: MIT
metadata:
  upstream: "https://github.com/mattpocock/skills"
  upstream-path: "skills/engineering/diagnosing-bugs"
  upstream-revision: "c55ee46073ed923f86ce59a5eb3b6d895095d1b7"
  adaptation: "2026-09-22 autonomous evidence-based diagnosis"
---

# Diagnosing Bugs

Turn an observed failure into a supported cause and the smallest justified repair. Use the parts that reduce uncertainty; do not turn the task into a mandatory interview.

## Start from the actual failure

- Reuse the user's symptom, previous attempts, accepted decisions and relevant specs. Inspect the actual checkout, caller, account/session boundary and target runtime before treating a nearby failure as the same bug.
- Honor diagnosis-only requests. When a fix is already authorized, continue through the scoped repair and appropriate verification without asking again.
- Derive expected behavior and success criteria from the request, specs and existing contracts. Ask a focused question only when a consequential ambiguity cannot be resolved from those sources; continue independent work meanwhile.
- Read only relevant project instructions, specs and runbooks. Reuse the project's tools and logged-in access paths.

## Build the best available evidence loop

Prefer an existing failing test, targeted request/replay, narrow browser flow, CLI fixture or runtime trace that observes the exact symptom. Capture a baseline before changing behavior. Make the check narrower, faster and more repeatable where practical.

A runnable reproduction is valuable, but not a prerequisite for reading code or forming a labeled hypothesis. If devices, accounts or services are unavailable, continue with useful static analysis, logs and call-path tracing. Distinguish a confirmed defect from a suspected cause. Do not claim reproduction or a verified fix from a constructed example that bypasses the failing boundary.

For intermittent failures, choose a bounded sample appropriate to the symptom and environment. Record attempts and failures; a clean sample alone does not prove absence. Do not launch a large fuzz/stress run, a new mobile simulator, or production instrumentation just to satisfy this skill. Follow project device lifecycle rules and the user's authorized scope.

## Narrow and distinguish causes

Reduce the scenario only while preserving the user's failure and relevant caller/lifecycle boundaries. When evidence leaves competing causes, state a small number of falsifiable hypotheses and choose a probe that distinguishes them. Do not invent alternatives to reach a fixed count.

Change one relevant variable at a time when feasible. Prefer existing diagnostics, a debugger or targeted temporary instrumentation. For performance, measure a comparable baseline with an appropriate profiler or timing signal before optimizing. Redact credentials and sensitive identifiers in logs and artifacts.

Reuse established facts. Retry a failed approach only when a changed input, environment or new evidence makes the retry informative. Otherwise change the probe or state the precise missing condition; do not restart the whole investigation.

## Repair and close the loop

When authorized and supported by evidence, make the narrow repair. If a meaningful regression test can exercise the actual failure pattern, reproduce the failure before fixing it and verify the same check afterward. For complex behavioral changes, consult the available `tdd` skill only when it adds useful test design.

A unit test must not stand in for missing native, multi-caller or real-service coverage. Label the remaining gap and continue work that is independently possible.

Run the original scenario and the narrow related checks when available. Broaden only for a new failure, changed risk, or a required project gate. Remove temporary instrumentation and release task-owned resources. Report the cause and its evidence, the change, the checks actually run, and any remaining acceptance gap. No automatic commit or external publication is implied.
