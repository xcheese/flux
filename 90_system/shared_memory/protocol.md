# Shared Memory Protocol v1

## 目标

用 Markdown、frontmatter、索引和校验脚本，把 shared memory 从单一文件升级为轻量、可维护、可验证的记忆系统。

非目标：

- 不引入数据库。
- 不引入向量库或 RAG 服务。
- 不引入后端服务。
- 不一次性迁移全部历史内容。
- 不破坏 `memory.md` 作为 ChatGPT / Codex 入口的现有流程。

## 记忆层级

### `episodic`

临时事件、单次任务、近期交接、一次性实验。默认会过期、被压缩或从 current index 移除。

示例：某天生成一篇报告、某次分析一个项目、某次 Codex 任务结果。

### `internalized`

多次出现、已被验证的工作习惯、协作方式、项目约定。

示例：用户偏好 Agent-First、喜欢高密度架构压测、不喜欢无依据吹捧。

### `growth`

长期方法论、系统设计原则、可复用 SOP、稳定工作流。

示例：AI 高价值使用判断公式、Codex 任务拆解规范、报告生成 SOP。

### `core_identity`

极少修改的核心规则、长期角色定位、不可轻易覆盖的工作原则。

示例：用户希望 AI 做技术顾问、挑战假设、给出严谨可复核建议。

## 读取协议

1. 先读 `memory.md`，获得当前焦点和 fallback 信息。
2. 再读 `indexes/current.md`，获得结构化当前上下文。
3. 需要规则时读 `protocol.md`、`schema.md`、`lifecycle.md`。
4. 需要项目或类型详情时读 `indexes/by_project.md`、`indexes/by_type.md`、`indexes/by_tier.md`。
5. 最后按索引进入具体 `entries/`。

## 写入协议

- 写入前先问：这条信息是否能让未来 ChatGPT / Codex 少问一次、少重复一次判断、少踩一个坑？
- 不确定信息必须标为 `draft` 或低 confidence。
- 外部事实必须有来源路径或标注待验证。
- 新增条目后运行校验脚本。
- 重要条目应进入索引；不重要的历史流水不进 `current.md`。

## 兼容协议

`memory.md` 仍然保留：

- Current Focus
- Recent Changes
- Artifact Index
- Thinking Lens System fallback router
- Active Records 历史内容

结构化条目只补强，不替代现有入口。
