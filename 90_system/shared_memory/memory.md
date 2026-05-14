---
type: shared_memory
owner: momo
scope: cross-agent
updated_at: 2026-05-14
status: active
---

# Shared Memory（跨工作区 / 跨设备 / 跨 agent）

## Metadata

- Type: `shared_memory`
- Scope: `cross-agent`
- Updated: `2026-05-14`
- Status: `active`

## Purpose

这是一个“跨 agent 任务交接索引”，用于让 Codex 本地任务与手机端 ChatGPT 对话快速对齐：最近做了什么、为什么这么做、产物在哪里、哪些决策已定、接下来谁做什么。

写入前自检：**是否能让未来的 ChatGPT/Codex 少问一次问题、少重复一次判断、少踩一个坑？**

若不能，就不写。

## Current Focus

- Active project: `thinking-lens-system`
- Current goal: 让 ChatGPT 项目“顾问”可通过 GitHub raw 路径感知 Flux thinking lens
- Latest artifact: `90_system/skills/people/andrej-karpathy.md`, `90_system/skills/people/steve-jobs.md`, `90_system/skills/people/charlie-munger.md`, `90_system/skills/people/naval-ravikant.md`
- Memory entry: `90_system/shared_memory/memory.md`
- Next action for ChatGPT: 先读 `90_system/shared_memory/memory.md`，再按 `90_system/skills/index.md` 或 `90_system/skills/skill_router.md` 选择 thinking lens
- Blockers: 暂无

## Recent Changes

- 2026-05-14: Thinking Lens System 支持受控 persona mode：用户明确要求沉浸式/口吻时可启用，但观点质量、事实边界和行动建议优先
- 2026-05-14: 新增会话内自动记录规则：本会话产生的高复用价值讨论，Codex 需整理进 shared memory 并单独提交推送
- 2026-05-14: 本地 dogfood 专家团评价当前知识库：方向正确，下一阶段应收敛为“投喂 -> 消化 -> 下一步行动”的最小闭环
- 2026-05-14: 扩展 Thinking Lens System，新增 Karpathy、Steve Jobs、Charlie Munger、Naval Ravikant 四个 people lens
- 2026-05-14: 新增 Thinking Lens System，入口为 `90_system/skills/index.md` 与 `90_system/skills/skill_router.md`
- 2026-05-14: 将 Nuwa / Elon Musk skill 转化为 Flux 可用 thinking lens: `90_system/skills/people/elon-musk.md`
- 2026-05-13: 新增抖音线索 `郭宇：AI会给我们的生活带来什么样的变化`，当前为 raw/low confidence，需补转录或页面内容
- 2026-05-13: 执行 `AI情报员.skill`，更新当天输出为 Google GTIG AI 安全报告、Mistral 3、RLM + RL 三条非重复情报
- 2026-05-13: 全面优化 `ai-news`，角色名改为 `AI情报员.skill`，强化全球 AI 跟踪、中文化、去重、时效与价值筛选
- 2026-05-13: 新增共享记忆入口文件 `90_system/shared_memory/memory.md` 与同步脚本 `90_system/shared_memory/sync.sh`
- 2026-05-13: `memory.md` 索引路径统一为仓库相对路径（便于远端/手机端引用）

## Artifact Index

### Shared Memory

- memory: `90_system/shared_memory/memory.md`
- sync script: `90_system/shared_memory/sync.sh`

### Skills

- ai-news: `90_system/skills/ai-news/SKILL.md`
- thinking lens index: `90_system/skills/index.md`
- thinking lens router: `90_system/skills/skill_router.md`
- people/andrej-karpathy: `90_system/skills/people/andrej-karpathy.md`
- people/charlie-munger: `90_system/skills/people/charlie-munger.md`
- people/elon-musk: `90_system/skills/people/elon-musk.md`
- people/naval-ravikant: `90_system/skills/people/naval-ravikant.md`
- people/steve-jobs: `90_system/skills/people/steve-jobs.md`

### Outputs

- daily_ai:
  - 2026-05-13: `40_outputs/daily_ai/2026-05-13.md`

### Raw Inputs

- douyin:
  - 2026-05-13: `10_raw/links/2026-05-13_douyin_guo-yu_ai_life_changes.md`

