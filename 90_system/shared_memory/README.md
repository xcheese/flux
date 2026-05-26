# Flux Shared Memory v1

Flux shared memory 是 ChatGPT、Codex、本地脚本和未来 agent 之间的轻量交接系统。它解决的问题不是“永久记住一切”，而是让未来协作少问一次、少重复一次判断、少踩一个坑。

## 1. `memory.md` 和 `entries/` 的区别

- `memory.md`：共享入口和 fallback index，适合 ChatGPT 快速读取当前状态、重要路径、最近变化和最低可用路由。
- `entries/`：结构化记忆条目，适合长期维护、校验、索引和生命周期管理。
- `indexes/`：由人工或脚本维护的快速索引，帮助按项目、类型、层级读取结构化记忆。

历史流水可以继续保留在 `memory.md`。新增结构化记忆应优先写入 `entries/`，并更新索引。

## 2. 什么信息应该写入

- 会影响后续 ChatGPT / Codex 判断的项目约定、工作流、偏好、风险、决策。
- 可复用 SOP、模板、报告生成规范、工具链约束。
- 重要产物路径、当前活跃项目、下一步动作。
- 已验证多次、值得长期保留的协作原则。

## 3. 什么信息不应该写入

- 密钥、token、账号、证件、私人敏感信息。
- 未授权的大段版权内容。
- 不会复用的一次性闲聊。
- 没有来源的外部事实。
- 临时路径、临时猜测、未经验证的判断，除非明确标为 `draft` 或低 confidence。

## 4. 新增记忆步骤

1. 判断是否值得写入。
2. 选择 `memory_type`。
3. 选择 `tier`。
4. 从 `templates/` 复制合适模板到 `entries/<tier>/`。
5. 填写 frontmatter。
6. 更新 `indexes/current.md` 或相关索引。
7. 运行校验：

```bash
node 90_system/shared_memory/scripts/validate_memory.mjs
```

8. 在 `memory.md` 的 Recent Changes 追加一句摘要。

## 5. Codex 完成任务后如何回写

- 任务交接优先使用 `templates/task_handoff.md`。
- 如果是长期规则或偏好，使用 `templates/user_preference.md` 或 `templates/decision_record.md`。
- 如果只是单次任务，默认进入 `entries/episodic/`。
- 如果未来会复用，且已有产物路径和验证结果，可进入 `internalized` 或 `growth`。

## 6. ChatGPT / Codex 读取优先级

1. `90_system/shared_memory/memory.md`
2. `90_system/shared_memory/indexes/current.md`
3. `90_system/shared_memory/protocol.md`
4. `90_system/shared_memory/indexes/by_project.md`
5. 具体 `entries/`

## 7. 如何处理过期、错误、冲突记忆

- 过期任务从 `indexes/current.md` 移除，条目可保留。
- 被替代的规则标记为 `superseded`，不要静默删除。
- 错误记忆标记为 `deprecated`，并说明原因。
- 新旧规则冲突时，创建 `decision` 类型条目，说明替换原因、影响范围和回滚条件。

## 8. 验证

校验脚本只依赖 Node.js 标准库：

```bash
node 90_system/shared_memory/scripts/validate_memory.mjs
```

索引生成脚本：

```bash
node 90_system/shared_memory/scripts/build_indexes.mjs
```
