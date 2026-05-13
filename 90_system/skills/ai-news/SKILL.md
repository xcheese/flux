---
name: AI情报员.skill
description: Trigger this skill when the user says "ai news" or asks for AI intelligence/news. Collect 3 fresh, high-value, non-duplicated AI developments from primary or highly credible sources, localize them into Chinese, and write to the knowledge base daily_ai output template.
---

# AI情报员.skill

当用户输入 **`ai news`**、**“AI 情报”**、**“采集 AI 高价值信息”** 或类似请求时，执行本 skill。

## Mission

目标不是“凑 3 条新闻”，而是帮助用户持续跟上全球 AI 发展，并把信息转化为个人 AI 成长的判断、启发和行动。

最终输出写入：

- `40_outputs/daily_ai/YYYY-MM-DD.md`

使用模板：

- `90_templates/daily_ai.md`

## Non-Negotiables

- 只保留 **3 条**，宁缺毋滥。
- **时效性权重很高**：优先近 24 小时；不足 3 条时扩展到近 7 天，并标注实际发布时间。
- **历史推荐过就不要重复**：同一链接、同一论文、同一版本发布、同一产品更新、同一核心观点，都算重复。
- 必须有明确来源链接；优先第一手资料。若使用专家/KOL/媒体内容，必须说明其可信理由，并尽量追溯到原始材料。
- 全部内容用中文表达，保留必要英文名词（模型名、论文名、项目名、API 名、版本号）。
- 过滤营销包装、概念炒作、低信息密度、标题党、无法验证的爆料。

## Source Standard

### Tier 1: Primary Sources

优先使用：

- 官方博客、公告、产品文档、release notes、API docs
- 论文、arXiv、会议论文、研究机构/实验室发布
- GitHub releases、tags、PR、RFC、issue discussion
- 官方 benchmark、model card、system card、safety report

### Tier 2: Credible Technical Sources

可使用，但要尽量回链到一手来源：

- 权威技术媒体与研究社区
- 主流云厂商/芯片厂/模型平台的技术博客
- 高质量 benchmark、评测项目、工程复现报告

### Tier 3: Publicly Known or Vertical Experts

可作为线索或补充，不可单独当作硬事实：

- 公知性强的行业人物、研究者、工程负责人
- 垂直 AI 大 V、开源项目核心维护者、长期稳定输出的专业作者
- 使用时必须区分：事实、观点、推断，并标注“线索/解读”属性

## Selection Criteria

优先选择能改变用户接下来 1-4 周学习、实践或判断的信息：

- 新模型、新 API、新能力边界、新价格/速率/上下文变化
- 重要开源模型、推理框架、Agent 工具、数据/评测工具更新
- 高价值论文、benchmark、复现结果、失败模式研究
- 模型安全、评测、监管、版权、数据许可等会影响长期实践的变化
- 能直接启发个人工作流、知识库、编程、研究、内容生产或产品实验的更新

降权或排除：

- 只有融资、口号、路线图、宣传视频，没有技术细节
- 只重复厂商宣传，没有新增判断
- “震惊/颠覆/杀死某某”式标题党
- 无来源截图、聊天记录、匿名爆料
- 与历史输出高度相似的内容

## Deduping Workflow

采集前先检查历史输出：

- 搜索目录：`40_outputs/daily_ai/`
- 对候选信息检查：
  - URL 是否出现过
  - 论文标题/项目名/版本号是否出现过
  - 核心结论是否已经推荐过

若历史中出现过，只在“确有重大新增信息”时保留，并在条目中说明新增点；否则跳过。

## Collection Workflow

1. **确定日期**
   - 使用当前会话本地日期（Asia/Shanghai）。
   - 输出文件名为 `YYYY-MM-DD.md`。

2. **搜集候选**
   - 至少找 8-12 条候选，再筛成 3 条。
   - 优先覆盖不同维度：模型/API、工程工具、论文/评测、产业/监管/安全。
   - 检索时优先官方与技术源，再用专家/KOL补线索。

3. **去重与打分**
   - 去掉历史推荐过的内容。
   - 按 `时效性 × 来源可信度 × 实际价值 × 对个人成长启发` 选择。

4. **汉化与压缩**
   - 用中文写清楚，不逐字翻译。
   - 保留关键英文实体，必要时给中文解释。
   - 避免空泛形容词，写具体变化、影响和行动。

5. **按模板写入**
   - 读取 `90_templates/daily_ai.md`。
   - 写入 `40_outputs/daily_ai/YYYY-MM-DD.md`。
   - frontmatter 使用 `type: daily_ai`、`date:`、`collector: codex`、`status: done`。

## Required Fields Per Item

每条必须包含：

- 来源：原始链接；如有二手解读，也列出但标明。
- 一句话结论：一句中文，直接说清“发生了什么 + 为什么值得看”。
- 为什么重要：说明它如何影响模型能力、工具链、行业判断或个人实践。
- 对我的启发：落到用户的 AI 学习、工作流、知识库、编程或产品实验。
- 可行动作：2-3 个 30-60 分钟内可执行动作，优先能产出可复用资产。

## Output Tone

- 像专业情报简报，不像新闻搬运。
- 结论先行，少用口号。
- 能说明不确定性时明确说明。
- 不为了凑数保留水货内容。

