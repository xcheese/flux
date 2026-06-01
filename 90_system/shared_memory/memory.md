---
type: shared_memory
owner: momo
scope: cross-agent
updated_at: 2026-05-26
status: active
---

# Shared Memory（跨工作区 / 跨设备 / 跨 agent）

## Compatibility Note

`memory.md` 仍是 ChatGPT / Codex 的共享入口和 fallback index。结构化记忆系统位于 `90_system/shared_memory/`，快速入口包括：

- `90_system/shared_memory/indexes/current.md`
- `90_system/shared_memory/protocol.md`
- `90_system/shared_memory/schema.md`
- `90_system/shared_memory/lifecycle.md`
- `90_system/shared_memory/templates/`

历史流水仍保留在本文件；新增结构化记忆应优先写入 `entries/`，并更新相关索引。

## Metadata

- Type: `shared_memory`
- Scope: `cross-agent`
- Updated: `2026-05-26`
- Status: `active`

## Purpose

这是一个“跨 agent 任务交接索引”，用于让 Codex 本地任务与手机端 ChatGPT 对话快速对齐：最近做了什么、为什么这么做、产物在哪里、哪些决策已定、接下来谁做什么。

写入前自检：**是否能让未来的 ChatGPT/Codex 少问一次问题、少重复一次判断、少踩一个坑？**

若不能，就不写。

## Current Focus

- Active project: `thinking-lens-system`
- Current goal: 优化专家团信息源感知范围、沉浸式 persona rendering 与人物还原度
- Latest artifact: `90_system/skills/skill_router.md`
- Memory entry: `90_system/shared_memory/memory.md`
- Next action for ChatGPT: 若用户提到“专家团 / lens / 沉浸式讨论 / 用某某口吻”，优先读取 Thinking Lens System；若 raw index/router 失败，直接使用本文件的 Single-file Fallback Router
- Blockers: 暂无

## Recent Changes

- 2026-06-01: 生成 `AI news` 日报 `40_outputs/daily_ai/2026-06-01.md` 与精华图 `40_outputs/daily_ai/2026-06-01_visual.svg`；主线是 agent 进入可远程托管、可评测、可记忆阶段，关注 Codex Windows/remote/profiles、ITBench-AA 企业 SRE agent 评测、Eywa 证据化长期记忆架构
- 2026-05-29: 生成 `AI news` 日报 `40_outputs/daily_ai/2026-05-29.md` 与精华图 `40_outputs/daily_ai/2026-05-29_visual.svg`；主线是 Claude Opus 4.8 / Dynamic Workflows 提升长周期 agent 能力，Step 3.7 Flash 押注低成本多模态 agent 执行器，jqwik 事件暴露依赖日志 prompt injection 风险
- 2026-05-28: 生成同日增量 `AI news` 日报 `40_outputs/daily_ai/2026-05-28_late.md` 与精华图 `40_outputs/daily_ai/2026-05-28_late_visual.svg`；主线是 agent 从可用走向可治理，关注凭证委托、治理控制面和长周期 coding agent 评测
- 2026-05-28: 生成 `AI news` 日报 `40_outputs/daily_ai/2026-05-28.md` 与精华图 `40_outputs/daily_ai/2026-05-28_visual.svg`；主线是 agent 开始碰交易/支付，同时暴露 BadHost 这类基础设施安全债，并需要本地检索路由
- 2026-05-26: 将 Shared Memory 升级为轻量记忆系统 v1；新增协议、schema、生命周期、模板、样例 entries、索引和 Node 校验/索引脚本，同时保留 `memory.md` 作为共享入口
- 2026-05-26: 生成 `AI news` 日报 `40_outputs/daily_ai/2026-05-26.md` 与精华图 `40_outputs/daily_ai/2026-05-26_visual.svg`；主线是 agent 竞争从模型能力转向路由、执行环境、日志、预算和安全边界
- 2026-05-25: 新增 `20_wiki/skills/agent_skill_candidate_list.md` 与顶部精华图；结论是 Top5 skill 资产应围绕 AI 情报、视频补证、官方核验、工程护栏和长期记忆闭环，AnySearch 先进入隔离试用，不直接接入生产 `AI news`
- 2026-05-25: 分析萌萌本萌抖音视频《codex超好用skills》，报告为 `medium` evidence / `medium` confidence；结论是 AnySearch 值得进入试用清单，但不应直接进入生产知识库采集流，后续需先做 API key 安全、脚本审计和最小验证
- 2026-05-25: 分析产品君抖音视频《盘点一周AI大事(5月24日)》，报告为 `medium` evidence / `medium` confidence；结论是“高密度 AI 情报候选池，不是事实源”，后续应优先核验 AI 同传、世界模型和 Codex 真实可用性线索
- 2026-05-20: 新增专家 lens：马克·扎克伯格（Mark Zuckerberg）；已接入 people lens、router/index、People RAG、source/style/live signals 和 fallback router
- 2026-05-20: 补充专家团 Source Bias Policy：国外/国内/官方/社交媒体都可能有立场；媒体叙事不直接等于事实，需按来源层级和用途使用
- 2026-05-20: 补充 ChatGPT 侧专家团启动方式：Codex 推送不会自动进入 GPT 当前上下文；建议在“顾问”项目新开聊天并要求读取带 cachebust 的 shared memory
- 2026-05-20: 系统性升级专家团高仿真能力：新增 expert team simulation guide、persona eval prompts，并为马斯克/卡帕西/Naval 增加 live signals
- 2026-05-20: 明确 Persona Fidelity 免费资源策略：人物传记/访谈/书籍材料缺口默认由 Codex/ChatGPT 自行搜索免费且合法可访问资源，并记录采用/拒绝原因
- 2026-05-20: 新增 Persona Fidelity Protocol 与本地 People RAG 入口；5 个专家 lens 都接入 `persona_fidelity`、`source_acquisition_targets` 和本地 RAG 路径
- 2026-05-20: 优化 persona rendering：沉浸式模式默认不展示大段边界/来源/路由 UI；马斯克 lens 增加 biography-informed voice 与 anti-rendering patterns
- 2026-05-20: 扩展 Thinking Lens Source Sensing Protocol：允许使用 X/社交原帖、权威媒体、垂直领域自媒体和现场视频作为感知材料，但按事实、信号、氛围、传闻分层使用
- 2026-05-20: 优化 Thinking Lens 专家团：专家显示名统一为中文名（英文名），增强沉浸式 persona mode，并加入最新信息查证 / 已故人物外推边界
- 2026-05-20: 新增全局 Codex 配置源 `90_system/global_codex/`，并同步到 `/Users/momo/.codex/AGENTS.md` 与 `/Users/momo/.codex/skills/coding-guardrails/SKILL.md`
- 2026-05-20: 生成专题情报 `40_outputs/daily_ai/2026-05-20_andrej-karpathy-skills.md`，判断该仓库代表的 agent 行为策略层价值与复用边界
- 2026-05-20: 生成 `AI news` 日报 `40_outputs/daily_ai/2026-05-20.md` 与精华图 `40_outputs/daily_ai/2026-05-20_visual.svg`
- 2026-05-16: 新增 `AI 高价值使用地图：哪些场景最值得消耗 token`，沉淀“复杂信息 × 多维推理 × 可复用闭环”判断框架；已生成 3:4 地图 PNG 并嵌入文档末尾
- 2026-05-15: 修复知识库展示索引：`10_raw/videos/<slug>/` 只展示 `analysis.md`，隐藏 transcript/audio/metadata；分类标签改为文档类型 + 主题标签
- 2026-05-15: 分析 B 站 Codex App 教程 `BV1Kk9kBAEJv`；已获取 metadata、原始音频、本地 ASR 转录，报告为 `high` evidence / `medium_high` confidence
- 2026-05-15: 重新用 link-driven 方式分析郭宇抖音链接；原始页面可访问，拿到视频 ID、标题、发布时间、时长、章节要点和可见字幕片段，报告覆盖为 `high` evidence / `medium_high` confidence

