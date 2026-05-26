---
id: "mem-20260520-thinking-lens-system"
title: "Thinking Lens System"
memory_type: "project_context"
tier: "growth"
status: "active"
project: "thinking-lens-system"
scope: "cross-agent"
created_at: "2026-05-20"
updated_at: "2026-05-26"
owner: "user"
source:
  type: "system_index"
  path: "90_system/skills/index.md"
confidence: "high"
evidence: "high"
related:
  - "90_system/skills/skill_router.md"
  - "90_system/skills/persona_fidelity_protocol.md"
  - "90_system/rag/people/source_registry.md"
  - "90_system/rag/people/expert_team_simulation_guide.md"
  - "90_system/rag/people/persona_eval_prompts.md"
tags:
  - "thinking-lens"
  - "expert-team"
  - "persona-fidelity"
next_action: "用户提到专家团、lens、沉浸式讨论或某人物口吻时，优先读取 index/router，再按需读取人物 lens 和 RAG notes。"
---

# Thinking Lens System

## 摘要

Thinking Lens System 是 Flux 中的专家团 / 思维镜头系统，用于在复杂问题中选择 1-2 个合适 lens，并区分事实、推断、行动建议和待验证信息。

## 关键路径

- 索引：`90_system/skills/index.md`
- 路由：`90_system/skills/skill_router.md`
- Persona fidelity protocol：`90_system/skills/persona_fidelity_protocol.md`
- People RAG：`90_system/rag/people/`

## 使用方式

- 不确定用哪个 lens 时，先读 `skill_router.md`。
- 用户明确指定人物时，直接读取对应 people lens。
- 沉浸式 persona mode 默认不输出大量审计 UI，但后台仍需保持事实边界。
- 涉及最新事实、政策、法律、金融、医学、安全问题时，先验证再调用 lens。

## 边界

人物 lens 是分析框架和风格化模拟，不代表本人，也不能编造人物未公开或去世后的真实观点。
