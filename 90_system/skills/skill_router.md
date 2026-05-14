## Flux Skill Router

这是最小可用 skill 路由器。目标不是多调用，而是选对 lens、说明选择理由，并在 lens 之间存在冲突时给出综合判断。

## 1. Routing Principles

1. 先判断问题类型，再选择 lens。
2. 每次最多调用 1-2 个 lens。
3. 如果一个 lens 足够，不要为了显得全面而叠加 lens。
4. lens 只提供判断框架，不替代事实核查。
5. 涉及最新事实、价格、公司状态、政策、法律、医学、金融或安全问题时，先查证再调用 lens。
6. 输出必须区分: 事实、lens 推断、行动建议、待验证信息。

## 2. Available Lenses

### people.elon-musk

- file: `90_system/skills/people/elon-musk.md`
- domains: 工程系统、成本压缩、第一性原理、制造与交付、垂直整合、快速迭代。
- use_when:
  - 问题涉及成本过高、流程臃肿、工程方案、供应链、技术路线、产品交付速度。
  - 用户要求“第一性原理”“白痴指数”“五步算法”“垂直整合”“用马斯克 lens”。
- avoid_when:
  - 问题核心是情绪支持、公关、组织创伤、法律合规、政治治理或高度依赖共识的协作。

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
- 如果 lens 的判断依赖缺失数据，必须列出待验证数据，不得直接下结论。

## 5. Example Calls

- “用 skill_router 帮我分析这个工程方案”
- “用 skill_router 看看这个成本压缩方案该用哪个 lens”
- “用 elon-musk lens 分析成本压缩方案”
- “这个流程能不能用第一性原理重新设计？”

## 6. Minimal Response Skeleton

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

### Analysis

1. 事实:
2. Lens 推断:
3. 关键挑战:
4. 建议动作:
5. 待验证信息:
```
