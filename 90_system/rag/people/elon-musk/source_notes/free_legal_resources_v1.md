# Elon Musk Free / Legal Resources v1

- updated_at: `2026-05-20`
- purpose: 为 `people.elon-musk` 提供高仿真 persona 的免费/合法可访问材料入口。

## Adopted Sources

### Primary Expression

- Elon Musk on X: https://x.com/elonmusk
  - layer: `primary_expression`
  - use_for: 实时表达、meme 感、短句节奏、公开关注点。
  - caution: X 原帖可作为本人公开表达；转发/截图/二创不能单独作为事实。
- Tesla Master Plans: https://www.tesla.com/master-plans
  - layer: `primary_expression`
  - use_for: 长期使命叙事、能源/交通系统性目标、Tesla 战略语言。
- SpaceX mission: https://www.spacex.com/mission/
  - layer: `operating_artifacts`
  - use_for: 火星/多行星叙事、工程使命边界。
- xAI: https://x.ai
  - layer: `operating_artifacts`
  - use_for: AI 方向、产品/模型最新公开材料。

### Close Biography / Legal Preview

- Walter Isaacson, `Elon Musk` / 微信读书《埃隆·马斯克传》: https://weread.qq.com/web/reader/d2e325c0813ab8234g019ba2k9bf32f301f9bf31c7ff0a60
  - layer: `close_biography`
  - use_for: 危机驱动、家庭/童年背景、制造现场、Twitter/X 收购、管理风格。
  - caution: 传记，不是自传；保存书目信息、目录、短摘录和自有摘要，不保存整本书。
- Axios excerpt from Isaacson biography: https://www.axios.com/2023/09/08/walter-isaacson-elon-musk-book-excerpt
  - layer: `close_biography`
  - use_for: Robotaxi、小车争论、制造线贴近设计的判断模式。
  - caution: excerpt only; use as legally available short source.

### Interviews / Factory Tours

- Everyday Astronaut Starbase Tour and Interview: https://everydayastronaut.com/starbase-tour-and-interview-with-elon-musk/
  - layer: `primary_expression`
  - use_for: 现场工程口吻、边走边判断、工厂/火箭细节、迭代节奏。
- Lex Fridman Podcast #400 transcript: https://lexfridman.com/elon-musk-4-transcript
  - layer: `primary_expression`
  - use_for: 战争、AI、外星人、政治、物理、游戏和人类未来的长形式表达。

### Reliable Report / Context

- AP, Reuters, Bloomberg, Financial Times, Wall Street Journal
  - layer: `reliable_report`
  - use_for: 行程、公司状态、监管、财报、法律和市场事实。
- 新华社 / 央视 / 上海发布 / Tesla China 官方
  - layer: `reliable_report`
  - use_for: 中国境内公开活动、政策语境、上海工厂相关事实。

## Persona Extraction Notes

- 先注意具体物件和现场异常，再跳到系统机制。
- 高仿真对话要短、快、直接；不要写成公关稿。
- 对趣闻可使用 `social_atmosphere`，但事实判断要回到 `primary_expression` 或 `reliable_report`。
- 典型关注：制造线、反馈循环、瓶颈、可逆失败、时间线、成本、荒诞感。

## Rejected / Avoid By Default

- 未授权整本 PDF、网盘搬运、付费书盗版下载。
- 剪辑号对访谈的断章取义。
- 只凭 X 截图或中文自媒体标题断言真实意图。
