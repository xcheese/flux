---
type: shared_memory
owner: momo
scope: cross-agent
updated_at: 2026-05-15
status: active
---

# Shared Memory（跨工作区 / 跨设备 / 跨 agent）

## Metadata

- Type: `shared_memory`
- Scope: `cross-agent`
- Updated: `2026-05-15`
- Status: `active`

## Purpose

这是一个“跨 agent 任务交接索引”，用于让 Codex 本地任务与手机端 ChatGPT 对话快速对齐：最近做了什么、为什么这么做、产物在哪里、哪些决策已定、接下来谁做什么。

写入前自检：**是否能让未来的 ChatGPT/Codex 少问一次问题、少重复一次判断、少踩一个坑？**

若不能，就不写。

## Current Focus

- Active project: `douyin-video-analysis`
- Current goal: 将用户投喂的抖音视频链接升级为可产出完整中文分析报告的工作流
- Latest artifact: `10_raw/links/2026-05-13_douyin_guo-yu_ai_life_changes.md`
- Memory entry: `90_system/shared_memory/memory.md`
- Next action for ChatGPT: 用户发抖音链接时，优先确认是否有视频正文/字幕/转录；证据不足时只登记 raw，不输出完整报告
- Blockers: 暂无

## Recent Changes

- 2026-05-15: 新增 `抖音视频分析员.skill` 与 `video_analysis` 模板，要求先拿证据再分析，避免只凭短链/标题生成报告
- 2026-05-15: Dogfood 测试抖音视频分析流程，覆盖郭宇视频线索为 `video_analysis` 报告；证据等级 `medium`，来源为抖音分享文本 + 疑似同源转写稿
- 2026-05-15: 验证 ChatGPT 可通过 cachebust 读取最新版 shared memory，并成功使用 Single-file Fallback Router 识别 5 个 lens 与 persona mode 规则
- 2026-05-14: 增加 shared memory 单文件降级规则：若 ChatGPT 能读 memory 但读不了 index/router raw，直接使用 memory 内置的最小 router 和 persona mode 规则
- 2026-05-14: 记录 ChatGPT stale read 问题：若 GPT 报 `updated_at: 2026-05-13`，说明读到旧缓存/旧项目文件/错误来源；当前 GitHub raw 已验证为 `2026-05-14`
- 2026-05-14: 记录 ChatGPT 访问限制：项目指令只提供规则，不赋予联网/GitHub 访问能力；若 raw 读取失败，应检查 Web/GitHub connector 或改用项目文件/自定义 GPT
- 2026-05-14: 明确默认提交推送规则：以后 Codex 对知识库做有效更新后默认 commit + push，尤其是 `memory.md`
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
- douyin-video-analysis: `90_system/skills/douyin-video-analysis/SKILL.md`
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

### Templates

- video analysis: `90_templates/video_analysis.md`

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

### Single-file Fallback Router

若 ChatGPT 能读取本 `shared_memory`，但读取 `index.md` 或 `skill_router.md` raw URL 失败，则直接使用以下最小路由，不要要求用户粘贴全文：

- `people.elon-musk`: 工程系统、成本压缩、第一性原理、制造与交付、垂直整合、快速迭代
- `people.andrej-karpathy`: AI 工程、模型可靠性、AI 教育、开源实现、LLM 产品设计
- `people.steve-jobs`: 产品、设计、战略聚焦、端到端体验、品牌叙事、技术与人文
- `people.charlie-munger`: 投资、商业判断、多元思维模型、逆向思考、认知偏误、激励机制
- `people.naval-ravikant`: 财富、杠杆、职业选择、人生哲学、独立思考、一人公司

Routing rules:

- 每次最多选择 1-2 个 lens
- 选择后必须说明：`selected_lens`、`reason`、`conflict`、`synthesis`、`response_mode`
- 默认 `response_mode: analysis`
- 当用户明确要求“角色扮演 / 沉浸式 / 用某某口吻”时，允许 `response_mode: persona`
- persona mode 可以使用风格化口吻和第一人称讨论框架，但必须说明是基于公开材料的模拟，不代表本人
- 输出必须区分：事实、lens 推断、行动建议、待验证信息
- 若涉及最新事实、价格、政策、法律、医学、金融或安全问题，必须先验证；无法验证时说明边界

