---
name: long-goal-execution
description: "用于明确启动或恢复的长期目标，以及需跨轮追踪、协调外部验收的复杂交付；支持这些目标的阶段验收与阻塞复核。普通多步骤修改不加载完整流程，状态询问或只读复盘不恢复执行。"
---

# Long Goal Execution

Keep sustained work bounded and evidence-based. Preserve the original outcome and the user's current authorization. Use the project's existing contract, Specs, runbook and evidence records rather than creating a parallel tracking system.

## Select the current mode

- **Execution or authorized resumption:** identify the outcome, affected scope, required closing evidence and next useful action. Reuse these when already agreed; do not ask for the same decisions again.
- **Status, review or retrospective:** inspect and report within that request. Do not resume an old goal, run product gates, start devices or change code merely because the earlier goal is unfinished.
- Ordinary multi-step edits need only proportional planning and verification. A goal tool is created only when the user explicitly requests a goal; the skill's selection is not that request.

## Start and resume incrementally

Read the relevant project instructions and the parts of the contract needed for the next action. Reuse the agreed outcome, scope exclusions, closing evidence and risk-based checkpoints in the existing task record. Plan only far enough to support the next verifiable action; compare alternatives when they can change a consequential decision. Create missing information only when it changes execution or acceptance.

After interruption or context compaction, reconcile the latest user request, actual root/branch/HEAD and dirty state, applicable evidence, failure-chain history and remaining work. Report the changed facts; do not regenerate a full start packet or reset attempt accounting for every turn or user question.

Distinguish locally actionable work, external dependencies and delivery cleanup when those distinctions affect the task. An external dependency does not stop independent work inside the authorized scope.

New feedback reopens only affected items. Keep prior conclusions for their original scope; check version, platform, inputs and project reuse rules before applying them to the current delivery. Never assume a historical PASS is current merely because a summary says complete.

## Match evidence to the acceptance criterion

For each affected item, identify what closes it, what has actually been observed, the remaining gap and the next action. Use the project's existing matrix; a separate table is optional when it clarifies a complex gap.

Evidence is relevant to a claim, not a universal ranking. Static checks, unit tests, builds, fixtures, simulators, physical devices and service logs answer different questions. A build proves buildability; simulator or fixture success does not establish a required real-device, account, service or release result. Lack of search results is not runtime proof.

Keep requirements, current implementation and historical observations distinct. Record the actual command or observation and its applicable version/platform. Before repeating a check, identify the changed input, failed or missing coverage, unresolved risk or required gate that makes earlier evidence insufficient, then use the narrow relevant check. Do not weaken assertions, change frozen inputs or borrow an unrelated result to close a required gate.

## Recover from failures within scope

Use the project's attempt limits, cost budget, resource cleanup and re-entry conditions; when no project-specific bound exists, apply the global no-progress fallback. Count a round as a diagnostic hypothesis, an action and assessment of its evidence, not an individual tool call. Progress means goal-relevant new evidence that reduces uncertainty or closes a required acceptance gap; more logs, tools or variants alone are not progress.

At the checkpoint, discontinue the ineffective method and explain the evidence, cost and next useful action. Continue independent authorized work without a new implementation confirmation. Keep cause analysis, narrow checks and alternative approaches in the same problem record; do not turn a stopped batch into unlimited smaller checks. Re-enter a route only with a specific new basis and within its evidence and cost conditions. A new run ID or resource cleanup does not reset the failure chain.

Check progress when evidence stalls, failures repeat, a stage materially exceeds its estimate or route cost changes. Adjust the method or split independently completable work. Elapsed time alone does not pause a goal or invalidate a healthy long-running check. Avoid open-ended environment repair.

Ask only when an unresolved product decision, a new permission, a scope expansion or a real external prerequisite prevents the next dependent step. State the exact boundary and continue independent work. Follow the current goal tool's status rules: pause only at the user's request; mark blocked only after the required repeated blocker audit and when no meaningful progress remains.

## Communicate and close

Progress updates should explain new facts, remaining uncertainty and the next useful action. Do not repeat a full matrix or fixed report template each turn.

Before closure, verify the affected acceptance items, remaining external gaps, required cleanup and delivery records. Follow project simulator/device lifecycle rules. Preserve the distinction between local delivery and external acceptance; mark the original goal complete only when its required work is done.

Before a pause, external wait or handoff, save the active outcome and constraints, changes and applicable evidence, failure-chain history, unresolved gaps, recovery locations and next action in the existing task record. Preserve the work so a successor can continue without rediscovery; finish independent authorized work that is still possible. At acceptance, deliver and list optional polish separately. Keep the final diff scoped and report what changed, what was actually verified and what remains unresolved. The skill itself grants no commit, publication, messaging or deployment permission.
