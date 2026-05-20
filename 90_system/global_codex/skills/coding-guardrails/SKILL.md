---
name: coding-guardrails
description: Use when writing, editing, reviewing, refactoring, debugging, testing, or shipping code. Enforces explicit assumptions, minimal scoped changes, verification, diff review, and clear final reporting.
---

# Coding Guardrails

Use this skill for non-trivial coding, debugging, refactoring, review, test, build, or release tasks. Do not slow down trivial one-line answers with unnecessary ceremony.

## Preflight

- Restate the real goal in one sentence for yourself.
- Identify assumptions, intended file scope, and success criteria.
- Only ask the user a question when ambiguity blocks safe execution.
- Pick the narrowest useful verification command before editing.

## Implementation

- Make the smallest viable diff that solves the request.
- Match local style, naming, framework choices, and existing helper APIs.
- Do not add speculative features, broad configurability, or unrelated abstractions.
- Do not clean up unrelated code, regenerate unrelated artifacts, or revert user changes.
- If you discover unrelated risk, mention it separately instead of expanding the patch.

## Verification

- Run the narrowest relevant check, test, build, or smoke test.
- If verification cannot run, state the blocker and what remains unverified.
- Inspect `git diff` before final response or commit.
- Confirm the diff contains only task-relevant changes.

## Final Response

- State what changed.
- State what was verified.
- State remaining risk, unverified areas, or follow-up decisions.