## Active Records

### 2026-05-15 / douyin-video-analysis-workflow

- Project: `douyin-video-analysis`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-15`
- Context: 用户会经常投喂抖音分享视频链接，并明确要求不满足于标题级摘要，需要视频内容、观点和 Codex 思考后的完整文字分析报告。
- Decision:
  - 新增独立 skill：`90_system/skills/douyin-video-analysis/SKILL.md`
  - 新增报告模板：`90_templates/video_analysis.md`
  - 后续抖音链接必须先判定证据等级：`high` / `medium` / `low`
  - 只有拿到转录、字幕、视频文件、关键截图/OCR 或足够页面内容时，才输出完整分析报告
  - 只有短链/标题时，只能登记为 `raw` / `low confidence`，列出待补材料，不伪装成完整分析
- Artifacts:
  - `90_system/skills/douyin-video-analysis/SKILL.md`
  - `90_templates/video_analysis.md`
  - `90_system/tools/video_link_ingestion.md`
- Next:
  - For ChatGPT: 若用户贴抖音链接，先要求或尝试获取转录/截图/视频正文，再按 `video_analysis` 模板分析
  - For Codex: 后续触发该 skill 时，先查重，再尝试浏览器/页面/截图/OCR/转录链路，最后入库并更新 shared memory
  - For User: 若希望得到完整报告，优先提供视频文件、字幕、转录或关键截图；只给短链时可能只能登记待补

### 2026-05-15 / douyin-guoyu-analysis-dogfood

- Project: `douyin-video-analysis`
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-15`
- Context: 用户要求从近期抖音链接中选一个测试新视频分析能力，并覆盖原始文档。
- Result:
  - 选择 `郭宇：AI会给我们的生活带来什么样的变化`
  - 公开搜索找到疑似同源/同主题转写稿：FinSec `郭宇：知识工作者的职业生涯只剩6个月了`
  - 原文档已从 `link_note` / `raw` 覆盖为 `video_analysis` / `processed`
  - 证据等级设为 `medium`，明确标注未拿到抖音原始字幕/视频文件
- Artifacts:
  - `10_raw/links/2026-05-13_douyin_guo-yu_ai_life_changes.md`
- Next:
  - For ChatGPT: 评估该报告结构是否满足“视频内容 + 观点 + 独立判断 + 行动建议”
  - For Codex: 下一条抖音链接优先尝试浏览器/截图/OCR；若找到二手转写稿，必须标注证据等级和来源边界
  - For User: 若想升级为 `high` 置信度，补充视频文件、字幕或关键截图

### 2026-05-15 / single-file-router-verified

- Project: `thinking-lens-system`
- Status: `verified`
- Priority: `high`
- Updated: `2026-05-15`
- Context: 用户将带 cachebust 的 shared memory 提供给 ChatGPT 测试，ChatGPT 成功读取并使用 `Single-file Fallback Router`。
- Verified result:
  - ChatGPT 返回 `updated_at: 2026-05-14`
  - ChatGPT 识别出 5 个 people lens：Andrej Karpathy、Charlie Munger、Elon Musk、Naval Ravikant、Steve Jobs
  - ChatGPT 正确复述 persona mode 规则：明确要求时启用；基于公开材料；不声称替本人发言；观点质量、事实边界和行动建议优先；每次最多 1-2 个 lens；区分事实、推断、行动建议和待验证信息
- Decision:
  - 跨项目/语音场景的默认启动路径优先使用 shared memory 单文件入口
  - 若后续 ChatGPT 读不到 index/router raw，不再要求用户粘贴内容，直接使用 `Single-file Fallback Router`
- Practical prompt:
  - `请读取最新版 shared memory；若 index/router raw 失败，直接使用 Single-file Fallback Router 启动专家团。`

