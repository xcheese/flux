---
type: shared_memory
owner: momo
scope: cross-agent
updated_at: 2026-05-13
status: active
---

# 共享记忆（跨工作区 / 跨设备 / 跨 agent）

目标：让 Codex 在多个工作区做过的“关键事情”可被手机端 ChatGPT 快速对齐；信息**可追溯、可压缩、可长期维护**。

## 记录规则（只抓关键）

- 只记录会影响后续决策/复用的内容：**结论、产出物位置、下一步、关键约束/风险、已验证结果**。
- 不记录过程细节、不粘大段日志、不做逐行变更罗列。
- 每条记录尽量包含：
  - `Context`（任务/背景一句话）
  - `Result`（做成了什么）
  - `Artifacts`（产出物链接/路径）
  - `Next`（下一步 / 等待谁）

## 溢出前压缩（信息压缩策略）

- **滚动窗口**：保留最近 30 条为“详细条目”；更早条目压缩进“月度摘要”。
- **压缩目标**：把 N 条归并成 3–5 个要点：哪些项目在推进、哪些决策已定、哪些坑要避。
- **压缩触发**：当文件 > ~400 行或出现 3 个月以上历史时，立即执行一次压缩。

## 快速索引

- 今日 AI 采集输出：[/Users/momo/Documents/work/知识库/40_outputs/daily_ai/2026-05-13.md](/Users/momo/Documents/work/知识库/40_outputs/daily_ai/2026-05-13.md)
- 手动触发采集 skill：[/Users/momo/Documents/work/知识库/90_system/skills/ai-news/SKILL.md](/Users/momo/Documents/work/知识库/90_system/skills/ai-news/SKILL.md)

---

## 2026-05（详细条目）

### 2026-05-13

- Context: 把“每日 AI 高价值信息采集”从 automation 改成手动触发能力，避免依赖本地机器常开。
  - Result: 新建 `ai-news` skill（触发词：`ai news`），并完成安装（软链接到 Codex skills 目录）。
  - Artifacts:
    - [/Users/momo/Documents/work/知识库/90_system/skills/ai-news/SKILL.md](/Users/momo/Documents/work/知识库/90_system/skills/ai-news/SKILL.md)
    - `/Users/momo/.codex/skills/ai-news` → `/Users/momo/Documents/work/知识库/90_system/skills/ai-news`
  - Next: 在手机端 ChatGPT 讨论时，直接引用本文件或当天输出笔记对齐上下文。

