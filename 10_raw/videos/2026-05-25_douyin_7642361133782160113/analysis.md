---
title: "视频分析：萌萌本萌《codex超好用skills》"
source: "https://www.douyin.com/video/7642361133782160113"
short_url: "https://v.douyin.com/AMne8eAjCB4/"
platform: "douyin"
author: "萌萌本萌🌸🌸🌸"
published_at: "2026-05-22 18:18"
collected_at: "2026-05-25 14:57 CST"
status: "processed"
evidence_level: "medium"
confidence: "medium"
value_score: 8
tags:
  - video-analysis
  - codex
  - skills
  - anysearch
  - ai-workflow
---

# 视频分析：萌萌本萌《codex超好用skills》

![顶部精华图](analysis_visual.svg)

## 一句话结论

这条视频对你有较高价值，但重点不是“马上安装一个 AnySearch skill”，而是验证了一个更重要的方向：高频、可复用、可审计的能力应该沉淀成 Codex skills；低频、来源不清、涉及 API key 的 skill 不能因为短视频种草就直接进生产流。

## 证据等级

- 证据等级：`medium`
- 置信度：`medium`
- 已拿到：展开链接、抖音页面标题、作者信息、发布时间、时长、互动数据、可见字幕片段、两张页面截图、评论样本、AnySearch 官方/GitHub 补充核验。
- 未拿到：完整视频文件、完整字幕、完整口播转录、完整安装过程。
- 关键边界：本文可以判断“视频在推荐 Codex skills / AnySearch，并展示了安装与 API key 配置片段”；但不能复述完整教程步骤，也不能证明视频里的每一步在你当前 Codex 环境里一定可用。

本地证据：

- 页面证据：[page_evidence.md](page_evidence.md)
- 截图 1：[page_screenshot.png](page_screenshot.png)
- 截图 2：[page_screenshot_0102.png](page_screenshot_0102.png)

## 元信息

- 原始短链：`https://v.douyin.com/AMne8eAjCB4/`
- 展开链接：`https://www.douyin.com/video/7642361133782160113`
- 作者：萌萌本萌🌸🌸🌸
- 作者数据：粉丝 23.9 万，获赞 604.4 万
- 发布时间：2026-05-22 18:18
- 时长：02:01
- 可见互动数据：点赞 7.3 万，评论 1061，收藏 5.8 万，分享 7938
- 页面标题：`codex超好用skills，使用频率高，不吃灰#codex#skill#AnySearch #大模型#skill安装`

## 内容结构

当前没有拿到完整转录，只能按页面和可见画面拆解：

| 证据点 | 页面 / 画面内容 | 可判断内容 |
| --- | --- | --- |
| 标题 | `codex超好用skills，使用频率高，不吃灰` | 作者在推荐高频使用的 Codex skill，而不是泛泛收集 |
| 标签 | `#AnySearch`、`#skill安装` | 主要对象很可能是 AnySearch skill 和安装配置 |
| 00:19 截图 | README / 文档页面 + 字幕：`这个skill就是让大模型先去理解任务` | 作者强调 skill 帮 agent 在执行前理解任务 |
| 01:20 截图 | `ANYSEARCH_API_KEY=你的key` + 字幕：`把我们的API key编辑进去` | 教程涉及 API key 配置，存在密钥管理风险 |
| 评论区 | 多人问 Codex vs Claude Code、价格、token | 市场关注点集中在工具选择、成本和模型接入体验 |

## 外部补充核验

