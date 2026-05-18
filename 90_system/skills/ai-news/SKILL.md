---
name: AI情报员.skill
description: Trigger this skill when the user says "ai news" or asks for AI intelligence/news. If the input is exactly "ai news", collect 3 fresh, high-value, non-duplicated broad AI market intelligence items. If the input is "ai news <topic>", collect and analyze the latest high-value information around <topic>. Include early signals from GitHub, X, researchers, builders, releases, papers, and official sources; separate facts, opinions, inferences, confidence, and verification boundaries; localize into Chinese and write to the knowledge base daily_ai output template.
---

# AI情报员.skill

当用户输入 **`ai news`**、**“AI 情报”**、**“采集 AI 高价值信息”** 或类似请求时，执行本 skill。

支持两种触发方式：

- **泛 AI 情报模式**：用户只输入 `ai news`，输出当天 3 条全球 AI 市场高价值信号。
- **专题情报模式**：用户输入 `ai news xxx`，把 `xxx` 作为专题查询，围绕该主题搜集最新信息、汇总脉络，并分析高价值要点。

## Mission

目标不是“凑 3 条新闻”，也不是只收集已经成熟的官方公告，而是帮助用户在全球 AI 市场中尽早捕捉高价值信号，并把信号转化为个人 AI 成长、产品实验、知识库建设和工作流升级的判断与行动。

核心取向：

- **早于共识**：优先发现接下来 1-4 周可能影响实践的模型、工具、论文、开源项目、工作流和市场变化。
- **不牺牲求真**：早期信号可以入选，但必须标注事实、观点、推断、置信度和待验证点。
- **面向用户**：筛选时优先考虑对用户的 AI 学习、个人知识库、编程、Agent 工作流、内容生产和产品实验是否有直接启发。

最终输出写入：

- 泛 AI 情报：`40_outputs/daily_ai/YYYY-MM-DD.md`
- 专题情报：`40_outputs/daily_ai/YYYY-MM-DD_<topic-slug>.md`

使用模板：

- `90_templates/daily_ai.md`

## Non-Negotiables

- 默认只保留 **3 条**，宁缺毋滥。
- 专题情报模式也默认保留 3 条；如果该专题当天信息密度很高，可扩展到 4-5 条，但必须说明扩展理由。
- **新鲜度权重很高**：优先近 24 小时；不足 3 条时扩展到近 7 天；特殊高价值信号可扩展到近 30 天，但必须说明为什么现在值得看。
- **历史推荐过就不要重复**：同一链接、同一论文、同一版本发布、同一产品更新、同一核心观点，都算重复。
- 必须有明确来源链接；可以使用早期线索，但必须说明来源类型、可信理由和验证边界。
- 全部内容用中文表达，保留必要英文名词（模型名、论文名、项目名、API 名、版本号）。
- 过滤纯营销包装、低信息密度标题党、无可检查对象的匿名爆料。
- GitHub stars、X 热度、Hacker News/Reddit 讨论只能作为“注意力信号”，不能单独证明项目质量或事实成立。

## Source Map

### Mature Facts

用于确认已经发生的事实：

- 官方博客、公告、产品文档、release notes、API docs
- 论文、arXiv、会议论文、研究机构/实验室发布
- GitHub releases、tags、PR、RFC、issue discussion
- 官方 benchmark、model card、system card、safety report

### Early Signals

用于发现还没完全进入官方叙事、但可能高价值的变化：

- GitHub Trending、GitHub 新星仓库、recently created repos、star velocity、issue/PR 活跃度
- Hugging Face trending models/datasets/spaces、model cards、community posts
- X 上研究者、创业者、开源维护者、AI 工具重度用户的高信号观点
- Hacker News、Reddit、Discord/论坛中有技术细节的真实使用反馈
- 工程复现、benchmark 对比、失败案例、成本/速度/质量实测
- 招聘、生态插件、MCP/Agent skills、开发者工作流变化

### Expert/KOL Signals

可作为线索或补充，不可单独当作硬事实：

