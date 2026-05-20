# Persona Readiness Report

- updated_at: `2026-05-20`
- status: `usable_for_user_testing`

## Summary

专家团已从静态 lens 升级为可积累的人物 RAG 系统。当前不是“冒充本人”，而是可用于高仿真模拟：还原关注点、判断顺序、典型反问、表达节奏、盲点和最新公开关注点。

当前 6 位专家均已有：

- `source_notes/free_legal_resources_v1.md`
- `style_notes/persona_model_v1.md`
- lens 内 `persona_fidelity`
- lens 内 `source_acquisition_targets`
- source registry 入口
- 专家团运行手册：`90_system/rag/people/expert_team_simulation_guide.md`
- 测试题与评分表：`90_system/rag/people/persona_eval_prompts.md`

活跃人物额外已有：

- 埃隆·马斯克（Elon Musk）: `live_signals/2026-05-20.md`
- 安德烈·卡帕西（Andrej Karpathy）: `live_signals/2026-05-20.md`
- 马克·扎克伯格（Mark Zuckerberg）: `live_signals/2026-05-20.md`
- 纳瓦尔·拉维坎特（Naval Ravikant）: `live_signals/2026-05-20.md`

## Readiness By Person

### 埃隆·马斯克（Elon Musk）

- readiness: `high_for_engineering_and_informal_chat`
- strongest:
  - 工程压缩、第一性原理、制造现场、怪异幽默、短句节奏。
  - 访华趣闻、工厂/产品/AI/航天话题可进入沉浸式对话。
- remaining_gap:
  - 需要持续积累 X 原帖、最新访谈、Tesla/SpaceX/xAI 实时动态。
  - 需要后续从《埃隆·马斯克传》提取更多章节级主题卡片。

### 安德烈·卡帕西（Andrej Karpathy）

- readiness: `high_for_ai_engineering`
- strongest:
  - 从零构建、AI 教学、demo 到 production、数据/评估/失败样本。
- remaining_gap:
  - 已加入 2026-05-19 加入 Anthropic 的 live signal；仍需持续积累最新 agent / coding / education 观点和项目动态。

### 史蒂夫·乔布斯（Steve Jobs）

- readiness: `high_for_product_and_design`
- strongest:
  - 聚焦、说 no、端到端体验、一句话产品、发布叙事。
- remaining_gap:
  - 需要从 Make Something Wonderful、keynotes 和传记中继续提取风格片段。

### 查理·芒格（Charlie Munger）

- readiness: `high_for_inversion_and_incentives`
- strongest:
  - 逆向、激励机制、能力圈、偏误、Too Hard。
- remaining_gap:
  - 需要从 Daily Journal / Berkshire Q&A 提取更多问答式风格样本。

### 纳瓦尔·拉维坎特（Naval Ravikant）

- readiness: `high_for_wealth_leverage_and_life_strategy`
- strongest:
  - 杠杆、自由、特定知识、欲望审计、概念重定义。
- remaining_gap:
  - 已加入 2026-04-28 `A Return to Code` live signal；仍需积累后续 nav.al / podcast / X 对 AI、代码和一人公司的观点。

### 马克·扎克伯格（Mark Zuckerberg）

- readiness: `high_for_platform_ai_and_distribution`
- strongest:
  - 平台迁移、社交图谱、分发、AI glasses、personal superintelligence、组织效率。
  - 适合讨论 AI 如何进入日常社交产品和下一代计算入口。
- remaining_gap:
  - 需要继续积累完整访谈、Connect keynote、监管/隐私争议的多源材料和 Meta AI / glasses 后续实际使用反馈。

## Suggested User Tests

- “马斯克，聊聊你这次来中国最奇怪的一个瞬间。”
- “Karpathy，帮我看这个 AI agent 为什么 demo 很好但不敢上线。”
- “乔布斯，帮我砍掉这个产品里不该存在的功能。”
- “芒格，反过来想，我这个投资判断哪里最蠢？”
- “纳瓦尔，我这个职业选择是在追求财富、自由还是地位？”
- “扎克伯格，如果 AI glasses 会成为下一代入口，你今天会先布局什么？”

## Quality Bar

- 不输出路由块，除非用户要求审计。
- 不大段免责声明。
- 不表面口头禅。
- 每个人必须有不同的注意力、句式和反对方式。
- 涉及最新事实时先查证；无法查证时自然提示，不破坏沉浸感。

## Current System Judgment

当前版本已达到 `high_fidelity_testable`：可以让用户晚些时候直接进入沉浸式测试，并用 `persona_eval_prompts.md` 检查每位专家是否足够像。仍不应声称“就是本人”或“完全掌握私人想法”；后续每次用户反馈“不像”都应回写到对应 style notes。
