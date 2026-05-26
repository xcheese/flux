# Shared Memory Schema v1

所有 `entries/` 下的正式记忆条目都使用 Markdown + YAML frontmatter。

## Frontmatter

```yaml
---
id: "mem-YYYYMMDD-short-slug"
title: ""
memory_type: ""
tier: ""
status: "active"
project: ""
scope: ""
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
owner: "user"
source:
  type: ""
  path: ""
confidence: "low | medium | high"
evidence: "low | medium | high"
related:
  - ""
tags:
  - ""
next_action: ""
---
```

## 必填字段

- `id`
- `title`
- `memory_type`
- `tier`
- `status`
- `created_at`
- `updated_at`

## `tier` 枚举

- `episodic`
- `internalized`
- `growth`
- `core_identity`

## `memory_type` 枚举

- `task_handoff`
- `project_context`
- `decision`
- `user_preference`
- `working_rule`
- `artifact_index`
- `lesson`
- `workflow`
- `prompt`
- `risk`
- `idea`
- `reference`

## `status` 枚举

- `draft`
- `active`
- `validated`
- `superseded`
- `deprecated`
- `archived`

## `confidence`

- `low`：信息不完整、推断较多或尚未验证。
- `medium`：有明确来源或一次验证，但仍可能变化。
- `high`：来源明确，多次复用或已被验证。

## `evidence`

- `low`：主要来自对话、记忆或未验证线索。
- `medium`：有文件、产物或局部验证。
- `high`：有稳定路径、产物、脚本校验或多源证据。

## 路径规则

- `source.path` 和 `related` 必须引用真实存在的仓库路径，或明确写 `""`。
- 不要伪造未来可能存在的路径。
- 外部 URL 可以写在正文，但结构化路径优先使用仓库内相对路径。
