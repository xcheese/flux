---
name: coding-guardrails
description: 非平凡代码修改、调试、重构或交付的工程入口；按风险选用诊断、评审与行为测试，简单文案/样式不加载完整流程。
---

# Coding Guardrails

Use the user's agreed scope and project conventions. This entrypoint supplies engineering-specific decisions; the global collaboration rules own authorization, scope, verification closeout and reporting.

## Choose only the needed method

- Uncertain, intermittent or repeatedly failing defect: [diagnosing-bugs](../diagnosing-bugs/SKILL.md).
- Requested review, or cross-module/high-risk logic closeout: [code-review](../code-review/SKILL.md).
- Complex testable behavior or requested test-first work: [tdd](../tdd/SKILL.md).
- Ordinary edits use the existing project workflow. Do not chain all supporting skills. If one is unavailable, continue useful work with the project's tools.

## Establish the actual boundary

Read relevant current project instructions, scripts and supported command parameters; do not blindly reuse a historical command. Reuse agreed requirements and tests, ask only about consequential unresolved behavior.

For flows crossing processes, documents, windows, storage, accounts or services, trace the real entrypoint and relevant callers. Establish ownership and lifecycle before changing behavior. Synchronize producers and consumers through the real mechanism; account for creation, restoration, destruction, asynchronous confirmation and late state changes instead of relying on one initialization-time decision.

## Verify what changed

Prefer existing formal regression coverage for meaningful business behavior. Exercise the boundary and risky ordering without mocking away the interaction. Confirm the intended path actually executed with relevant service settings and caller guards; disabled, skipped or fallback-only execution does not validate the feature.

For performance, justify the priority with actual workload composition or a measured hot path. Compare revision, environment and parameters against a comparable baseline; separate transfer, parsing/execution and presentation/wait time. Local or simulated results do not establish online benefit.

Run the narrow relevant checks and required project gates. Reuse valid evidence from the current task; repeat only after relevant changes, failures or unresolved risk. Inspect the task diff and report what was observed and what remains unverified, without expanding the patch to unrelated findings.