## Thinking Lens System

- Status: `active`
- Updated: `2026-05-14`
- Skill directory: `90_system/skills/`
- Router entry: `90_system/skills/skill_router.md`
- People lens directory: `90_system/skills/people/`
- Index: `90_system/skills/index.md`
- Available people lenses:
  - Andrej Karpathy: `90_system/skills/people/andrej-karpathy.md`
  - Charlie Munger: `90_system/skills/people/charlie-munger.md`
  - Elon Musk: `90_system/skills/people/elon-musk.md`
  - Naval Ravikant: `90_system/skills/people/naval-ravikant.md`
  - Steve Jobs: `90_system/skills/people/steve-jobs.md`
- GitHub raw paths:
  - Skills index: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/index.md`
  - Skill router: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/skill_router.md`
  - Andrej Karpathy lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/andrej-karpathy.md`
  - Charlie Munger lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/charlie-munger.md`
  - Elon Musk lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/elon-musk.md`
  - Naval Ravikant lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/naval-ravikant.md`
  - Steve Jobs lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/steve-jobs.md`
- Usage:
  - 不确定用哪个 lens 时，先读取 Skill router raw 路径
  - 明确要调用某个 lens 时，直接读取对应 people lens raw 路径
- Guardrails:
  - lens 默认是分析框架；当用户明确要求“角色扮演”“沉浸式”“用某某口吻”时，可启用受控 persona mode
  - persona mode 是基于公开材料的风格化讨论，不代表本人，不声称替本人发言
  - 观点质量、事实边界和行动建议优先于口吻
  - 每次最多调用 1-2 个 lens
  - 必须区分事实、推断、行动建议和待验证信息
  - 涉及最新事实、价格、政策、法律、医学、金融或安全问题时，先验证再判断

## Active Records

### 2026-05-14 / thinking-lens-persona-mode

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `medium`
- Updated: `2026-05-14`
- Context: 用户认为专家团应加回角色扮演和口吻，以便讨论时更沉浸；同时强调重心仍然在内容、观点和想法。
- Decision:
  - Thinking Lens System 默认仍使用分析型 lens
  - 用户明确要求“角色扮演”“沉浸式”“用某某口吻”时，可启用受控 persona mode
  - persona mode 允许轻量风格化表达，但必须说明是基于公开材料的模拟，不代表本人
  - 内容判断、事实边界、反例和行动建议优先于口吻
- Updated artifacts:
  - `90_system/skills/skill_router.md`
  - `90_system/skills/index.md`
  - `90_system/skills/people/elon-musk.md`
  - `90_system/skills/people/andrej-karpathy.md`
  - `90_system/skills/people/steve-jobs.md`
  - `90_system/skills/people/charlie-munger.md`
  - `90_system/skills/people/naval-ravikant.md`
- Risks:
  - 沉浸式口吻可能让用户误以为是本人观点
  - 口吻可能掩盖事实不确定性或模型推断
- Guardrail:
  - 必须保留“事实 / lens 推断 / 行动建议 / 待验证信息”的输出习惯
  - 不编造人物对未查证事件或最新事实的真实看法

### 2026-05-14 / memory-auto-capture-rule

- Project: `shared-memory`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-14`
- Context: 用户要求以后本会话里产生的有价值讨论信息，自动按合适内容整理方式写入记忆文件，并提交到远端。
- Rule:
  - 本会话中若出现会影响后续判断/复用的内容，Codex 应主动整理进 `90_system/shared_memory/memory.md`
  - 记录后应只 stage 相关 memory 文件，单独 commit，并 push 到 `origin/main`
  - 记录内容以结论、决策、产物、风险、下一步为主，不记录闲聊、完整日志、隐私或低价值过程
  - 若工作区存在无关未提交改动，必须避开，不得一起提交
- Trigger examples:
  - 用户明确做出长期规则或偏好
  - 新增/调整系统架构、skill、router、workflow
  - 产出可复用模板、prompt、lens、SOP
  - 形成影响后续工作的关键判断、风险或下一步
- Boundaries:
  - 不能在没有工具执行机会时“后台自动”写入；只能在 Codex 有机会执行文件修改和 git 操作时落实
  - 不记录敏感信息、账号凭据、客户隐私、完整日志或长篇原文