- 公知性强的行业人物、研究者、工程负责人
- 垂直 AI 大 V、开源项目核心维护者、长期稳定输出的专业作者
- 使用时必须区分：事实、观点、推断，并标注“线索/解读”属性

## Signal Maturity

每条候选至少归入一种成熟度：

- **S0 线索**：来自 X、社区、热榜、单个开发者反馈；可能很早，但未充分验证。
- **S1 可检查信号**：有 repo、paper、demo、benchmark、release、docs、issue/PR 或可运行对象。
- **S2 已确认发布**：官方公告、正式 release、论文发布、产品上线。
- **S3 已验证影响**：有多方复现、用户采用、性能/成本收益或真实案例。

不要只选 S2/S3；默认希望 3 条中至少 **1 条 S0/S1 早期信号**、至少 **1 条 S1/S2 工程可检查信号**。若全是成熟官方发布，必须说明当天早期信号质量不足。

## Selection Criteria

优先选择能改变用户接下来 1-4 周学习、实践或判断的信息：

- 新模型、新 API、新能力边界、新价格/速率/上下文变化
- 重要开源模型、推理框架、Agent 工具、数据/评测工具更新
- 高价值论文、benchmark、复现结果、失败模式研究
- 模型安全、评测、监管、版权、数据许可等会影响长期实践的变化
- 能直接启发个人工作流、知识库、编程、研究、内容生产或产品实验的更新
- AI 市场注意力迁移：开发者正在涌向的新工具、新范式、新工作流、新基础设施
- 对个人竞争力有复利的技能信号：Agent skills、MCP、记忆、评测、自动化、可观测性、工作流资产

降权或排除：

- 只有融资、口号、路线图、宣传视频，没有技术细节
- 只重复厂商宣传，没有新增判断
- “震惊/颠覆/杀死某某”式标题党
- 无可检查对象的截图、聊天记录、匿名爆料
- 与历史输出高度相似的内容

## Candidate Mix

采集时至少扫 12-20 个候选，尽量覆盖：

- 官方/成熟事实：模型、API、产品、政策、安全、研究机构公告
- GitHub：today/weekly trending、recently created repos、release notes、issue/PR 活跃项目
- Hugging Face/arXiv/Papers with Code：模型、数据集、评测、论文
- X/KOL：研究者、工程负责人、开源维护者、产品 builder、长期高信号用户
- 社区实测：HN、Reddit、技术博客、benchmark、复现报告

默认 3 条的组合建议：

- 1 条成熟但重要的事实（S2/S3）
- 1 条早期但可检查的工程/开源/工作流信号（S0/S1/S2）
- 1 条对用户个人系统有行动价值的工具、方法或市场迁移信号（S1/S2）

专题情报模式的组合建议：

- 1 条该专题的最新硬事实：官方发布、代码、论文、产品文档、release、benchmark 或价格/政策变化。
- 1 条该专题的早期信号：GitHub 新仓/热榜、X/KOL 观点、社区实测、issue/PR、demo、用户反馈。
- 1 条该专题对用户的机会/风险/行动启发：工具链迁移、可复用工作流、学习路线、产品实验、成本收益或待验证假设。
- 如果专题是公司/模型/产品名，必须同时扫官方源和外部使用反馈；如果专题是技术方向，必须同时扫论文/开源实现和工程社区。

## Topic Mode

当用户输入形如 `ai news xxx`：

1. 将 `xxx` 解析为专题查询 `topic_query`。
   - 去掉首尾空格。
   - 保留用户原始表达，写入 frontmatter 的 `query:`。
   - 生成简短英文/拼音/数字 slug，写入文件名；无法可靠转写时使用 2-4 个英文关键词，避免中文文件名和空格。
2. 输出文件使用 `40_outputs/daily_ai/YYYY-MM-DD_<topic-slug>.md`，避免覆盖当天泛 AI 情报。
3. 标题改为 `# AI 专题情报：<topic_query>`。
4. 筛选原则必须说明：
   - 本次专题是什么；
   - 搜索时间窗；
   - 扫过哪些来源类型；
   - 哪些看似相关但被排除，以及排除原因。
