# Flux Skills Index

最小 skill 索引。ChatGPT / Codex 读取本文件后，可按问题类型进入 `skill_router.md`，或直接调用单个 thinking lens。

## Router

- skill_router: `90_system/skills/skill_router.md`
- use_when:
  - 不确定该用哪个 lens。
  - 一个问题可能同时涉及工程、商业、组织或风险权衡。
  - 需要输出 lens 选择原因、冲突与综合判断。
- rule:
  - 每次最多调用 1-2 个 lens。

## People Lenses

### Andrej Karpathy

- id: `people.andrej-karpathy`
- file: `90_system/skills/people/andrej-karpathy.md`
- domains:
  - AI 工程
  - 模型可靠性
  - AI 教育
  - 开源实现
  - LLM 产品设计
- use_when:
  - 评估 AI demo 到生产可靠性的差距、agent 工作流、人机协作、数据质量和模型失败模式。
  - 需要从零构建、March of Nines、锯齿状智能角度分析 AI 系统。
- avoid_when:
  - 问题主要是融资、GTM、市场营销、宏观政策或非技术型组织管理。

### Charlie Munger

- id: `people.charlie-munger`
- file: `90_system/skills/people/charlie-munger.md`
- domains:
  - 投资
  - 商业判断
  - 多元思维模型
  - 逆向思考
  - 认知偏误
  - 激励机制
- use_when:
  - 检查投资/商业决策中的失败路径、激励错配、偏误叠加和能力圈边界。
  - 需要逆向思考、Too Hard 分类、愚蠢清单。
- avoid_when:
  - 问题主要是前沿 AI、加密、快速变化技术判断、创造性产品突破或情绪支持。

### Elon Musk

- id: `people.elon-musk`
- file: `90_system/skills/people/elon-musk.md`
- domains:
  - 工程系统
  - 成本压缩
  - 第一性原理
  - 制造与交付
  - 垂直整合
  - 快速迭代
- use_when:
  - 分析工程方案、成本结构、供应链、流程臃肿、技术路线或交付瓶颈。
  - 需要从理论下限、白痴指数、五步算法、垂直整合角度挑战方案。
- avoid_when:
  - 问题主要是法律合规、政治治理、公共关系、心理支持、组织创伤或高度依赖共识的协作。
  - 失败不可逆，且尚未设计安全边界。

### Naval Ravikant

- id: `people.naval-ravikant`
- file: `90_system/skills/people/naval-ravikant.md`
- domains:
  - 财富
  - 杠杆
  - 职业选择
  - 人生哲学
  - 独立思考
  - 一人公司
- use_when:
  - 分析职业路径、财富杠杆、时间自由、特定知识、地位游戏和欲望审计。
  - 需要寻找无需许可路径，或判断工作是否有非线性杠杆。
- avoid_when:
  - 用户需要具体投资/法律/税务/心理治疗建议，或处于先解决生存现金流的阶段。

### Steve Jobs

- id: `people.steve-jobs`
- file: `90_system/skills/people/steve-jobs.md`
- domains:
  - 产品
  - 设计
  - 战略聚焦
  - 端到端用户体验
  - 品牌叙事
  - 技术与人文
- use_when:
  - 分析产品取舍、功能是否该砍、用户体验、发布叙事、端到端控制。
  - 需要一句话定义产品，或从技术与人文交汇处重新设计体验。
- avoid_when:
  - 问题主要是合规、安全、财务建模、精细运营或需要高度心理安全的团队协作。

## Example Calls

- “用 skill_router 帮我分析这个工程方案”
- “用 elon-musk lens 分析成本压缩方案”
- “用 Karpathy lens 评估这个 AI agent 方案”
- “用 Jobs lens 帮我砍产品功能”
- “用 Munger lens 检查这个投资判断”
- “用 Naval lens 分析我的职业选择有没有杠杆”
- “用第一性原理 lens 看看这个流程是不是该存在”
- “先读 `90_system/skills/index.md`，再帮我选择 lens”
