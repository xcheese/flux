# Current Shared Memory Index

只放当前最重要、最高频、最需要 ChatGPT / Codex 快速读取的信息。历史流水继续留在 `memory.md` 或具体 `entries/`。

## 当前活跃项目

- `thinking-lens-system`：专家团 / lens / persona fidelity 仍是当前活跃系统。
- `shared-memory-v1`：本次新增轻量结构化记忆协议、模板、索引和校验。

## 当前重点目标

- 保持 `memory.md` 作为 ChatGPT / Codex 共享入口。
- 新增结构化条目优先写入 `entries/`，并通过脚本生成索引。
- 不引入数据库、向量库、后端服务或外部依赖。

## 关键系统路径

- Shared memory fallback：`90_system/shared_memory/memory.md`
- Protocol：`90_system/shared_memory/protocol.md`
- Schema：`90_system/shared_memory/schema.md`
- Lifecycle：`90_system/shared_memory/lifecycle.md`
- Templates：`90_system/shared_memory/templates/`
- Entries：`90_system/shared_memory/entries/`
- Indexes：`90_system/shared_memory/indexes/`
- Validation：`90_system/shared_memory/scripts/validate_memory.mjs`
- Index builder：`90_system/shared_memory/scripts/build_indexes.mjs`

## 最新重要产物

- `90_system/shared_memory/entries/growth/mem-20260516-ai-high-value-usage-map.md`
- `90_system/shared_memory/entries/internalized/mem-20260520-global-codex-guardrails.md`
- `90_system/shared_memory/entries/growth/mem-20260520-thinking-lens-system.md`

## 最近有效变化

- 2026-05-26：Shared Memory 升级为轻量记忆系统 v1，新增协议、schema、生命周期、模板、样例 entries、索引和校验脚本。
- 2026-05-26：生成 `AI news` 日报 `40_outputs/daily_ai/2026-05-26.md` 与精华图 `40_outputs/daily_ai/2026-05-26_visual.svg`。
- 2026-05-25：新增 `20_wiki/skills/agent_skill_candidate_list.md`，用于评估可纳入 Flux 的 agent skills。
- 2026-05-20：新增 Global Codex 配置源和 `coding-guardrails` skill。
- 2026-05-20：系统性升级 Thinking Lens / Persona Fidelity / People RAG。

## 下一步动作

- 后续新增长期记忆时，优先从 `templates/` 创建 entry。
- 每次新增或修改 entries 后运行 `node 90_system/shared_memory/scripts/validate_memory.mjs`。
- 需要更新项目/类型/层级索引时运行 `node 90_system/shared_memory/scripts/build_indexes.mjs`。
