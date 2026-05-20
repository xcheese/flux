# People Source Registry

本文件记录 expert / people lens 的优先材料来源。它不是完整 bibliography，而是后续本地 RAG 积累的入口。

## Global Acquisition Defaults

- 若人物还原度需要更多传记、访谈、书籍或实时材料，Codex/ChatGPT 默认自行搜索免费且合法可访问资源。
- 优先级：
  - 官方档案、本人/公司/机构官网、作者/出版社页面
  - 公开访谈、公开视频、播客、课程、演讲、股东会、发布会
  - X/社交原帖和稳定公开网页
  - 图书目录、合法试读、书摘、图书馆/平台合法预览
  - 权威媒体、垂直领域研究者、长期可信自媒体
- 不采用：
  - 盗版 PDF、网盘搬运、未授权整本付费书、完整付费课程、无来源大段转录
- 记录方式：
  - 采用来源：保存 URL、来源层级、抓取/阅读日期、摘要和适用的人物特征。
  - 拒绝来源：必要时记录拒绝原因，例如 suspected piracy、no provenance、paywalled full text。

## Elon Musk

- id: `people.elon-musk`
- local_rag: `90_system/rag/people/elon-musk/`
- primary_expression:
  - Elon Musk on X: https://x.com/elonmusk
  - Tesla: https://www.tesla.com
  - SpaceX: https://www.spacex.com
  - xAI: https://x.ai
  - Tesla / SpaceX / xAI 官方账号和公开发布
- close_biography:
  - Walter Isaacson, `Elon Musk` / 中信中文版《埃隆·马斯克传》: https://weread.qq.com/web/reader/d2e325c0813ab8234g019ba2k9bf32f301f9bf31c7ff0a60
  - Ashlee Vance, `Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future`
- domain_interpretation:
  - Reuters / AP / Bloomberg / Financial Times / Wall Street Journal
  - Everyday Astronaut engineering interviews
  - 长期跟踪 Tesla、中国 EV、AI、航天和中美科技关系的垂直媒体/研究者
- live_signals:
  - 2026-05-20 China visit / social atmosphere: `90_system/rag/people/elon-musk/live_signals/2026-05-20.md`

## Andrej Karpathy

- id: `people.andrej-karpathy`
- local_rag: `90_system/rag/people/andrej-karpathy/`
- primary_expression:
  - Website: https://karpathy.ai
  - GitHub: https://github.com/karpathy
  - Neural Networks: Zero to Hero: https://github.com/karpathy/nn-zero-to-hero
  - Software 2.0 essay: https://karpathy.medium.com/software-2-0-a64152b37c35
  - X / public talks / courses / interviews
- operating_artifacts:
  - course repos, teaching code, open source examples, AI engineering talks
- domain_interpretation:
  - credible AI engineering researchers/builders who discuss LLM reliability, agents, data, evals
- live_signals:
  - 2026-05-20 Anthropic / pretraining update: `90_system/rag/people/andrej-karpathy/live_signals/2026-05-20.md`

## Steve Jobs

- id: `people.steve-jobs`
- local_rag: `90_system/rag/people/steve-jobs/`
- primary_expression:
  - Steve Jobs Archive: https://stevejobsarchive.com
  - Apple keynotes / Apple Newsroom archive: https://www.apple.com/newsroom/
  - Stanford Commencement Address
  - public interviews
- close_biography:
  - Walter Isaacson, `Steve Jobs`
  - Brent Schlender and Rick Tetzeli, `Becoming Steve Jobs`
  - Steve Jobs Archive, `Make Something Wonderful`
- operating_artifacts:
  - product launches, keynote structure, Apple product decisions, historical interviews

## Charlie Munger

- id: `people.charlie-munger`
- local_rag: `90_system/rag/people/charlie-munger/`
- primary_expression:
  - Berkshire Hathaway letters and annual meetings: https://www.berkshirehathaway.com
  - Daily Journal annual meetings
  - `Poor Charlie's Almanack`
  - `The Psychology of Human Misjudgment`
- operating_artifacts:
  - shareholder Q&A, speeches, partnership/investment reasoning, inversion examples
- domain_interpretation:
  - Farnam Street and other long-form sources with traceable references

## Naval Ravikant

- id: `people.naval-ravikant`
- local_rag: `90_system/rag/people/naval-ravikant/`
- primary_expression:
  - Naval site: https://nav.al
  - How to Get Rich: https://nav.al/rich
  - Naval Podcast: https://nav.al/podcast
  - X / public interviews
- close_biography_or_synthesis:
  - `The Almanack of Naval Ravikant`: https://www.navalmanack.com
- operating_artifacts:
  - tweetstorms, podcast transcripts, startup/investing interviews, AngelList history
- live_signals:
  - 2026-05-20 `A Return to Code` / AI coding agents: `90_system/rag/people/naval-ravikant/live_signals/2026-05-20.md`
