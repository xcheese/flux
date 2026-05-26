---
id: "mem-20260520-global-codex-guardrails"
title: "Global Codex 配置与工程护栏"
memory_type: "working_rule"
tier: "internalized"
status: "active"
project: "global-codex-guardrails"
scope: "global-codex"
created_at: "2026-05-20"
updated_at: "2026-05-26"
owner: "user"
source:
  type: "system_config"
  path: "90_system/global_codex/AGENTS.md"
confidence: "high"
evidence: "high"
related:
  - "90_system/global_codex/skills/coding-guardrails/SKILL.md"
  - "90_system/global_codex/sync.sh"
  - "90_system/shared_memory/memory.md"
tags:
  - "codex"
  - "guardrails"
  - "truth-seeking"
next_action: "后续吸收 Claude/社区 skill 时，先做去重和 Codex 化改写，再同步到全局配置。"
---

# Global Codex 配置与工程护栏

## 摘要

用户要求把“求真、不骗不忽悠、把事情做到真正可用”变成长期协作规则，而不是单次项目提示。

当前实现方式：

- 全局常驻原则：`90_system/global_codex/AGENTS.md`
- Codex coding skill：`90_system/global_codex/skills/coding-guardrails/SKILL.md`
- 同步脚本：`90_system/global_codex/sync.sh`

## 工作规则

- 非平凡工程改动前明确目标、假设、范围和验收标准。
- 优先最小改动，不做投机式抽象和无关重构。
- 修改后运行最窄但有意义的验证命令。
- 结束前检查 diff，避免混入无关改动。

## 边界

全局 skill 在已经启动的 Codex 会话中不一定立刻刷新；新会话或刷新环境后更可靠。