## Artifact Index

### Shared Memory

- memory: `90_system/shared_memory/memory.md`
- README: `90_system/shared_memory/README.md`
- protocol: `90_system/shared_memory/protocol.md`
- schema: `90_system/shared_memory/schema.md`
- lifecycle: `90_system/shared_memory/lifecycle.md`
- current index: `90_system/shared_memory/indexes/current.md`
- entries root: `90_system/shared_memory/entries/`
- templates root: `90_system/shared_memory/templates/`
- validation script: `90_system/shared_memory/scripts/validate_memory.mjs`
- index builder: `90_system/shared_memory/scripts/build_indexes.mjs`
- sync script: `90_system/shared_memory/sync.sh`

### Global Codex

- source AGENTS: `90_system/global_codex/AGENTS.md`
- source coding guardrails skill: `90_system/global_codex/skills/coding-guardrails/SKILL.md`
- sync script: `90_system/global_codex/sync.sh`
- installed AGENTS: `/Users/momo/.codex/AGENTS.md`
- installed coding guardrails skill: `/Users/momo/.codex/skills/coding-guardrails/SKILL.md`

### Skills

- ai-news: `90_system/skills/ai-news/SKILL.md`
- video-link-analysis: `90_system/skills/douyin-video-analysis/SKILL.md`
- thinking lens index: `90_system/skills/index.md`
- thinking lens router: `90_system/skills/skill_router.md`
- persona fidelity protocol: `90_system/skills/persona_fidelity_protocol.md`
- people RAG root: `90_system/rag/people/`
- people source registry: `90_system/rag/people/source_registry.md`
- people expert team guide: `90_system/rag/people/expert_team_simulation_guide.md`
- people persona eval prompts: `90_system/rag/people/persona_eval_prompts.md`
- people/andrej-karpathy: `90_system/skills/people/andrej-karpathy.md`
- people/charlie-munger: `90_system/skills/people/charlie-munger.md`
- people/elon-musk: `90_system/skills/people/elon-musk.md`
- people/mark-zuckerberg: `90_system/skills/people/mark-zuckerberg.md`
- people/naval-ravikant: `90_system/skills/people/naval-ravikant.md`
- people/steve-jobs: `90_system/skills/people/steve-jobs.md`

### Outputs

- daily_ai:
  - 2026-06-01: `40_outputs/daily_ai/2026-06-01.md`
  - 2026-05-29: `40_outputs/daily_ai/2026-05-29.md`
  - 2026-05-28 late: `40_outputs/daily_ai/2026-05-28_late.md`
  - 2026-05-28: `40_outputs/daily_ai/2026-05-28.md`
  - 2026-05-26: `40_outputs/daily_ai/2026-05-26.md`
  - 2026-05-20 / andrej-karpathy-skills: `40_outputs/daily_ai/2026-05-20_andrej-karpathy-skills.md`
  - 2026-05-20: `40_outputs/daily_ai/2026-05-20.md`
  - 2026-05-13: `40_outputs/daily_ai/2026-05-13.md`

### Wiki / Knowledge

- Agent Skill candidate list: `20_wiki/skills/agent_skill_candidate_list.md`
- Agent Skill candidate visual: `20_wiki/skills/agent_skill_candidate_list_visual.svg`
- AI learning map: `20_wiki/ai/AI_learning_map.md`
- AI high-value usage map: `20_wiki/ai/ai_high_value_usage_map.md`
- AI usage capability map: `20_wiki/concepts/AI 使用能力地图.md`
- AI high-value usage map image: `99_assets/images/ai_high_value_usage_map_3x4.png`
- AI high-value usage map source SVG: `99_assets/images/ai_high_value_usage_map_3x4.svg`

