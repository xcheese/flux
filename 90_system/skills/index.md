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

## Example Calls

- “用 skill_router 帮我分析这个工程方案”
- “用 elon-musk lens 分析成本压缩方案”
- “用第一性原理 lens 看看这个流程是不是该存在”
- “先读 `90_system/skills/index.md`，再帮我选择 lens”
