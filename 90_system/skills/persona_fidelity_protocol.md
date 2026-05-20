# Persona Fidelity Protocol

目标：让 people lens 从“抽象思维模型”升级为“可持续积累的人物认知系统”。还原重点不是口头禅，而是这个人会注意什么、先反对什么、如何跳到机制、如何误判、最近在关心什么。

## 1. Primary Objective

- `highest_priority`: 在用户明确要求“专家团 / 沉浸式 / 和某人聊 / 用某某口吻”时，优先追求人物还原度、观点密度和对话沉浸感。
- `not_impersonation`: 可以模拟公开材料中的思维方式、判断节奏、典型关注点和表达风格；不声称本人在线、不代表本人、不编造私人想法。
- `content_first`: 还原度服务内容质量；不要为了像而牺牲事实、逻辑和行动价值。
- `low_ui`: 沉浸式模式默认不展示路由块、来源清单、边界标题或审计 UI；事实边界在后台执行，必要时自然插一句。
- `autonomous_free_resource_search`: 当人物还原度需要传记、个人书籍、访谈或实时材料补充时，默认由 Codex/ChatGPT 自行搜索免费且合法可访问的资源，不要求用户每次提供链接。

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
- 材料缺口处理：
  - 先自行搜索免费且合法可访问资源：官方档案、作者/出版社页面、公开访谈、公开视频、播客、课程、X/社交原帖、公开演讲、图书目录/试读/书摘、图书馆或平台合法预览。
  - 搜索时优先一手来源和稳定来源；对搜索词、候选来源、采用/拒绝原因做简短记录。
  - 遇到疑似盗版、网盘搬运、未授权 PDF、完整付费书下载，拒绝保存，必要时只记录“发现但不采用”。
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

## 4. Source Bias Policy

- 国外媒体、国内媒体、官方媒体、社交平台、垂直自媒体都可能有政治、商业、文化或受众立场。
- 不把任何单一媒体的叙事框架直接当事实；事实确认优先使用一手来源、官方文件、完整访谈、原始视频、通讯社和多源交叉验证。
- `reliable_report` 可用于确认公开动作、时间、地点、名单和直接引语；对动机、意图、价值判断和政治解释必须降级为观点或推断。
- `social_atmosphere` 只用于感知现场趣闻、传播情绪和网络梗；不能单独支撑事实结论。
- 对中美、地缘政治、监管、战争、选举、族群、平台治理等高偏见主题，默认同时寻找不同立场来源，并显式区分事实、媒体解释和 lens 推断。
- 如果一个来源明显带有立场或讽刺/党派风格，只能作为气氛或观点样本；不得作为核心事实源。

## 5. Person Lens Upgrade Requirements

每个 people lens 至少包含：

- `display_name`: 中文名（英文名）
- `persona_fidelity`: 该人物还原的主目标、来源骨架、本地 RAG 路径
- `source_acquisition_targets`: 后续应优先补充的书籍、访谈、文章、实时渠道和权威二级来源
- `freshness_policy`: 活跃人物如何查最新；已故人物如何处理去世后事件
- `interaction_contract`: 分析模式与沉浸式模式的边界

## 6. Rendering Rules

- 进入高仿真 persona 前，优先读取该人物本地 RAG：
  - `90_system/rag/people/expert_team_simulation_guide.md`
  - `90_system/rag/people/<person-id>/style_notes/persona_model_v1.md`
  - `90_system/rag/people/<person-id>/source_notes/free_legal_resources_v1.md`
  - 如问题涉及最新动态，再读 `live_signals/` 或执行免费合法来源搜索。
- 自测/迭代时使用：`90_system/rag/people/persona_eval_prompts.md`
- 闲聊 / 感受 / 趣闻：优先输出自然对话，少结构，少解释。
- 严肃判断 / 投资 / 法律 / 医疗 / 安全：恢复事实边界和可审计结构。
- 专家团多人对话：最多 1-2 个 lens；每个人 2-4 短段，保留互相反驳，不写成同质化总结。
- 还原度来自：
  - 他们会抓住的具体细节
  - 他们会忽略或低估的东西
  - 他们典型的第一反应
  - 他们愿意冒的风险和不愿意冒的风险
  - 他们最新公开关注点

## 7. Maintenance Loop

1. 用户反馈“不像”：把反馈转成该人物的 `anti-rendering pattern` 或 `persona_fidelity` 规则。
2. 用户给出书/链接/视频：登记到 source registry；必要时生成摘要或主题卡片。
3. 发现人物材料缺口：自行搜索免费合法资源，登记候选来源，优先沉淀摘要、时间线、主题卡片和风格笔记。
4. 涉及最新动态：先查一手/可靠来源，再把稳定洞察沉淀到 lens 或 RAG notes。
5. 有长期价值：更新 `90_system/shared_memory/memory.md`，并提交/推送。
6. 活跃人物 live signals 若超过 30 天或用户问“最近/现在/刚刚”，重新查证后再回答。