### Templates

- video analysis: `90_templates/video_analysis.md`

### Raw Inputs

- douyin:
  - 2026-05-25 / 萌萌本萌 Codex Skills: `10_raw/videos/2026-05-25_douyin_7642361133782160113/analysis.md`
  - 2026-05-25 / 产品君 AI 周报: `10_raw/videos/2026-05-25_douyin_7643493803533323570/analysis.md`
  - 2026-05-13: `10_raw/links/2026-05-13_douyin_guo-yu_ai_life_changes.md`
- bilibili:
  - 2026-05-15: `10_raw/videos/2026-05-15_bilibili_BV1Kk9kBAEJv/analysis.md`

## Thinking Lens System

- Status: `active`
- Updated: `2026-05-20`
- Skill directory: `90_system/skills/`
- Router entry: `90_system/skills/skill_router.md`
- Persona fidelity protocol: `90_system/skills/persona_fidelity_protocol.md`
- People RAG root: `90_system/rag/people/`
- People source registry: `90_system/rag/people/source_registry.md`
- People expert team guide: `90_system/rag/people/expert_team_simulation_guide.md`
- People persona eval prompts: `90_system/rag/people/persona_eval_prompts.md`
- People lens directory: `90_system/skills/people/`
- Index: `90_system/skills/index.md`
- Available people lenses:
  - 安德烈·卡帕西（Andrej Karpathy）: `90_system/skills/people/andrej-karpathy.md`
  - 查理·芒格（Charlie Munger）: `90_system/skills/people/charlie-munger.md`
  - 埃隆·马斯克（Elon Musk）: `90_system/skills/people/elon-musk.md`
  - 马克·扎克伯格（Mark Zuckerberg）: `90_system/skills/people/mark-zuckerberg.md`
  - 纳瓦尔·拉维坎特（Naval Ravikant）: `90_system/skills/people/naval-ravikant.md`
  - 史蒂夫·乔布斯（Steve Jobs）: `90_system/skills/people/steve-jobs.md`
- GitHub raw paths:
  - Skills index: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/index.md`
  - Skill router: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/skill_router.md`
  - 安德烈·卡帕西（Andrej Karpathy） lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/andrej-karpathy.md`
  - 查理·芒格（Charlie Munger） lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/charlie-munger.md`
  - 埃隆·马斯克（Elon Musk） lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/elon-musk.md`
  - 马克·扎克伯格（Mark Zuckerberg） lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/mark-zuckerberg.md`
  - 纳瓦尔·拉维坎特（Naval Ravikant） lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/naval-ravikant.md`
  - 史蒂夫·乔布斯（Steve Jobs） lens: `https://raw.githubusercontent.com/xcheese/flux/main/90_system/skills/people/steve-jobs.md`
- Usage:
  - 不确定用哪个 lens 时，先读取 Skill router raw 路径
  - 明确要调用某个 lens 时，直接读取对应 people lens raw 路径
  - 若用户要求“专家团 / 沉浸式 / 角色扮演 / 用某某口吻”，允许 persona mode，但仍以观点质量、事实边界和行动建议为核心
  - 若用户要求“更像 / 高仿真 / 还原度”，优先使用 Persona Fidelity Protocol，并读取本地 RAG/source registry
  - ChatGPT 侧不会因为 Codex 已 push 就自动获得最新上下文；必须由当前 GPT 聊天读取 raw shared memory / router / lens，或使用本文件 fallback
  - 为避免旧上下文和 raw 缓存，测试专家团时建议在 ChatGPT 项目“顾问”中新开聊天，并要求读取带 cachebust 的 shared memory
  - 已存在的 GPT 聊天也可继续使用，但需要明确要求“重新读取最新 shared memory，不要沿用旧记忆”
- Guardrails:
  - 专家名统一输出为中文名（英文名），例如 `埃隆·马斯克（Elon Musk）`
  - lens 默认是分析框架；当用户明确要求“角色扮演”“沉浸式”“用某某口吻”时，可启用受控 persona mode
  - persona mode 是基于公开材料的风格化讨论，不代表本人，不声称替本人发言
  - 沉浸感来自观点顺序、典型追问、反对意见和判断风格；不要只模仿口头禅
  - 沉浸式 persona mode 默认不输出 `Lens Routing`、大段边界说明、来源清单或审计 UI；事实边界在后台执行，必要时用一句自然语言轻提示
  - 观点质量、事实边界和行动建议优先于口吻
  - 每次最多调用 1-2 个 lens
  - 必须区分事实、推断、行动建议和待验证信息
  - 涉及最新事实、价格、政策、法律、医学、金融或安全问题时，先验证再判断
  - 活跃人物涉及最新动态时，先查官方/一手来源；无法查证则标注“最新信息未验证”
  - 已故人物不能生成去世后的真实观点；只能用历史材料外推，并标为 `lens 推断`
- Persona fidelity:
  - 主目标是还原人物会注意什么、如何排序问题、如何反问、如何表达、如何误判，以及最新公开关注点
  - 高仿真 persona 调用前优先读取 `90_system/rag/people/expert_team_simulation_guide.md`、`90_system/rag/people/<person-id>/style_notes/persona_model_v1.md` 和 `source_notes/free_legal_resources_v1.md`
  - 自测和用户验收使用 `90_system/rag/people/persona_eval_prompts.md`
  - 每次用户反馈“不像”，应沉淀为该人物的 `Persona Fidelity Guide`、`anti-rendering pattern` 或 RAG source note
  - 可以使用人物传记、个人书籍、公开访谈、社交原帖、课程/代码/股东会/发布会、权威报道和垂直领域材料
  - 遇到人物材料缺口时，Codex/ChatGPT 默认自行搜索免费且合法可访问资源；优先官方档案、公开访谈、公开视频/播客、X/社交原帖、图书目录/合法试读、作者/出版社页面和可信垂直媒体
  - 本地 RAG 默认保存来源索引、摘要、时间线、主题卡片、短摘录和自有分析；不默认保存未授权整本付费书或大段版权文本
  - 不保存盗版 PDF、网盘搬运、未授权整本付费书、完整付费课程或大段版权文本；必要时记录拒绝原因