### 2026-05-14 / local-knowledge-base-review

- Project: `personal-ai-knowledge-base`
- Status: `reviewed`
- Priority: `medium`
- Updated: `2026-05-14`
- Context: 用户要求本地测试专家团能力，评价当前知识库方案及其对个人成长的价值。
- Lens used:
  - `people.steve-jobs`: 产品聚焦、体验、端到端闭环
  - `people.naval-ravikant`: 个人杠杆、复利资产、时间自由
- Key judgment:
  - 当前知识库不只是笔记目录，而是“个人 AI 工作流操作系统”的雏形
  - 核心闭环 `raw -> wiki -> outputs -> 回写 wiki` 方向正确
  - 下一阶段不应继续扩目录或自动化，应收敛为 `投喂 -> 消化 -> 下一步行动`
- Personal growth value:
  - 高价值不在“保存信息”，而在把 AI 情报、模板、shared memory、thinking lens、复盘结论转化为可复用资产
  - 北极星指标建议：每周至少沉淀 1 个能让下周更省力的资产
- Risks:
  - 系统入口过多，可能变重
  - `daily_ai` 可能停留在归档，未转化为行动
  - 本地 Web 图谱可能变成展示性功能，而非决策辅助
- Suggested next actions:
  - 跑一次真实周复盘：`40_outputs/weekly_reviews/2026-W20.md`
  - 给 `daily_ai` 条目增加状态：`已行动 / 已沉淀 / 暂存 / 丢弃`
  - 给概念笔记补 `next_action` 字段，防止静态收藏
  - 连续 2 周验证当前闭环，再考虑新增自动化

### 2026-05-14 / thinking-lens-expansion

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-14`
- Context: 用户希望继续把 Nuwa 中 Karpathy、乔布斯、芒格、纳瓦尔四个人物 skill 转化为 Flux 可用 thinking lens。
- Result: 新增四个 people lens，并同步扩展 `skill_router.md`、`index.md` 与 shared memory raw 路径索引。
- Artifacts:
  - `90_system/skills/people/andrej-karpathy.md`
  - `90_system/skills/people/steve-jobs.md`
  - `90_system/skills/people/charlie-munger.md`
  - `90_system/skills/people/naval-ravikant.md`
  - `90_system/skills/skill_router.md`
  - `90_system/skills/index.md`
  - `90_system/shared_memory/memory.md`
- Decisions:
  - 四个 lens 默认内容优先；显式请求沉浸式讨论时允许受控 persona mode 和风格化口吻
  - Karpathy 用于 AI 工程、模型可靠性、教育和开源实现
  - Steve Jobs 用于产品、设计、战略聚焦和端到端体验
  - Charlie Munger 用于投资、商业判断、逆向思考、认知偏误和激励机制
  - Naval Ravikant 用于财富、杠杆、职业选择、人生哲学和独立思考
- Risks:
  - 多 lens 调用容易制造“看似全面”的噪声；仍维持每次最多调用 1-2 个
  - 每个 lens 都有明确盲区，必须通过 router 输出冲突和边界
- Next:
  - For ChatGPT: 先读 `90_system/skills/index.md`，再按问题类型选择 1-2 个 lens；涉及最新事实时先验证
  - For Codex: 后续新增 lens 时继续同步 router、index、memory 三处入口

### 2026-05-14 / thinking-lens-system

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-14`
- Context: 用户希望把 `nuwa-skill` 仓库中 Elon Musk 的 skill 转化为 Flux 可用 thinking lens，并通过 GitHub raw 路径让 ChatGPT 项目“顾问”可感知。
- Result: 新增 Elon Musk thinking lens、最小 skill router、最小 skills index，并在 shared memory 中加入 Thinking Lens System 入口。
- Artifacts:
  - `90_system/skills/people/elon-musk.md`
  - `90_system/skills/skill_router.md`
  - `90_system/skills/index.md`
  - `90_system/shared_memory/memory.md`
- Decisions:
  - 默认内容优先，抽象工程 / 成本 / 第一性原理 lens；显式请求沉浸式讨论时允许受控 persona mode 和风格化口吻
  - 每次 lens 调用最多 1-2 个
  - `Source Notes` 保留 Nuwa 来源、Elon Musk 独立 skill 来源和少量高可信公开来源
  - GitHub raw 主入口使用 `main` 分支，便于 ChatGPT 项目直接读取
