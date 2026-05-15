---
name: 视频链接分析员.skill
description: Trigger this skill when the user sends a Douyin, Bilibili, YouTube, TikTok, Xiaohongshu, or other video link and expects a high-confidence Chinese analysis report. The agent must acquire evidence from the link (video file, transcript/subtitles, accessible page, screenshots/OCR) before analysis.
---

# 视频链接分析员.skill

当用户发送抖音、B站、YouTube、TikTok、小红书或其它视频链接，并希望“分析视频内容/观点/价值”时，执行本 skill。

## Mission

用户只负责丢链接；素材准备、取证、转录、截图/OCR、分析和入库应由 Codex 尽量完成。

目标不是保存链接，而是产出一份可复用的中文视频分析报告：内容结构、核心观点、论据质量、噪音过滤、对用户个人成长/AI 方向的启发，以及可行动作。

## Evidence First

不要基于标题编造完整分析。每次先判断证据等级：

- `high`: 至少拿到一个强证据源：原视频文件、完整字幕/转录、可访问原视频页面、关键截图 + 页面可见字幕；最好同时有音频转录和关键帧/OCR。
- `medium`: 有疑似同源转写稿、章节、关键截图/OCR、可见字幕片段、作者/评论/简介等足够上下文，但不是完整原视频证据。
- `low`: 只有短链、标题片段、作者或少量分享文本。

只有 `high` 或较强 `medium` 才输出完整报告；`low` 只能入库为待补材料。

## Link-Driven Acquisition

用户不会提前准备视频文件、字幕或截图。收到链接后按顺序尝试：

1. **网页/平台取证**
   - 展开短链，记录 canonical URL、标题、作者、发布时间、时长、简介、合集/章节、可见字幕、评论高频问题。
   - 若平台需要登录态，优先使用用户本机浏览器/Computer Use，不要求用户提供账号密码。

2. **下载/字幕取证**
   - 若 `yt-dlp` 或平台可用下载工具存在，尝试下载视频、音频、字幕、metadata。
   - YouTube/B站优先尝试字幕/自动字幕；抖音/小红书优先尝试网页字幕、截图 OCR、浏览器可见内容。
   - 若工具缺失或网络受限，明确记录缺口，并按需要请求安装/授权。

3. **本地媒体处理**
   - 用 `ffmpeg` 提取音频、采样关键帧、生成缩略图。
   - 用 OCR 读取关键帧文字、PPT、代码、图表、字幕。
   - 若本地 ASR/Whisper 可用，则转录口播；不可用时记录为缺口。

4. **证据打包**
   - 将视频文件、音频、字幕、转录、关键截图、OCR 结果保存到同一素材目录。
   - 报告必须引用这些证据的路径或说明证据来源。
   - 知识库展示层只应暴露分析报告；完整字幕、metadata、音频、视频、OCR 原文等只作为本地证据数据保留，不进入文档列表。

## Acquisition Workflow

1. **查重**
   - 在 `10_raw/links/`、`10_raw/videos/`、`10_raw/posts/` 中搜索短链、展开链接、标题、作者。
   - 已存在则更新原笔记，不重复创建。

2. **尝试获取内容**
   - 优先从链接本身拿到原视频页面、字幕/转录、视频文件、关键截图和 OCR。
   - 只有在自动取证失败时，才向用户说明需要补充的最小材料。

3. **决定产物**
   - 内容不足：写入 `10_raw/links/YYYY-MM-DD_douyin_<slug>.md`，`status: raw`，`confidence: low`，列出待补材料。
   - 内容充分：写入 `10_raw/videos/YYYY-MM-DD_douyin_<slug>_analysis.md`，`status: processed`，按 `90_templates/video_analysis.md` 输出完整分析。
   - 若使用素材目录形态，展示入口固定为 `analysis.md`；其他证据文件用 `.gitignore` 或索引过滤隐藏。

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

## Current Tool Reality

- 已知本机可用：`ffmpeg`、`tesseract`、`yt-dlp`、`whisper-cpp`。
- 当前未检测到：`whisper`、`faster-whisper`。
- B站/YouTube 优先尝试：`yt-dlp metadata -> audio/subtitles -> whisper-cpp ASR -> report`。
- 抖音/小红书优先尝试：浏览器原始页、可见字幕、页面章节、截图/OCR；若 `yt-dlp` 要求 fresh cookies，记录边界。