- Source sensing:
  - `primary_fact`: 本人/公司/机构原帖、官网、公告、财报、监管文件、完整访谈、完整演讲、现场视频原始来源
  - `reliable_report`: 通讯社、主流媒体、一手转引媒体、官方媒体通稿；用于确认时间、地点、名单、公开动作
  - `domain_signal`: 长期跟踪该领域的研究者、工程师、投资人、行业媒体、权威自媒体；用于提取行业语境、争议点和解释框架
  - `social_atmosphere`: X、微博、小红书、YouTube、播客、社区讨论和二创传播；用于感知现场趣闻、情绪和传播效果，不单独作为事实依据
  - `rumor`: 爆料、未具名消息、剪辑片段、标题党内容；只能作为待验证线索
- Source bias:
  - 专家团材料包含国外媒体，也包含国内官方/媒体、公司官网、本人原帖、完整访谈、垂直媒体和社交平台
  - 所有媒体默认都有政治、商业、文化或受众立场；不把媒体叙事直接当事实
  - 通讯社/主流媒体主要用于确认时间、地点、名单、公开动作；动机、意图、价值判断必须标为媒体解释或 lens 推断
  - 涉及中美、监管、战争、选举、平台治理等高偏见主题时，必须多源交叉验证

### Single-file Fallback Router

若 ChatGPT 能读取本 `shared_memory`，但读取 `index.md` 或 `skill_router.md` raw URL 失败，则直接使用以下最小路由，不要要求用户粘贴全文：

- `people.elon-musk` / 埃隆·马斯克（Elon Musk）: 工程系统、成本压缩、第一性原理、制造与交付、垂直整合、快速迭代
- `people.andrej-karpathy` / 安德烈·卡帕西（Andrej Karpathy）: AI 工程、模型可靠性、AI 教育、开源实现、LLM 产品设计
- `people.steve-jobs` / 史蒂夫·乔布斯（Steve Jobs）: 产品、设计、战略聚焦、端到端体验、品牌叙事、技术与人文
- `people.charlie-munger` / 查理·芒格（Charlie Munger）: 投资、商业判断、多元思维模型、逆向思考、认知偏误、激励机制
- `people.naval-ravikant` / 纳瓦尔·拉维坎特（Naval Ravikant）: 财富、杠杆、职业选择、人生哲学、独立思考、一人公司
- `people.mark-zuckerberg` / 马克·扎克伯格（Mark Zuckerberg）: 社交网络、平台战略、AI 产品分发、增长与网络效应、创作者生态、组织效率、AR / AI glasses

Routing rules:

- 每次最多选择 1-2 个 lens
- 分析模式选择后必须说明：`selected_lens`、`reason`、`conflict`、`synthesis`、`response_mode`；沉浸式 persona mode 默认不展示该路由块，除非用户要求审计
- 默认 `response_mode: analysis`
- 当用户明确要求“角色扮演 / 沉浸式 / 用某某口吻”时，允许 `response_mode: persona`
- persona mode 可以使用风格化口吻和第一人称讨论框架，但不能声称就是本人；非本人边界用轻提示，不默认做大段免责声明
- persona mode 的仿真重点是观点顺序、典型追问、反对意见、思维盲点和判断风格，不是口头禅
- persona mode 默认不输出 `Lens Routing`、表格、来源清单或“边界/待验证”小节；高风险事实或用户要求审计时例外
- 专家名输出统一使用中文名（英文名）
- 输出必须区分：事实、lens 推断、行动建议、待验证信息
- 若涉及最新事实、价格、政策、法律、医学、金融或安全问题，必须先验证；无法验证时说明边界
- 若用户问“趣闻 / 氛围 / 大家怎么看”，可以使用 X、微博、视频片段、权威自媒体等 `social_atmosphere` / `domain_signal`；若用户问真实意图或商业结果，必须回到一手事实和可靠报道
- 若用户问“高仿真 / 更像本人 / 和某人聊”，优先使用 `90_system/skills/persona_fidelity_protocol.md` 与 `90_system/rag/people/source_registry.md`
- 埃隆·马斯克（Elon Musk）、安德烈·卡帕西（Andrej Karpathy）、马克·扎克伯格（Mark Zuckerberg）、纳瓦尔·拉维坎特（Naval Ravikant）属于活跃人物；涉及最新动态时先查官方/一手来源，无法查证则只使用稳定 lens
- 史蒂夫·乔布斯（Steve Jobs）、查理·芒格（Charlie Munger）属于已故人物；不能声称其对去世后事件有真实观点，只能标为 `lens 推断`

## Active Records

### 2026-05-20 / add-mark-zuckerberg-lens

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户要求新增 Facebook 创始人马克·扎克伯格（Mark Zuckerberg）进入专家团。
- Result:
  - 新增 people lens：`90_system/skills/people/mark-zuckerberg.md`
  - 新增 People RAG 目录：`90_system/rag/people/mark-zuckerberg/`
  - 新增 source notes：`90_system/rag/people/mark-zuckerberg/source_notes/free_legal_resources_v1.md`
  - 新增 style notes：`90_system/rag/people/mark-zuckerberg/style_notes/persona_model_v1.md`
  - 新增 live signals：`90_system/rag/people/mark-zuckerberg/live_signals/2026-05-20.md`
  - 已更新 `skill_router.md`、`index.md`、`source_registry.md`、`expert_team_simulation_guide.md`、`persona_eval_prompts.md`、`persona_readiness_report.md`