- Risks:
  - Elon Musk lens 在工程和成本问题上强，但在公共治理、法律、公关、组织创伤和高信任协作问题上容易误判
  - 如果 ChatGPT 未先读取 `skill_router.md` 或 lens 文件，可能仍按普通对话而非结构化 lens 工作
- Next:
  - For ChatGPT: 先读取 `90_system/shared_memory/memory.md`，再读取 `90_system/skills/index.md`；分析工程/成本问题时可调用 `people.elon-musk`
  - For Codex: 后续新增人物 lens 时，同步更新 `90_system/skills/index.md`、`90_system/skills/skill_router.md` 与本节

### 2026-05-13 / ai-news-skill

- Project: `ai-news`（手动触发的 AI 高价值信息采集）
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-13`
- Context: 把“每日 AI 高价值信息采集”从 automation 改为手动触发能力，避免依赖本地机器常开。
- Result: 已用 `AI情报员.skill` 更新 `2026-05-13` 输出；本轮排除历史推荐过的 OpenAI Realtime、vLLM `v0.20.2`、AutoMat，改选 Google GTIG AI 安全报告、Mistral 3、RLM + RL。
- Artifacts:
  - `90_system/skills/ai-news/SKILL.md`
  - `40_outputs/daily_ai/2026-05-13.md`
  - 本地安装：`~/.codex/skills/ai-news` → `90_system/skills/ai-news`
- Decisions:
  - 采集改为手动触发：用户输入 `ai news` 时执行
  - 采集目标从“每日 3 条技术更新”升级为“帮助用户全面跟上全球 AI 发展并促进个人成长”
  - 信息源优先第一手资料；也允许专业媒体、公知性人物、垂直 AI 大 V，但必须区分事实/观点/线索
  - 历史推荐过的链接、论文、版本发布、产品更新或核心观点默认跳过
- Risks:
  - 若未来输出不先查 `40_outputs/daily_ai/`，可能重复推荐历史内容
- Next:
  - For ChatGPT: 需要时读取 `90_system/shared_memory/memory.md` 与当天输出（见 Artifact Index）来对齐上下文
  - For Codex: 下一次执行 `ai news` 前先检查 `40_outputs/daily_ai/`，避免历史重复；完成后更新本文件和 `Recent Changes`
  - For User: 在 ChatGPT 中说“先读 shared memory”，让 ChatGPT 读取本文件后再继续讨论。

## Monthly Summary

### 2026-05

- Project: `thinking-lens-system`
- Key decisions: 新增 Flux thinking lens 目录、router、index；people lenses 已包含 Elon Musk、Andrej Karpathy、Steve Jobs、Charlie Munger、Naval Ravikant；GitHub raw 入口绑定 `main`
- Final artifacts: `90_system/skills/people/elon-musk.md`，`90_system/skills/people/andrej-karpathy.md`，`90_system/skills/people/steve-jobs.md`，`90_system/skills/people/charlie-munger.md`，`90_system/skills/people/naval-ravikant.md`，`90_system/skills/skill_router.md`，`90_system/skills/index.md`
- Open todos: 可继续扩展其他人物 lens，并完善多 lens 冲突处理
- Risks: lens 是公开资料抽象，不代表本人观点；persona mode 必须避免冒充本人和未验证事实判断

- Project: `ai-news`（手动触发采集）
- Key decisions: 采集从“每日自动”改为“手动触发（ai news）”；角色升级为 `AI情报员.skill`；高时效、高价值、中文化、去重优先
- Final artifacts: `90_system/skills/ai-news/SKILL.md`，`40_outputs/daily_ai/2026-05-13.md`
- Open todos: 暂无
- Risks: 执行采集时必须先查历史输出，否则会重复推荐旧内容

## Record Rules（只抓关键）

- 只记录会影响后续判断/复用的内容：**结论、产出物位置、下一步、关键约束/风险、已验证结果**。
- 本会话启用自动记录：当讨论产生高复用价值结论、规则、产物或下一步时，Codex 应主动整理进本文件，并单独提交推送到远端。
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