- [AnySearch 官方文档](https://www.anysearch.com/docs)：说明 AnySearch 提供 agent 搜索能力，API key 可选但推荐；无 key 仍可用，但限额更低。
- [AnySearch GitHub](https://github.com/anysearch-ai/anysearch-skill)：仓库描述为面向 AI agents 的统一实时搜索 skill，支持网页搜索、垂直搜索、批量搜索和整页内容提取；页面可见约 1.1k stars、97 forks、20 commits，暂无正式 release。
- [OpenAI skills catalog](https://github.com/openai/skills)：OpenAI 的 skills 仓库把 Agent Skills 定义为由 instructions、scripts、resources 组成的能力包，用于让 Codex 可重复完成特定任务。

这些外部资料能验证“AnySearch 作为 skill 项目确实存在”，但不能验证短视频的完整安装教学质量。

## 对你有什么价值

这条视频对你的价值分三层。

第一层是直接工具价值：AnySearch 可能补上 `AI news` 当前最缺的一环，即更系统地做实时检索、批量搜索和整页内容提取。如果它稳定、来源质量足够、成本可控，理论上能提高你每天追全球 AI 市场的效率。

第二层是系统设计价值：视频标题里的“不吃灰”其实是关键。你的知识库已经有 `ai-news`、`douyin-video-analysis`、顶部精华图、shared memory、后台访问链接这些机制。下一步不是继续堆 prompt，而是把真正高频的工作流做成 skill，并明确触发条件、证据等级、输出模板和验收标准。

第三层是市场信号价值：评论区集中问 `Codex 与 Claude Code 怎么选`、`多少钱一个月`、`接国内模型费 token`。这说明中文 AI 用户正在从“哪个模型强”转向“哪个 agent 工具更适合长期工作流”，这是你应该持续跟踪的采用信号。

## 高价值要点

1. `skill` 的筛选标准应该是“高频 + 可复用 + 可验证 + 能省掉真实时间”，不是“看起来酷”。
2. AnySearch 值得进入试用清单，因为它和你当前的 `AI news`、视频分析、外部核验需求高度相关。
3. 涉及 API key 的 skill 必须先做安全边界：密钥不能写进文档、截图、仓库或聊天；应放 `.env`、环境变量或本地安全配置，并确认 `.gitignore`。
4. 评论区的真实问题比视频标题更有市场价值：Codex vs Claude Code、价格、token、国内模型接入，是当前用户采用 agent 工具时真正纠结的点。
5. 这条视频可以作为“技能资产化”的提醒：不要每次靠临场提示词解决问题，而要把稳定流程沉淀成可触发的能力。

## 噪音与风险

- 没有完整转录，不能确认作者是否讲清了安装、验证、错误处理和安全配置。
- 短视频可能省略关键步骤，例如 runtime 选择、依赖安装、API 限额、错误恢复。
- 画面涉及 API key 配置，容易让新手把密钥直接粘到不安全的位置。
- AnySearch GitHub 当前暂无正式 release；如果用于生产流，需要 pin commit、验脚本、看 license、跑最小测试。
- 抖音高收藏/高点赞不等于工具可靠；它只能说明内容触达强。

## 我的判断

值得沉淀，价值分数 `8/10`。

不是因为视频本身已经足够完整，而是因为它正好击中你当前知识库的下一步：把“高频信息获取”和“证据核验”做成可复用 skill。AnySearch 可以进入候选池，但我不建议直接安装到长期工作流；正确路径是先做隔离试用，再决定是否纳入 `AI news` 采集链路。

## 可行动作

1. 建一个 `skill 候选清单`，字段包括：用途、频率、外部依赖、是否需要 API key、可替代方案、测试结果。
2. 把 AnySearch 放入候选清单，先用临时目录和测试 key 跑一次最小验证，不直接接入知识库主流程。
3. 为所有涉及 API key 的 skill 设统一规则：密钥只进 `.env` 或环境变量；截图、报告、git diff 中不得出现真实 key。
4. 用评论区问题做一个专题：`Codex vs Claude Code：中文用户真正关心什么`，重点看成本、token、模型接入、任务类型。
5. 如果 AnySearch 试用稳定，再升级 `AI情报员.skill`，把“候选池检索”和“整页抽取”做成可审计步骤。

## 关联笔记

- `40_outputs/daily_ai/2026-05-20_andrej-karpathy-skills.md`：Agent 行为策略层和 skills 复用价值。
- `10_raw/videos/2026-05-15_bilibili_BV1Kk9kBAEJv/analysis.md`：Codex App 教程与 skills / 工作流方向。
- `40_outputs/daily_ai/2026-05-22.md`：Codex 工作流和 Appshots / Goal mode 相关观察。
- `90_system/skills/ai-news/SKILL.md`：当前 AI 情报采集 skill。
- `90_system/skills/douyin-video-analysis/SKILL.md`：当前视频链接分析 skill。

## 补证路径

要把这份分析从 `medium` 升到 `high`，最少需要补齐其中一种材料：

- 获取完整视频文件并转录口播。
- 获取作者原始文稿或字幕。
- 按视频步骤在隔离环境安装 AnySearch，并记录完整测试结果。
- 审核 AnySearch skill 的 `SKILL.md`、脚本、依赖和 API key 读取方式。
- 对比 OpenAI 官方 skills 机制，确认它在当前 Codex 环境中的推荐安装路径。

在补证前，不建议把 AnySearch 直接放进你的生产知识库采集流程。