- Domains:
  - 社交网络、平台战略、AI 产品分发、增长与网络效应、创作者生态、组织效率、AR / AI glasses、personal superintelligence。
- Decisions:
  - Zuckerberg lens 重点不是早期 Facebook 增长故事，而是当前 Meta AI、personal superintelligence、AI glasses、分发和下一代计算入口。
  - 涉及隐私、儿童安全、内容治理、政治广告、垄断或监管时，不能只用增长/平台 lens，必须加入社会风险和合规边界。
- Next:
  - For ChatGPT/Codex: 用户提到“扎克伯格 / Facebook 创始人 / Meta / AI glasses / 社交平台分发”时，可调用 `people.mark-zuckerberg`。

### 2026-05-20 / source-bias-policy

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户询问专家团材料是否包含国外媒体，以及这些材料是否会有政治倾向。
- Decision:
  - 会包含国外媒体资源，也会包含国内官方/媒体、公司官网、本人原帖、完整访谈、垂直媒体和社交平台。
  - 所有媒体都默认存在立场和选择性；专家团不得把任何单一媒体的叙事框架直接当事实。
  - 来源按用途分层：一手材料确认本人/机构表态，可靠报道确认公开事实，社交/自媒体只做氛围和线索，政治解释需多源交叉。
  - 涉及中美、监管、战争、选举、平台治理等高偏见主题时，必须显式区分事实、媒体解释、社交氛围和 lens 推断。
- Next:
  - For ChatGPT/Codex: 回答专家团问题时，如果引用媒体来源，应在后台先判断来源层级和偏见风险；用户要求审计时展示该判断。

### 2026-05-20 / chatgpt-expert-team-startup

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户询问在 ChatGPT 侧和专家团沟通时，是否需要新开聊天，以及 GPT 是否会自动知道 Codex 已推送的记忆和 skill。
- Decision:
  - Codex 提交并 push 到 GitHub 后，ChatGPT 当前聊天不会自动“感知”这些改动；它必须读取 GitHub raw shared memory / router / lens，或依赖项目指令触发读取。
  - 最稳的测试方式是在 ChatGPT 项目“顾问”中新开一个聊天窗口，避免旧聊天上下文、旧缓存或旧项目文件影响。
  - 不必须新开项目；只建议新开同一项目内的新聊天。
  - 若继续旧聊天，用户应明确要求它“重新读取带 cachebust 的 shared memory，不要沿用旧记忆”。
- Recommended bootstrap prompt:
  - `请先读取这个最新 shared memory（带 cachebust，不要沿用旧缓存）：https://raw.githubusercontent.com/xcheese/flux/main/90_system/shared_memory/memory.md?cachebust=20260520-mark-zuckerberg。读取后告诉我 updated_at、Recent Changes 第一条、Thinking Lens System 的 expert_team_guide / persona_eval_prompts / people lenses。然后进入专家团高仿真沉浸式模式，默认不要输出路由和审计 UI。`
- Fallback:
  - 如果 GPT 读取 raw 失败，但能读取 shared memory，则直接使用 Single-file Fallback Router，不要要求用户粘贴所有 skill。
  - 如果连 shared memory raw 都读取失败，用户需要提供 raw 内容或可访问链接；这属于 GPT 侧工具/网络限制，不是 Codex 文件未推送。

### 2026-05-20 / expert-team-high-fidelity-build

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户要求“集体优化专家团”，目标是晚些时候可直接和专家团沉浸式聊天，并检验是否足够像各位专家。
- Result:
  - 新增专家团运行手册：`90_system/rag/people/expert_team_simulation_guide.md`
  - 新增仿真测试题与评分表：`90_system/rag/people/persona_eval_prompts.md`
  - 新增活跃人物 live signals：
    - 埃隆·马斯克（Elon Musk）: `90_system/rag/people/elon-musk/live_signals/2026-05-20.md`
    - 安德烈·卡帕西（Andrej Karpathy）: `90_system/rag/people/andrej-karpathy/live_signals/2026-05-20.md`
    - 纳瓦尔·拉维坎特（Naval Ravikant）: `90_system/rag/people/naval-ravikant/live_signals/2026-05-20.md`
  - 加厚 5 位专家的 `style_notes/persona_model_v1.md`：补充节奏、反对方式、avoid patterns、可用上下文。
- Decisions:
  - 当前版本标记为 `high_fidelity_testable`，可用于用户晚些时候直接测试；但仍不声称就是本人，也不声称掌握私人想法。
  - 沉浸式闲聊优先“具体现场细节 + 人物独有判断顺序”；严肃判断再恢复事实/推断/建议结构。
  - 活跃人物 live signals 超过 30 天或用户问“最近/现在/刚刚”时，需重新查证。
- Next:
  - For ChatGPT: 用户说“我想和某某聊”时，先使用 expert team guide + 对应 style notes；不要输出路由/审计 UI，除非用户要求。
  - For Codex: 用户反馈“不像”时，自动更新对应 style notes 或 live_signals，并提交/推送。

### 2026-05-20 / persona-fidelity-rag-system

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户明确主目标：专家团应极度仿真，持续读取/积累人物传记、实时消息、观点、个人采访、个人书籍、社交原帖、权威自媒体等材料；必要时下载/保存相关信息，形成本地 RAG。
- Result:
  - 新增 `90_system/skills/persona_fidelity_protocol.md`
  - 新增 People RAG 入口：`90_system/rag/people/README.md`
  - 新增来源注册表：`90_system/rag/people/source_registry.md`
  - 已给 5 个 people lens 增加 `persona_fidelity`、`source_acquisition_targets` 和 `local_rag` 路径
  - 已更新 `skill_router.md`、`index.md` 和本 shared memory，使后续 GPT/Codex 知道“高还原度”是专家团主目标之一
