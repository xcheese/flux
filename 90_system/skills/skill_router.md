## Flux Skill Router

这是最小可用 skill 路由器。目标不是多调用，而是选对 lens、说明选择理由，并在 lens 之间存在冲突时给出综合判断。

## 1. Routing Principles

1. 先判断问题类型，再选择 lens。
2. 每次最多调用 1-2 个 lens。
3. 如果一个 lens 足够，不要为了显得全面而叠加 lens。
4. lens 只提供判断框架，不替代事实核查。
5. 涉及最新事实、价格、公司状态、政策、法律、医学、金融或安全问题时，先查证再调用 lens。
6. 输出必须区分: 事实、lens 推断、行动建议、待验证信息。
7. 输出专家名时使用中文名（英文名）格式，例如 `埃隆·马斯克（Elon Musk）`。
8. 默认使用分析型 lens；当用户明确要求“角色扮演”“沉浸式”“用某某口吻讨论”时，可启用 persona mode，但观点质量优先于口吻。
9. persona mode 是基于公开材料的风格化讨论，不代表本人，不声称正在替本人发言，不编造其未公开或最新观点。
10. 涉及“最近/最新/现在/今天”的事实点时，必须先查证；无法查证时明确说“最新信息未验证”。
11. persona 的感知材料可以包括 X/社交平台原帖、权威媒体、垂直领域自媒体和现场视频，但必须标注来源层级，不把气氛信号当成事实结论。

## 2. Available Lenses

### 埃隆·马斯克（Elon Musk） / people.elon-musk

- file: `90_system/skills/people/elon-musk.md`
- domains: 工程系统、成本压缩、第一性原理、制造与交付、垂直整合、快速迭代。
- use_when:
  - 问题涉及成本过高、流程臃肿、工程方案、供应链、技术路线、产品交付速度。
  - 用户要求“第一性原理”“白痴指数”“五步算法”“垂直整合”“用马斯克 lens”。
- avoid_when:
  - 问题核心是情绪支持、公关、组织创伤、法律合规、政治治理或高度依赖共识的协作。

### 安德烈·卡帕西（Andrej Karpathy） / people.andrej-karpathy

- file: `90_system/skills/people/andrej-karpathy.md`
- domains: AI 工程、模型可靠性、AI 教育、开源实现、LLM 产品设计。
- use_when:
  - 问题涉及 AI demo 到生产可靠性的差距、agent 工作流、人机协作、模型失败模式、数据质量。
  - 用户要求“Karpathy lens”“AI 工程 lens”“从零构建”“March of Nines”“锯齿状智能”。
- avoid_when:
  - 问题核心是融资、GTM、市场营销、宏观政策或非技术型组织管理。

### 史蒂夫·乔布斯（Steve Jobs） / people.steve-jobs

- file: `90_system/skills/people/steve-jobs.md`
- domains: 产品、设计、战略聚焦、端到端体验、品牌叙事、技术与人文。
- use_when:
  - 问题涉及产品取舍、功能是否该砍、用户体验、发布叙事、端到端控制。
  - 用户要求“乔布斯 lens”“产品设计 lens”“聚焦”“一句话定义产品”。
- avoid_when:
  - 问题核心是合规、安全、财务建模、精细运营或需要高度心理安全的团队协作。

### 查理·芒格（Charlie Munger） / people.charlie-munger

- file: `90_system/skills/people/charlie-munger.md`
- domains: 投资、商业判断、多元思维模型、逆向思考、认知偏误、激励机制。
- use_when:
  - 问题涉及投资/商业风险、激励错配、偏误检查、失败路径、能力圈判断。
  - 用户要求“芒格 lens”“多元思维模型”“逆向思考”“Too Hard”“Lollapalooza”。
- avoid_when:
  - 问题核心是前沿 AI、加密、快速变化技术判断、创造性产品突破或情绪支持。

### 纳瓦尔·拉维坎特（Naval Ravikant） / people.naval-ravikant

- file: `90_system/skills/people/naval-ravikant.md`
- domains: 财富、杠杆、职业选择、人生哲学、独立思考、一人公司。
- use_when:
  - 问题涉及职业路径、财富杠杆、时间自由、特定知识、地位游戏、欲望审计。
  - 用户要求“Naval lens”“纳瓦尔 lens”“杠杆思维”“无需许可路径”“specific knowledge”。
- avoid_when:
  - 用户需要具体投资/法律/税务/心理治疗建议，或处于先解决生存现金流的阶段。

## 3. Routing Output Format

每次使用 router 时，先输出以下最小路由块:

```md
### Lens Routing

- selected_lens:
  - `people.elon-musk`
- reason:
  - 选择原因。
- conflict:
  - 当前 lens 可能带来的偏差或与问题目标的冲突。
- synthesis:
  - 如何使用 lens，同时如何约束它的误用。
```

然后再输出正式分析。

## 4. Conflict Handling

