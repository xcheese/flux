---
type: shared_memory
owner: momo
scope: cross-agent
updated_at: 2026-05-13
status: active
---

# Shared Memory（跨工作区 / 跨设备 / 跨 agent）

## Metadata

- Type: `shared_memory`
- Scope: `cross-agent`
- Updated: `2026-05-13`
- Status: `active`

## Purpose

这是一个“跨 agent 任务交接索引”，用于让 Codex 本地任务与手机端 ChatGPT 对话快速对齐：最近做了什么、为什么这么做、产物在哪里、哪些决策已定、接下来谁做什么。

写入前自检：**是否能让未来的 ChatGPT/Codex 少问一次问题、少重复一次判断、少踩一个坑？** 若不能，就不写。

## Current Focus

- Active project: `ai-news`（手动触发的 AI 高价值信息采集）
- Current goal: 让 ChatGPT 可通过 GitHub 读取共享记忆并对齐上下文
- Latest artifact: `40_outputs/daily_ai/2026-05-13.md`
- Memory entry: `90_system/shared_memory/memory.md`
- Next action for ChatGPT: 基于本文件提出“压缩/维护”与“写入规范”的改进建议（如需）
- Blockers: 暂无

## Recent Changes

- 2026-05-13: 新增共享记忆入口文件 `90_system/shared_memory/memory.md` 与同步脚本 `90_system/shared_memory/sync.sh`
- 2026-05-13: `memory.md` 索引路径统一为仓库相对路径（便于远端/手机端引用）
- 2026-05-13: 新建 `ai-news` skill 并完成本地安装（`ai news` 触发）

## Artifact Index

### Skills

- ai-news: `90_system/skills/ai-news/SKILL.md`

### Outputs

- daily_ai:
  - 2026-05-13: `40_outputs/daily_ai/2026-05-13.md`

### Shared Memory

- memory: `90_system/shared_memory/memory.md`

### Scripts

- sync script: `90_system/shared_memory/sync.sh`

### Docs

- 暂无

## Active Records

### 2026-05-13 / ai-news-skill

- Project: `ai-news`（手动触发的 AI 高价值信息采集）
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-13`
- Context: 把“每日 AI 高价值信息采集”从 automation 改为手动触发能力，避免依赖本地机器常开。
- Result: 新建 `ai-news` skill（触发词：`ai news`），并完成本地安装（软链接到 Codex skills 目录）。
- Artifacts:
  - `90_system/skills/ai-news/SKILL.md`
  - 本地安装：`~/.codex/skills/ai-news` → `90_system/skills/ai-news`
- Decisions:
  - 采集改为手动触发：用户输入 `ai news` 时执行
- Risks: 暂无
- Next:
  - For ChatGPT: 需要时读取 `90_system/shared_memory/memory.md` 与当天输出（见 Artifact Index）来对齐上下文
  - For Codex: 每次完成一个任务，在本文件追加一条记录，并更新 `Recent Changes`（最多保留 5 条）
  - For User: 在 ChatGPT 中说“先读 shared memory”，让 ChatGPT 读取本文件后再继续讨论。

## Monthly Summary

### 2026-05

- Project: `ai-news`（手动触发采集）
- Key decisions: 采集从“每日自动”改为“手动触发（ai news）”
- Final artifacts: `90_system/skills/ai-news/SKILL.md`，`40_outputs/daily_ai/2026-05-13.md`
- Open todos: 暂无
- Risks: 暂无

## Record Rules（只抓关键）

- 只记录会影响后续判断/复用的内容：**结论、产出物位置、下一步、关键约束/风险、已验证结果**。
- 不记录过程细节；不粘贴长日志/完整 diff/完整命令输出；长内容放到独立文件并在 `Artifacts` 引用。
- 记录时优先短句与列表，字段名保持稳定；路径一律用反引号包裹（仓库相对路径优先）。

## Compression Strategy（溢出前压缩）

- **滚动窗口**：保留最近 30 条为“详细条目”；更早条目压缩进“月度摘要”。
- **压缩目标**：把 N 条归并成 3–5 个要点：哪些项目在推进、哪些决策已定、哪些坑要避。
- **压缩触发**：当文件 > ~400 行或出现 3 个月以上历史时，立即执行一次压缩。
  - 压缩时保留：项目名、关键决策、最终产物路径、未完成事项、重要风险
  - 删除：低价值过程细节与重复信息

## Do Not Record

- 不记录 token、cookie、私钥、账号密码、API key。
- 不记录真实客户数据、敏感业务数据、隐私数据。
- 不记录长日志、完整 diff、完整命令输出。
- 不记录完整日报正文，只记录日报路径和一句话摘要。
- 不记录无复用价值的过程细节。
- 不记录本地绝对路径，除非该路径对 Codex 复现任务必要（默认使用仓库相对路径）。