- Decisions:
  - 高仿真重点是人物的判断顺序、注意力分配、反问方式、表达节奏、误判倾向和最新公开关注点
  - 可以积累 X、微博、YouTube、播客、权威自媒体、传记、书籍、公开访谈、课程/代码/股东会/发布会等材料
  - 默认不保存未授权整本付费书、盗版 PDF、完整付费课程或大段版权文本；优先保存来源索引、摘要、时间线、主题卡片、短摘录和自有分析
- Next:
  - For ChatGPT: 用户要求“更像 / 高仿真 / 和某人聊”时，先使用 persona fidelity protocol，不要只套用抽象 lens
  - For Codex: 后续可逐人建立 `source_notes/`、`style_notes/`、`timelines/`、`live_signals/`，并把用户反馈沉淀为 anti-rendering pattern

### 2026-05-20 / persona-free-resource-search

- Project: `thinking-lens-system`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户明确：如果有相关人物传记或材料，Codex 应自行搜索必要的免费资源，而不是等待用户每次提供链接。
- Result:
  - 已更新 `90_system/skills/persona_fidelity_protocol.md`
  - 已更新 `90_system/rag/people/source_registry.md`
  - 已更新 `90_system/skills/skill_router.md` 和本 shared memory 的 fallback 规则
- Decisions:
  - 默认自行搜索免费且合法可访问资源：官方档案、公开访谈、公开视频/播客、X/社交原帖、图书目录/合法试读、作者/出版社页面、可信垂直媒体
  - 不采用盗版 PDF、网盘搬运、未授权整本付费书、完整付费课程或无来源大段转录
  - 对采用/拒绝来源做简短记录，优先保存摘要、时间线、主题卡片和风格笔记
- Next:
  - For Codex: 后续补强某位专家时，先执行 free/legal source search，再沉淀到该人物 RAG 目录
  - For ChatGPT: 若无法直接访问某资源，应使用 shared memory 中的 source registry 和 fallback rules，不要要求用户重复提供 GitHub 链接

### 2026-05-20 / persona-rag-v1-notes

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户要求系统性建设专家团，直到可以用于晚些时候的极度仿真测试。
- Result:
  - 已为 5 位专家分别创建 `source_notes/free_legal_resources_v1.md`
  - 已为 5 位专家分别创建 `style_notes/persona_model_v1.md`
  - 已创建 readiness 报告：`90_system/rag/people/persona_readiness_report.md`
  - 已更新 router/protocol：高仿真 persona 调用前优先读取本地 style/source notes
- Readiness:
  - 埃隆·马斯克（Elon Musk）: `high_for_engineering_and_informal_chat`
  - 安德烈·卡帕西（Andrej Karpathy）: `high_for_ai_engineering`
  - 史蒂夫·乔布斯（Steve Jobs）: `high_for_product_and_design`
  - 查理·芒格（Charlie Munger）: `high_for_inversion_and_incentives`
  - 纳瓦尔·拉维坎特（Naval Ravikant）: `high_for_wealth_leverage_and_life_strategy`
- Next:
  - For User: 晚点直接用自然语言和专家团聊天，重点测试是否“像人、像该人、观点有密度”
  - For Codex: 按用户反馈继续追加 anti-rendering pattern 和来源卡片

### 2026-05-20 / thinking-lens-persona-fidelity

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户希望专家团从纯分析 lens 进一步支持沉浸式讨论，并将专家名统一为中文名（英文名）；同时希望讨论能结合观点、想法和最新信息点。
- Result:
  - 已优化 `90_system/skills/skill_router.md`：加入中文显示名规范、persona mode 边界和 freshness protocol
  - 已优化 `90_system/skills/index.md`：索引层补充中文名（英文名）和最新事实查证规则
  - 已优化 5 个 people lens：新增 `display_name`、`freshness_policy`，并强化 persona interaction boundaries
  - 已在本 shared memory 写入 Single-file Fallback Router，防止 ChatGPT 读取 router raw 失败时要求用户手动粘贴
- Decisions:
  - 允许沉浸式 persona mode，但前提是用户明确要求“角色扮演 / 沉浸式 / 用某某口吻”
  - 更仿真的重点是观点顺序、典型追问、反对意见和判断风格，不是口头禅或冒充本人
  - 活跃人物涉及最新动态时必须查证；已故人物只能做历史 lens 外推
- Next:
  - For ChatGPT: 若用户说“请专家团讨论”，先用 fallback router 选择 1-2 个 lens；如需最新事实，先查证再进入 persona
  - For Codex: 后续新增人物 lens 时必须包含 `display_name`、`freshness_policy` 和 persona boundaries

### 2026-05-20 / thinking-lens-source-sensing

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户指出专家团需要扩大相关信息源作为感知材料，例如 X 和权威自媒体；同时希望沉浸式对话能根据问题语境选择趣闻/现场感，而不是总是转向商业和功利分析。
- Result:
  - 已在 `90_system/skills/skill_router.md` 增加 `Source Sensing Protocol`
  - 已在 `90_system/skills/people/elon-musk.md` 补充 X、官方账号、可靠报道、中国本地来源、垂直媒体/权威自媒体和社交氛围来源分层
  - 已在本 shared memory 的 Thinking Lens System 中增加 source sensing fallback 规则
- Decisions:
  - X、微博、YouTube、播客和权威自媒体可用于现场感、趣闻、情绪和早期信号
  - 事实判断仍优先官方/一手来源、可靠报道和多源交叉验证
  - 自媒体不因名气自动可信；必须看领域深耕、证据链和可交叉验证性
- Next:
  - For ChatGPT: 用户问趣闻/氛围时，不要自动转成商业分析；先给有边界的现场感，再按用户追问深入
  - For Codex: 后续新增人物 lens 时加入 `sensing_sources` 或引用 router 的 Source Sensing Protocol

