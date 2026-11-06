---
name: code-review
description: "审查 PR、分支或未提交代码的需求符合性与回归风险。用于代码审查或跨模块、高风险逻辑改动的收尾。"
license: MIT
metadata:
  upstream: "https://github.com/mattpocock/skills"
  upstream-path: "skills/engineering/code-review"
  upstream-revision: "c55ee46073ed923f86ce59a5eb3b6d895095d1b7"
  adaptation: "2026-09-22 scoped spec and correctness review"
---

# Code Review

Assess both requirement fidelity and implementation correctness. Use existing requirements and local conventions; no issue-tracker setup or second documentation system is required.

## Select the real review scope

Honor the user's requested PR, branch, commit, working changes or task diff. Inspect status first and preserve unrelated work.

- For a PR or branch, resolve the actual base from the PR or repository context and compare to its merge base. Include relevant local changes only when they belong to the requested review.
- For working changes, inspect staged and unstaged diffs plus relevant untracked files. A `...HEAD` comparison alone misses uncommitted work.
- For implementation closeout, review the task's changed files and necessary callers, not every pre-existing local change.
- Prefer a supplied commit/base; otherwise infer a justified base from repository context and state it briefly. Ask only when materially different plausible bases cannot be resolved.

Find requirements in the conversation, linked issue/PR, feature specs and acceptance criteria. Reuse existing Specs/runbooks. If no formal spec exists, review against the user's request and established behavior; state the coverage limit instead of blocking on a missing document.

## Apply two perspectives

**Requirements:** Look for missing or partial acceptance criteria, scope creep, incompatible contract changes, and behavior that implements the wrong intent.

**Correctness and maintainability:** Trace from the actual entrypoint through affected callers and lifecycle boundaries for concrete regressions. As relevant, inspect identity/session isolation, state transitions, pagination/cache consistency, error paths, compatibility and security boundaries. Use only the checks relevant to this diff.

Treat general code smells as leads, not findings. Report a style concern only when it violates a relevant project requirement or has a concrete maintenance/correctness consequence. Do not demand an abstraction, rewrite or new dependency solely to satisfy a generic pattern. Skip lint/type findings already settled by tooling.

Keep the two perspectives distinct while investigating, then deduplicate and prioritize their actionable findings by impact. Do not require multiple agents: use them only when delegation is permitted and the review has enough independent work to justify it.

## Challenge path coverage and assumptions

Use these questions only when the diff makes the corresponding risk relevant; project rules need only retain necessary exceptions.

- **Call chain and isolation:** Can the real entrypoint reach the changed behavior, and do downstream consumers use the intended data? Check the relevant process, document, window, storage and data scopes, including a newly created or restored scope; finding a helper is not proof of an end-to-end chain.
- **State and timing:** Do producers and consumers stay synchronized when separate representations change? Consider asynchronous host confirmation arriving after component creation, restoration or destruction. Look for one-time decisions, missed late state and stale callbacks; identify the ordering that would invalidate the result.
- **Gates and environments:** Could a central switch, extra caller guard or different platform/host entrypoint bypass the behavior? Does the test use the relevant service configuration and show the target path actually ran? A clean result with the feature disabled does not validate the enabled path.
- **Optimization claims:** Does the chosen priority match actual composition, hot paths or measurements? Are revision, environment, parameters and baseline comparable, and do the reported timings distinguish transfer, parsing/execution and presentation/wait? Check whether a local result supports the claimed online benefit.

## Verify and report

For each finding, identify the affected path, triggering condition, observable consequence and supporting evidence. Run the narrow test or inspect the caller needed to resolve a material uncertainty; check its command against the current project instructions, scripts, configuration and parameters. Label an unverified concern honestly; do not promote it into a confirmed defect.

Reuse valid checks from the current task. Rerun or broaden only after relevant changes, failures, missing evidence or a required project gate. A build is not proof of real-device or real-service behavior.

Review-only requests stay read-only. When fixes are already requested, repair in-scope confirmed issues, run affected checks and inspect the updated diff without asking for the same authorization again. Do not alter unrelated files or stage/commit/push as a side effect of review.

Return actionable findings with severity and precise file locations, or say that no actionable finding was established. Ask what conditions would make the conclusion false, then report those material limits. Distinguish source inference, mocks/simulation, browser observations, interface/API checks and real-device evidence; a result at one level or on one path does not establish global behavior. Summarize actual validation and material gaps. Avoid speculative improvement lists or a new round of decisions once the requested review is complete.
