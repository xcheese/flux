# 视频链接采集与分析能力

目标：用户只丢链接，系统尽量自动完成取证、转录、截图/OCR、分析和入库。最终目标是产出 high 置信度的视频分析报告，而不是标题级摘要。

## 当前结论

对于抖音、B站、YouTube、小红书这类平台，处理能力分三档：页面取证、媒体处理、转录/OCR。high 置信度至少需要拿到一个强证据源：原视频文件、完整字幕/转录、可访问原视频页面、关键截图 + 页面可见字幕。

## A. 页面读取

用途：

- 打开用户给的链接
- 使用用户本机浏览器已登录状态
- 读取标题、作者、简介、评论区可见信息、页面文本
- 截图保存关键画面
- 记录 canonical URL、发布时间、时长、章节、可见字幕

需要：

- Codex Chrome Extension

当前状态：

- Chrome 正在运行
- Codex Chrome Extension 当前未在 Chrome 默认用户目录中检测到
- Chrome 应用商店显示该扩展“无法购买或下载”，当前无法通过商店安装
- 本地 Codex 插件包只有本机通信端，没有可直接离线安装到 Chrome 的扩展包

## B. 音视频处理

用途：

- 从视频中提取音频
- 截取关键画面
- 为后续转录和 OCR 做准备
- 保存素材到 `99_assets/video/<slug>/`

当前状态：

- `ffmpeg` 已安装

## C. 转录与 OCR

用途：

- 把视频口播转成文本
- 识别画面中的文字、图表标题、流程图结构

当前状态：

- `tesseract` 已安装，可做 OCR
- `whisper` 未安装，暂不能本地语音转录
- `yt-dlp` 未安装，暂不能走通用视频下载链路

## D. 下载/字幕获取

用途：

- 从 YouTube/B站等平台获取视频、音频、字幕、metadata
- 对抖音/小红书等平台尝试展开短链和保存页面证据

当前状态：

- `yt-dlp` 未安装
- 若用户要求只给链接也要 high 置信度，后续需要安装/启用 `yt-dlp` 或同类下载能力
- 平台登录态优先用本机浏览器，不要求用户提供账号密码

## 推荐第一版方案

如果 Codex Chrome Extension 可用，优先使用它读取已登录 Chrome 页面。

当前默认流程：

```text
链接 -> 查重 -> 展开/打开原页面 -> 尝试 metadata/字幕/下载 -> 截图/OCR/转录 -> 判定证据等级 -> Markdown 入库
```

如果只能拿到标题或少量页面信息：

```text
只登记 raw / low confidence，不输出完整分析报告
```

如果拿到视频文件或字幕：

```text
视频下载/音频提取 -> Whisper/ASR 转录 -> 关键帧 OCR -> high 置信度视频分析报告
```

## Chrome Extension 不可用时的替代方案

使用 Computer Use 操作用户本机 Chrome：

```text
链接 -> 用 Chrome 打开 -> 读取屏幕 -> 截图 -> OCR -> 基于可见内容分析 -> Markdown 入库
```

优点：

- 不依赖 Codex Chrome Extension
- 可以使用用户当前 Chrome 的登录状态
- 适合抖音、小红书这类登录态平台的第一版分析

限制：

- 读取的是屏幕和可见 UI，不是完整 DOM
- 需要页面上能看到标题、描述、字幕或关键画面
- 不一定能拿到完整视频口播文本

如果需要完整口播分析，再补充 `yt-dlp` 和 `whisper` 或其他转录服务。

## 目标产物结构

- 原始链接记录：`10_raw/links/YYYY-MM-DD_<platform>_<slug>.md`
- 完整视频分析：`10_raw/videos/YYYY-MM-DD_<platform>_<slug>_analysis.md`
- 素材目录：`99_assets/video/YYYY-MM-DD_<platform>_<slug>/`
  - `metadata.json`
  - `source_url.txt`
  - `audio.*`
  - `transcript.md`
  - `frames/`
  - `ocr.md`

## 注意

不要让用户直接提供账号密码。

如果平台必须登录，优先使用用户本机 Chrome 中已有的登录状态。无法访问时，标记为受限来源，基于可见信息做低置信度处理。

不得把二手转写稿或搜索结果包装成原视频 high 置信度分析。若使用二手材料，必须标记为 `medium` 或更低，并说明边界。