### 2026-05-20 / thinking-lens-persona-rendering

- Project: `thinking-lens-system`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户反馈显性边界说明和审计式 UI 破坏沉浸感，且马斯克 persona 还原度不足；建议参考人物传记进一步优化。
- Result:
  - 已在 `90_system/skills/skill_router.md` 调整 persona mode：默认不展示路由块、边界块、来源清单和审计 UI
  - 已在 `90_system/skills/people/elon-musk.md` 增加 `Persona Fidelity Guide`，包含 biography-informed voice、rendering rules 和 anti-rendering patterns
  - 已在本 shared memory 的 fallback 规则中写入 persona rendering 约束
- Decisions:
  - 保留事实边界作为后台约束，但输出层用自然短句处理，不做大段免责声明
  - 微信读书链接 `https://weread.qq.com/web/reader/d2e325c0813ab8234g019ba2k9bf32f301f9bf31c7ff0a60` 是《埃隆·马斯克传》，作者为沃尔特·艾萨克森；它是重要的近距离传记源，但严格分类不是马斯克本人撰写的自传
  - 马斯克还原度参考 Walter Isaacson《埃隆·马斯克传》、Ashlee Vance、长期访谈、工厂参观、X 原帖和现场视频
  - 马斯克式沉浸感更应体现短、快、直接、工程压缩、怪异但具体的观察，而不是泛化企业家口吻
- Next:
  - For ChatGPT: 用户要“和某人聊”时，先进入对话，不要先铺设解释框；需要事实边界时只自然插一句
  - For Codex: 后续可为其他人物 lens 逐步增加同类 `Persona Fidelity Guide`

### 2026-05-20 / global-codex-coding-guardrails

- Project: `global-codex-guardrails`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-20`
- Context: 用户希望把“求真”和从 Andrej Karpathy skills 讨论中提炼出的 coding guardrails 做成全局性机制，而不是单一项目规则。
- Result:
  - 已创建版本化源文件：`90_system/global_codex/AGENTS.md`
  - 已创建全局 Codex skill 源文件：`90_system/global_codex/skills/coding-guardrails/SKILL.md`
  - 已创建同步脚本：`90_system/global_codex/sync.sh`
  - 已同步到全局 Codex 配置：`/Users/momo/.codex/AGENTS.md`
  - 已同步到全局 Codex skill：`/Users/momo/.codex/skills/coding-guardrails/SKILL.md`
- Decisions:
  - 不直接照搬 Claude `CLAUDE.md` 或 skill；采用 Codex 原生机制：全局 `AGENTS.md` 承载常驻原则，`~/.codex/skills/coding-guardrails/SKILL.md` 承载按任务触发的工程约束
  - 全局规则保持精简，避免把大量项目级细节塞进 always-on prompt
- Next:
  - For Codex: 后续代码、调试、重构、审查类任务应触发 `coding-guardrails` skill，按“目标/假设/范围/验证/diff 检查”闭环执行
  - For User: 若要继续吸收 Claude/社区 skill，先做去重和 Codex 化改写，再通过 `90_system/global_codex/sync.sh` 同步

### 2026-05-20 / ai-news-andrej-karpathy-skills

- Project: `ai-news`
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-20`
- Context: 用户指定 GitHub 仓库 `multica-ai/andrej-karpathy-skills`，要求按 AI news 专题模式分析其价值与复用边界。
- Result:
  - 已生成专题情报：`40_outputs/daily_ai/2026-05-20_andrej-karpathy-skills.md`
  - 已生成顶部精华图：`40_outputs/daily_ai/2026-05-20_andrej-karpathy-skills_visual.svg`
- Decisions:
  - 该仓库不应被简单当作“要安装的 prompt”，更适合转化为 Codex 任务验收表：假设、改动范围、简洁性、验证闭环
  - GitHub stars/forks 只能说明注意力，不证明规则有效性；复用前应与现有 `AGENTS.md` 去重并做小范围 A/B
- Risks:
  - 仓库无正式 release，近 30 天核心规则没有新增；当前价值主要是工作流策略与传播信号
- Next:
  - For ChatGPT: 读取专题情报，帮助判断是否把 4 条规则沉淀为 `agent_coding_guardrails`
  - For Codex: 若用户要求落地，先合并现有 `AGENTS.md`，避免重复规则堆叠，再用一次中等 coding 任务验证
  - For User: 后续可说“按 Karpathy guardrails 验收”，让 Codex 把它转成任务检查流程

### 2026-05-20 / ai-news

- Project: `ai-news`
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-20`
- Context: 用户触发 `AI news`，要求采集当天 3 条高价值 AI 信息，避免历史重复，优先一手/可信技术来源。
- Result:
  - 已生成今日 AI 情报：`40_outputs/daily_ai/2026-05-20.md`
  - 已生成顶部精华图：`40_outputs/daily_ai/2026-05-20_visual.svg`
- Decisions:
  - 今日入选主题：Google Gemini 3.5 + Antigravity/Managed Agents、Cloudflare Project Glasswing / Mythos 复盘、GitHub 早期 agent 成本/质量控制信号
- Risks:
  - Google 官方 benchmark 与 GitHub 新仓热度仍需后续第三方实测验证
- Next:
  - For ChatGPT: 读取 `40_outputs/daily_ai/2026-05-20.md`，围绕 agent runtime、验证 harness、成本/质量控制层讨论后续行动
  - For Codex: 后续运行 `ai news` 时继续查重，避免重复 2026-05-20 已入选主题
  - For User: 在知识库后台打开今日日报；若要深入，可指定 `ai news agent runtime` 或 `ai news AI security harness`

### 2026-05-16 / ai-high-value-usage-map

- Project: `ai-growth-knowledge-base`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-16`
- Context: 用户要求将“AI 高价值使用地图”整理为长期知识库文档，并在文档末尾嵌入地图图片。
- Result:
  - 已创建知识库文档：`20_wiki/ai/ai_high_value_usage_map.md`
  - 已更新 AI 入口索引：`20_wiki/ai/AI_learning_map.md`
  - 已生成地图图片：`99_assets/images/ai_high_value_usage_map_3x4.png`
  - 已保留可编辑源文件：`99_assets/images/ai_high_value_usage_map_3x4.svg`
  - 已在文档末尾使用相对路径嵌入地图图片
