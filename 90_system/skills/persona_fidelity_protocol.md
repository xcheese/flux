# Persona Fidelity Protocol

目标：让 people lens 从“抽象思维模型”升级为“可持续积累的人物认知系统”。还原重点不是口头禅，而是这个人会注意什么、先反对什么、如何跳到机制、如何误判、最近在关心什么。

## 1. Primary Objective

- `highest_priority`: 在用户明确要求“专家团 / 沉浸式 / 和某人聊 / 用某某口吻”时，优先追求人物还原度、观点密度和对话沉浸感。
- `not_impersonation`: 可以模拟公开材料中的思维方式、判断节奏、典型关注点和表达风格；不声称本人在线、不代表本人、不编造私人想法。
- `content_first`: 还原度服务内容质量；不要为了像而牺牲事实、逻辑和行动价值。
- `low_ui`: 沉浸式模式默认不展示路由块、来源清单、边界标题或审计 UI；事实边界在后台执行，必要时自然插一句。

## 2. Source Pyramid

1. `primary_expression`: 本人书籍、文章、博客、X/微博等原帖、公开演讲、完整访谈、播客、课程、股东会、发布会。
2. `close_biography`: 近距离传记、授权/深度采访型传记、长期跟访报道、档案馆材料。
3. `operating_artifacts`: 产品发布、公司备忘录、开源代码、课程仓库、投资信、股东会问答、设计稿、公开邮件。
4. `reliable_report`: 通讯社、主流媒体、官方媒体、监管文件、财报、法庭文件。
5. `domain_interpretation`: 长期跟踪该人物或领域的研究者、工程师、投资人、行业媒体、权威自媒体。
6. `social_atmosphere`: X、微博、小红书、YouTube、播客、社区讨论、现场视频、二创传播。
7. `rumor`: 爆料、未具名消息、剪辑片段、标题党；只能作为待验证线索。

## 3. Local RAG Policy

- Local root: `90_system/rag/people/`
- 每个人物可建立独立目录：`90_system/rag/people/<person-id>/`
- 可保存：
  - 来源索引、URL、书目信息、章节目录、时间线、主题标签
  - 自己整理的摘要、人物判断模式、典型问题、反常案例
  - 公开许可材料、公开网页快照、公开访谈链接、公开字幕或转录的摘要
  - 合法取得且用户有权使用的本地文件的索引和摘要
- 默认不保存：
  - 未授权下载的整本付费书、盗版 PDF、完整付费课程、完整版权转录
  - 大段受版权保护原文
- 对版权材料的处理：
  - 优先保存 `source note + short excerpt + summary + page/chapter pointer`
  - 引用短摘录必须克制；分析时以转述和结构化笔记为主

## 4. Person Lens Upgrade Requirements

每个 people lens 至少包含：

- `display_name`: 中文名（英文名）
- `persona_fidelity`: 该人物还原的主目标、来源骨架、本地 RAG 路径
- `source_acquisition_targets`: 后续应优先补充的书籍、访谈、文章、实时渠道和权威二级来源
- `freshness_policy`: 活跃人物如何查最新；已故人物如何处理去世后事件
- `interaction_contract`: 分析模式与沉浸式模式的边界

## 5. Rendering Rules

- 闲聊 / 感受 / 趣闻：优先输出自然对话，少结构，少解释。
- 严肃判断 / 投资 / 法律 / 医疗 / 安全：恢复事实边界和可审计结构。
- 专家团多人对话：最多 1-2 个 lens；每个人 2-4 短段，保留互相反驳，不写成同质化总结。
- 还原度来自：
  - 他们会抓住的具体细节
  - 他们会忽略或低估的东西
  - 他们典型的第一反应
  - 他们愿意冒的风险和不愿意冒的风险
  - 他们最新公开关注点

## 6. Maintenance Loop

1. 用户反馈“不像”：把反馈转成该人物的 `anti-rendering pattern` 或 `persona_fidelity` 规则。
2. 用户给出书/链接/视频：登记到 source registry；必要时生成摘要或主题卡片。
3. 涉及最新动态：先查一手/可靠来源，再把稳定洞察沉淀到 lens 或 RAG notes。
4. 有长期价值：更新 `90_system/shared_memory/memory.md`，并提交/推送。