### 2026-05-14 / single-file-memory-router-fallback

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-14`
- Context: 用户反馈 ChatGPT 能通过 cachebust 读取最新 shared memory，但继续读取 Skills index / Skill router raw URL 失败，导致无法进入 persona mode 规则。
- Decision:
  - 将最小 lens registry、router rules 和 persona mode rules 直接内置到 `memory.md`
  - 以后 ChatGPT 只要能读 shared memory，就能用最小专家团能力；读取 index/router 失败时不应要求用户粘贴全文
- Fallback behavior:
  - ChatGPT 读不到 index/router raw 时，应使用 `Single-file Fallback Router`
  - 仍需每次最多 1-2 个 lens，并输出选择原因、冲突和综合判断
- Risk:
  - shared memory 会稍微变长，但换来跨项目/语音场景更稳定

### 2026-05-14 / chatgpt-memory-access-limits

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-14`
- Context: 用户已按提示设置 ChatGPT 项目规则，但 ChatGPT 仍回复无法访问 GitHub raw shared memory，需要用户提供 raw 内容或链接。
- Diagnosis:
  - ChatGPT Project Instructions / Custom Instructions 只能告诉模型“应该做什么”，不能自动赋予联网、GitHub connector 或浏览 raw URL 的能力
  - 若当前 ChatGPT 会话没有可用浏览/连接器能力，或 raw.githubusercontent.com 在该环境下访问失败，模型只能承认无法读取
  - 语音场景尤其可能只传递文本意图，不保证连接器/浏览工具可用
- Practical rule:
  - 与 ChatGPT 测试时，先要求它明确报告是否具备联网/浏览/GitHub connector 能力，不要让它基于旧记忆推断
  - 推荐测试语句：`请不要猜测。请尝试读取 https://raw.githubusercontent.com/xcheese/flux/main/90_system/shared_memory/memory.md，并回报 updated_at 与 Thinking Lens System 下的 raw paths；如果不能读取，请说明是没有工具、工具失败，还是链接访问失败。`
  - 若失败，长期方案是启用 GitHub connector / Web browsing，或把 `memory.md`、`skill_router.md`、`index.md` 作为 Project files / Custom GPT knowledge 提供
- Boundary:
  - Codex 可以保证 GitHub 文件已提交推送且 raw 链接可从本地 curl 访问，但不能保证每个 ChatGPT 会话都有外部读取能力

### 2026-05-14 / chatgpt-stale-memory-read

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-14`
- Context: 用户测试 ChatGPT 读取 shared memory，ChatGPT 回复已成功读取，但返回 `updated_at: 2026-05-13` 且只看到旧的 `ai-news` skill；这与当前 GitHub raw 内容不一致。
- Verified fact:
  - Codex 本地执行 `curl -L https://raw.githubusercontent.com/xcheese/flux/main/90_system/shared_memory/memory.md`，返回 `updated_at: 2026-05-14`
  - 当前 raw 内容包含 Thinking Lens System、Skill router raw、Skills index raw 和 5 个 people lens raw paths
- Diagnosis:
  - 若 ChatGPT 报 `updated_at: 2026-05-13`，它没有读取到最新 raw 内容
  - 可能原因包括：使用了旧 Project file / 旧缓存 / 旧会话记忆 / 错误链接 / 工具缓存
- Practical rule:
  - 测试时要求 ChatGPT 回显 `updated_at`、`Recent Changes` 第一条和 `Thinking Lens System` 下的 `Skills index` raw path
  - 若仍返回旧内容，使用带 cache-busting 的 URL 或 commit 固定 URL，并要求它不要使用项目文件或旧记忆
  - 推荐 cache-busting URL: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/shared_memory/memory.md?cachebust=2026-05-14-01`
  - 推荐固定版本 URL: `https://raw.githubusercontent.com/xcheese/flux/c4a25c5/90_system/shared_memory/memory.md`

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
- Context: 用户要求以后本会话里产生的有价值讨论信息，自动按合适内容整理方式写入记忆文件，并提交到远端；随后进一步明确“以后更新都要自动提交和 push，特别是记忆文件”。
- Rule:
  - 本会话中若出现会影响后续判断/复用的内容，Codex 应主动整理进 `90_system/shared_memory/memory.md`
  - Codex 对知识库做出有效文件更新后，默认 commit 并 push 到 `origin/main`，除非用户明确说“先别提交/别推”
  - 记忆文件更新尤其必须默认单独提交推送；若同轮还有其他产物，可按任务相关性一起提交或拆成独立提交
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
- 默认提交推送：以后 Codex 对知识库做出有效更新后，默认 commit + push；用户明确要求暂不提交/暂不推送时除外。尤其是 `90_system/shared_memory/memory.md` 的更新，应默认落远端。
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