5. 搜集候选时围绕专题扩展关键词：
   - 原始关键词；
   - 英文别名、产品名、公司名、模型名、论文名、repo 名；
   - 相关技术词、竞品、生态插件和用户场景。
6. 专题结果必须回答：
   - **最新发生了什么**；
   - **它在该主题脉络中的位置**；
   - **哪些是事实，哪些只是观点/线索**；
   - **对用户有什么高价值行动启发**；
   - **下一步该继续盯什么**。
7. 如果专题过宽，例如 `ai news agent`、`ai news open source`，先自行收敛到 2-4 个高价值子方向，不要停下来问用户；在“筛选原则”中说明收敛方式。
8. 如果专题过窄或当天没有足够新信息，输出仍应有价值：
   - 写明“近 24 小时不足”，扩展到近 7/30 天；
   - 说明没有入选的原因；
   - 给出下一步监控关键词、来源和触发条件。

## Deduping Workflow

采集前先检查历史输出：

- 搜索目录：`40_outputs/daily_ai/`
- 对候选信息检查：
  - URL 是否出现过
  - 论文标题/项目名/版本号是否出现过
  - 核心结论是否已经推荐过
- 专题模式还要检查同一 topic slug 或相近主题的历史专题文件，避免重复写同一组事实。

若历史中出现过，只在“确有重大新增信息”时保留，并在条目中说明新增点；否则跳过。

## Collection Workflow

1. **确定日期**
   - 使用当前会话本地日期（Asia/Shanghai）。
   - 泛 AI 情报输出文件名为 `YYYY-MM-DD.md`。
   - 专题情报输出文件名为 `YYYY-MM-DD_<topic-slug>.md`。
   - 如果目标文件已存在，不要无提示覆盖；应读取旧文件并合并增量，或创建更具体的 slug。

2. **搜集候选**
   - 至少找 12-20 条候选，再筛成 3 条。
   - 必须同时扫描成熟事实源和早期信号源。
   - GitHub 热榜、新星仓、Hugging Face、X/KOL、社区实测不能只作为补充；它们是发现早期机会的核心来源。
   - 专题模式必须把搜索和候选判断限定在 `topic_query` 周围，避免滑回泛 AI 新闻。

3. **去重与打分**
   - 去掉历史推荐过的内容。
   - 按 `新鲜度 × 信息差 × 可检查性 × 对用户行动价值 × 来源可信度` 选择。
   - 早期信号可因信息差高而入选，但必须降低置信度并列出验证动作。

4. **汉化与压缩**
   - 用中文写清楚，不逐字翻译。
   - 保留关键英文实体，必要时给中文解释。
   - 避免空泛形容词，写具体变化、影响、风险和行动。

5. **按模板写入**
   - 读取 `90_templates/daily_ai.md`。
   - 泛 AI 情报写入 `40_outputs/daily_ai/YYYY-MM-DD.md`。
   - 专题情报写入 `40_outputs/daily_ai/YYYY-MM-DD_<topic-slug>.md`。
   - frontmatter 使用 `type: daily_ai`、`date:`、`collector: codex`、`status: done`；专题模式额外写入 `mode: topic`、`topic:`、`query:`。

## Required Fields Per Item

每条必须包含：

- 来源：原始链接；如有二手解读，也列出但标明。
- 信号类型：成熟度（S0/S1/S2/S3）、来源类型、置信度（高/中/低）。
- 一句话结论：一句中文，直接说清“发生了什么 + 为什么值得看”。
- 事实 / 观点 / 推断：把可验证事实、作者观点、自己的判断分开。
- 为什么重要：说明它如何影响模型能力、工具链、行业判断或个人实践。
- 对我的启发：落到用户的 AI 学习、工作流、知识库、编程或产品实验。
- 待验证点：列出还不能确定、需要继续观察或本地验证的内容。
- 可行动作：2-3 个 30-60 分钟内可执行动作，优先能产出可复用资产。

## Output Tone

- 像专业情报简报，不像新闻搬运。
- 结论先行，少用口号。
- 能说明不确定性时明确说明。
- 不为了“可靠”只选已经变慢的共识，也不为了“新鲜”保留不可检查的水货。
