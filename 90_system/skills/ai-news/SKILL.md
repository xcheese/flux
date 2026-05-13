---
name: ai-news
description: Collect 3 high-value AI updates for the day when the user says “ai news”. Use primary/credible technical sources (official blogs, release notes, papers, GitHub releases). Write to /Users/momo/Documents/work/知识库/40_outputs/daily_ai/YYYY-MM-DD.md using /Users/momo/Documents/work/知识库/90_templates/daily_ai.md structure.
---

# AI News（手动触发采集）

当用户输入 **“ai news”**（或要求“采集今天 AI 高价值信息”）时，按下面流程执行。

## 输出要求（硬性）

- **只保留 3 条**；宁缺毋滥。
- **必须是一手/可信技术来源**（优先级从高到低）：
  1) 官方博客/公告、官方文档、官方 release notes
  2) 研究论文（arXiv/会议）、研究机构/实验室官方发布
  3) GitHub 项目：Releases / tags / PR / RFC（尽量指向具体版本或变更）
- **过滤掉**：无原始链接的爆料/搬运、营销号二次包装、标题党、低信息密度“观点帖”。
- 每条信息必须包含 5 段（与模板一致）：**来源链接 / 一句话结论 / 为什么重要 / 对我的启发 / 可行动作**。

## 采集流程

1) **确定日期**
   - 使用当前会话提供的本地日期（Asia/Shanghai）；输出文件名必须是 `YYYY-MM-DD.md`。

2) **找候选（≥6 条）**
   - 用 `web.run` 检索“近 24h”的：OpenAI / Anthropic / Google DeepMind / Meta / NVIDIA / Hugging Face / vLLM / llama.cpp / Transformers 等官方渠道，以及 arXiv 当日提交。
   - 如果“近 24h”不足 3 条高密度内容，允许扩展到“近 7 天”，但在条目里标注实际发布时间。

3) **筛成 3 条**
   - 优先：能改变你接下来 1–4 周学习/实践策略的更新（新模型/新 API、重要 release、关键论文/基准、关键工程稳定性修复）。
   - 避免：只有“宣布”但没有细节（指标、方法、变更点、接口/迁移说明）的内容。

4) **按模板写入**
   - 读取模板：`/Users/momo/Documents/work/知识库/90_templates/daily_ai.md`
   - 写入到：`/Users/momo/Documents/work/知识库/40_outputs/daily_ai/YYYY-MM-DD.md`
   - frontmatter：`type: daily_ai`、`date:`、`collector: codex`，完成后 `status: done`。

## 可行动作写法（建议）

- 以“30–60 分钟能完成”的下一步为主（例如：做一个最小 demo、跑一个基准、写一张检查表、整理一条笔记并链接到项目）。
- 每条给 2–3 个动作，优先“能产生可复用资产”（脚手架、基准脚本、清单、对比表、知识卡片）。

