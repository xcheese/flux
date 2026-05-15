---
name: 抖音视频分析员.skill
description: Trigger this skill when the user sends a Douyin/TikTok-style short video link or asks to analyze a Douyin video. Capture the source, try to obtain video/page/transcript evidence, and produce a structured Chinese analysis report only when enough content is available.
---

# 抖音视频分析员.skill

当用户发送抖音短链、抖音分享文本、`douyin.com/video/...` 链接，或要求“分析这个抖音视频”时，执行本 skill。

## Mission

目标不是保存链接，而是尽量产出一份可复用的中文视频分析报告：内容结构、核心观点、论据质量、噪音过滤、对用户个人成长/AI 方向的启发，以及可行动作。

## Evidence First

不要基于标题编造完整分析。每次先判断证据等级：

- `high`: 有完整转录、字幕、视频文件或足够长的页面正文。
- `medium`: 有章节、关键截图/OCR、可见字幕片段、作者/评论/简介等足够上下文。
- `low`: 只有短链、标题片段、作者或少量分享文本。

只有 `high` 或较强 `medium` 才输出完整报告；`low` 只能入库为待补材料。

## Acquisition Workflow

1. **查重**
   - 在 `10_raw/links/`、`10_raw/videos/`、`10_raw/posts/` 中搜索短链、展开链接、标题、作者。
   - 已存在则更新原笔记，不重复创建。

2. **尝试获取内容**
   - 优先打开原链接，记录展开后的 `douyin.com/video/...` 链接、标题、作者、发布时间、时长、简介、章节、字幕、评论区高频问题。
   - 如果需要登录态，优先使用用户本机 Chrome/Computer Use，不要求用户提供账号密码。
   - 如果用户提供视频文件、音频、截图或转录，优先使用这些材料。
   - 若可用工具支持，提取关键帧/OCR；若本地有 ASR/Whisper 再做口播转录。

3. **决定产物**
   - 内容不足：写入 `10_raw/links/YYYY-MM-DD_douyin_<slug>.md`，`status: raw`，`confidence: low`，列出待补材料。
   - 内容充分：写入 `10_raw/videos/YYYY-MM-DD_douyin_<slug>_analysis.md`，`status: processed`，按 `90_templates/video_analysis.md` 输出完整分析。

4. **更新共享记忆**
   - 只有当视频与长期方向相关、可复用，或需要后续补材料时，才更新 `90_system/shared_memory/memory.md`。
   - 共享记忆只记录路径、状态、下一步，不粘贴报告正文。

## Required Report Sections

完整报告必须包含：

- 元信息：链接、作者、标题、发布时间、采集时间、证据等级、置信度。
- 内容结构：按时间线或主题拆解视频。
- 核心观点：视频真正想表达的 3-7 个观点。
- 事实/观点/推断：分清已看到的内容、作者判断、LLM 推断。
- 论据质量：哪些有证据，哪些只是口号或情绪表达。
- 高价值点：对用户 AI 成长、知识库、工作流、产品/职业判断的价值。
- 噪音与风险：标题党、营销包装、搬运、缺少来源、逻辑跳跃。
- 我的判断：是否值得沉淀，为什么。
- 可行动作：2-5 个可执行动作，优先能产出笔记、清单、实验或项目。
- 关联笔记：链接到已有 wiki、outputs 或 projects。

## Report Standard

- 直接、具体、中文化，不做逐字复述。
- 能标注时间戳就标注；拿不到时间戳就按主题分组。
- 不把作者观点当事实；不把 LLM 推断当视频原意。
- 不因视频热度高就提高价值分；价值取决于信息密度、可验证性和对用户的行动启发。
- 如果材料不足，明确写“无法完整分析”，并列出最小补充材料：视频文件、口播转录、字幕、关键截图。

## Useful Local References

- 能力边界说明：`90_system/tools/video_link_ingestion.md`
- 链接模板：`90_templates/link_note.md`
- 视频分析模板：`90_templates/video_analysis.md`