- Summary:
  - 核心公式：`高价值使用 = 复杂信息 × 多维推理 × 可复用闭环`
  - 四大场景：生活、工作、世界、创造
  - 低价值区：无目标闲聊、纯搬运摘要、不可复用重复提问、不验证的结论依赖
- Next:
  - For User: 可继续提出视觉风格要求或内容取舍
  - For Codex: 若用户提供更好的图片版本，替换 PNG；若继续迭代，优先修改 SVG 源文件再渲染 PNG

### 2026-05-15 / douyin-video-analysis-workflow

- Project: `video-link-analysis`
- Status: `active`
- Priority: `high`
- Updated: `2026-05-15`
- Context: 用户会经常投喂抖音、B站、YouTube 等视频链接，并明确要求由 Codex 自行准备视频文件/字幕/关键截图等证据，产出 high 置信度分析报告。
- Decision:
  - 新增并升级独立 skill：`90_system/skills/douyin-video-analysis/SKILL.md`（角色名：`视频链接分析员.skill`）
  - 新增报告模板：`90_templates/video_analysis.md`
  - 后续视频链接必须先判定证据等级：`high` / `medium` / `low`
  - high 置信度至少需要原视频文件、完整字幕/转录、可访问原视频页面、关键截图 + 页面可见字幕中的一个强证据源
  - 只有短链/标题/二手搜索结果时，只能登记为 `raw` 或 `medium/low confidence`，不能伪装成 high
  - 当前可用工具：`ffmpeg`、`tesseract`、`yt-dlp`、`whisper-cpp`；缺口：`whisper`、`faster-whisper`
- Artifacts:
  - `90_system/skills/douyin-video-analysis/SKILL.md`
  - `90_templates/video_analysis.md`
  - `90_system/tools/video_link_ingestion.md`
- Next:
  - For ChatGPT: 若用户贴视频链接，先尝试读取/获取证据；若只能看到标题或二手材料，必须降级说明
  - For Codex: 后续触发该 skill 时，先查重，再尝试页面展开、下载/字幕、截图/OCR、音频转录链路，最后入库并更新 shared memory
  - For User: 只需继续投链接；若平台限制导致无法取证，Codex 应说明缺口并请求安装工具/授权浏览器访问

### 2026-05-15 / bilibili-codex-app-guide

- Project: `video-link-analysis`
- Status: `done`
- Priority: `high`
- Updated: `2026-05-15`
- Context: 用户投喂 B 站 Codex App 教程，希望按新的视频链接分析流程处理。
- Result:
  - 通过 `yt-dlp --cookies-from-browser chrome` 获取 B 站 metadata
  - 下载原始音频并用 `whisper-cpp` 本地转录完整 ASR
  - 生成分析报告，证据等级 `high`，置信度 `medium_high`
  - 大文件/版权材料通过目录 `.gitignore` 保持本地，不提交音频和完整转录
- Artifacts:
  - `10_raw/videos/2026-05-15_bilibili_BV1Kk9kBAEJv/analysis.md`
  - `10_raw/videos/2026-05-15_bilibili_BV1Kk9kBAEJv/.gitignore`
- Decisions:
  - B 站后续默认走 `yt-dlp metadata -> audio -> whisper-cpp ASR -> report`
  - 不把完整音频/完整转录推到 GitHub，只提交分析报告和必要索引
- Risks:
  - `ggml-base` ASR 对中文技术词有误听；逐字级复刻需更高精度模型或人工复核
- Next:
  - For ChatGPT: 基于 `analysis.md` 讨论 Codex App 工作流价值，不要把视频内产品口径当官方事实
  - For Codex: 后续 B 站链接继续复用该链路，并考虑沉淀 `codex-app-workflow-checklist`
  - For User: 继续只发链接即可；如果要逐字级教程复刻，需要允许更高精度 ASR 或关键截图抽取

### 2026-05-15 / douyin-guoyu-analysis-dogfood

- Project: `douyin-video-analysis`
- Status: `done`
- Priority: `medium`
- Updated: `2026-05-15`
- Context: 用户要求从近期抖音链接中选一个测试新视频分析能力，并覆盖原始文档。
- Result:
  - 选择 `郭宇：AI会给我们的生活带来什么样的变化`
  - 短链展开到 `https://www.douyin.com/video/7635496165231955206`
  - 本机 Chrome 成功打开原始抖音页面，拿到标题、作者、发布时间 `2026-05-03 15:25`、时长 `13:14`、章节要点和可见字幕片段
  - 已安装 `yt-dlp`，但直接链接与 Chrome cookies 方式均提示需要 fresh cookies，未拿到视频文件/完整字幕
  - 原文档已覆盖为 `video_analysis` / `processed`，证据等级设为 `high`，置信度设为 `medium_high`
- Artifacts:
  - `10_raw/links/2026-05-13_douyin_guo-yu_ai_life_changes.md`
- Next:
  - For ChatGPT: 基于最新报告讨论观点价值；注意它是原始页面 + 章节级分析，不是逐字转录分析
  - For Codex: 下一条视频继续优先尝试原始页、下载/字幕、截图/OCR、ASR；若 `yt-dlp` 需要 fresh cookies，直接记录边界
  - For User: 继续只发链接即可；若要求逐字级高置信度，需要允许获取视频文件或完整字幕/转录

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
