---
source: douyin_page_accessibility_screenshots_and_external_check
collected_at: 2026-05-25 14:57 CST
canonical_url: https://www.douyin.com/video/7642361133782160113
evidence_level: medium
confidence: medium
---

# 页面证据：萌萌本萌《codex超好用skills》

## 已获取

- 短链：`https://v.douyin.com/AMne8eAjCB4/`
- 展开链接：`https://www.douyin.com/video/7642361133782160113?previous_page=app_code_link`
- Chrome 当前页面：`https://www.douyin.com/video/7642361133782160113`
- 截图：
  - `page_screenshot.png`
  - `page_screenshot_0102.png`
- 采集方式：Chrome 页面可访问性树 + macOS 截图 + 公开网页补充核验。

## 页面元信息

- 作者：萌萌本萌🌸🌸🌸
- 作者数据：粉丝 23.9 万，获赞 604.4 万
- 发布时间：2026-05-22 18:18
- 视频时长：02:01
- 标题：`codex超好用skills，使用频率高，不吃灰#codex#skill#AnySearch #大模型#skill安装`
- 页面可见数据：点赞 7.3 万，评论 1061，收藏 5.8 万，分享 7938
- 搜索栏 / 相关搜索：`codex使用教程`

## 可见画面证据

- `page_screenshot.png`：视频约 00:19 / 02:01，画面是 README / 文档页面 + 口播字幕，可见字幕：`这个skill就是让大模型先去理解任务`。
- `page_screenshot_0102.png`：视频约 01:20 / 02:01，画面显示 AnySearch API key 配置片段，可见字幕：`把我们的API key编辑进去`，画面文字包含 `ANYSEARCH_API_KEY=你的key`。

## 可见评论样本

- `codex 与 claude code 怎么选`
- `为啥老黄选codex不选claude`
- `claude code和codex哪个更好用`
- `学姐你能不能先告诉我，你多少钱一个月买的codex`
- `我codex接国内模型，特别费token，不正常`

## 外部补充核验

- AnySearch 官方文档：`https://www.anysearch.com/docs`
- AnySearch GitHub：`https://github.com/anysearch-ai/anysearch-skill`
- OpenAI skills catalog：`https://github.com/openai/skills`

外部页面显示，AnySearch Skill 定位为给 AI agent 使用的统一实时搜索 skill，支持一般网页搜索、垂直搜索、批量搜索和整页内容提取；GitHub 页面显示该仓库约 1.1k stars、97 forks、20 commits，暂无正式 release。官方文档也说明 API key 可选但强烈推荐，无 key 会有更低限额。

## 取证失败 / 边界

- `yt-dlp` 无 cookies 获取失败：平台提示需要 fresh cookies。
- 未经用户明确授权，未抽取 Chrome cookies。
- 未拿到完整视频文件、完整字幕或完整口播转录。
- 因此本文只能基于页面标题、可见字幕片段、截图、评论和外部 AnySearch 项目核验进行分析；不能声称完整复述了视频教学步骤。