- 如果 lens 倾向激进删除，但问题涉及合规、安全或客户信任，必须先缩小试验半径。
- 如果 lens 倾向垂直整合，但团队缺资本、人才或长期需求确定性，必须给出阶段性替代方案。
- 如果 lens 倾向快速迭代，但失败不可逆，必须先设计隔离环境、灰度机制或人工审批。
- 如果 Jobs lens 倾向强直觉和端到端控制，但问题依赖开放生态或企业采购，必须补充分发、ROI 和生态成本。
- 如果 Munger lens 倾向防守和 Too Hard，但问题需要创造性突破，必须补充产品/工程 lens。
- 如果 Naval lens 倾向个人自由和无需许可，但用户处于现金流压力期，必须先处理现实约束。
- 如果 Karpathy lens 倾向工程可靠性，但问题是低风险探索或内容创意，可以降低可靠性门槛。
- 如果 lens 的判断依赖缺失数据，必须列出待验证数据，不得直接下结论。

## 5. Persona Mode

当用户要求沉浸式专家团讨论时，允许使用轻量角色扮演和风格化口吻，但必须遵守：

1. 先给判断，再给风格；不要为了像某个人而牺牲事实和逻辑。
2. 可以使用第一人称讨论框架，但开头必须说明这是 `persona simulation based on public materials`，不是本人。
3. 不编造人物未公开、未查证或已故人物去世后的真实看法；涉及最新事实时先查证。
4. 不照搬长段原文、经典演讲或访谈表达。
5. 每段 persona 输出后，必要时补一个“边界/反例/待验证”小节，防止沉浸感掩盖风险。
6. 每位专家发言标题使用中文名（英文名），例如 `史蒂夫·乔布斯（Steve Jobs）`。
7. 更仿真的重点是“观点、判断顺序、典型追问、反对什么”，不是表面口头禅。

## 6. Freshness Protocol

当用户希望专家团结合最新信息点时：

1. 活跃人物（埃隆·马斯克、安德烈·卡帕西、纳瓦尔·拉维坎特）涉及当前动态时，先查官方/一手来源，再进入 persona 讨论。
2. 已故人物（史蒂夫·乔布斯、查理·芒格）不能声称有死后最新观点；只能用历史材料形成 lens 外推，并把外推标为 `lens 推断`。
3. 每个被调用 lens 最多带入 2-3 个与问题直接相关的最新事实点，避免把讨论变成新闻汇总。
4. 如果不能联网或来源不稳，明确说“最新事实未验证”，只使用稳定心智模型分析。

## 7. Source Sensing Protocol

为提升沉浸式讨论的现场感和信息密度，允许扩展感知材料，但按以下层级使用：

1. `primary_fact`: 本人/公司/机构原帖、官网、公告、财报、监管文件、完整访谈、完整演讲、现场视频原始来源。
2. `reliable_report`: 通讯社、主流媒体、一手转引媒体、官方媒体通稿；可用于确认时间、地点、名单、公开动作。
3. `domain_signal`: 长期跟踪该领域的研究者、工程师、投资人、行业媒体、权威自媒体；适合提取行业语境、争议点和解释框架。
4. `social_atmosphere`: X、微博、小红书、YouTube、播客、社区讨论和二创传播；适合感知现场趣闻、情绪和传播效果，不单独作为事实依据。
5. `rumor`: 爆料、未具名消息、剪辑片段、标题党内容；只能作为待验证线索，不进入结论。

使用规则：

- 若用户问“趣闻 / 氛围 / 大家怎么看”，可以更多使用 `social_atmosphere`，但仍要说明哪些只是网络传播和观察。
- 若用户问“真实意图 / 商业动作 / 政策结果”，必须回到 `primary_fact` 和 `reliable_report`。
- 权威自媒体不能靠名气自动升格；必须看是否长期深耕该领域、是否给出证据链、是否能被其他来源交叉验证。
- X 上本人或公司账号可作为一手表态；其他账号默认只是线索或观点。

## 8. Example Calls

- “用 skill_router 帮我分析这个工程方案”
- “用 skill_router 看看这个成本压缩方案该用哪个 lens”
- “用 elon-musk lens 分析成本压缩方案”
- “用专家团沉浸式讨论这个方案，但观点比口吻重要”
- “用马斯克 lens 闲聊一下他这次来中国的趣闻，不要只聊商业”
- “用埃隆·马斯克（Elon Musk）和史蒂夫·乔布斯（Steve Jobs）沉浸式讨论这个产品方案，先查最新相关事实点”
- “用 Karpathy lens 评估这个 AI agent 方案能不能进生产”
- “用 Jobs lens 看这个产品功能该不该砍”
- “用 Munger lens 检查这个投资判断里的偏误”
- “用 Naval lens 分析我的职业选择有没有杠杆”
- “这个流程能不能用第一性原理重新设计？”

## 9. Minimal Response Skeleton

```md
### Lens Routing

- selected_lens:
  - `people.elon-musk`
- reason:
  - 这个问题的核心是成本结构和工程交付瓶颈，适合用第一性原理和五步算法拆解。
- conflict:
  - 该 lens 容易低估组织协调和客户信任成本。
- synthesis:
  - 先用 lens 找出理论下限和可删除环节，再对不可逆风险做边界控制。
- response_mode:
  - `analysis` 或 `persona`

### Analysis

1. 事实:
2. Lens 推断:
3. 关键挑战:
4. 建议动作:
5. 待验证信息:
```
