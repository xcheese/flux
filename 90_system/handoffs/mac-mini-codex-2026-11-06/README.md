# 家用 Mac mini 的 Codex 优化交接

## 用户目标与已确认边界

公司 MBP 已在 2026-11-06 优化 Codex 的全局规则、维护入口和技能触发。用户现在希望家用 Mac mini 也优化一轮，重点是整体配置、AGENTS.md、使用方式、约束和个性化，而非研究单个技能的实现细节。

在 mini 上执行本任务时：先检查、备份，再按差异改造并实际验证。保留用户核心要求与 mini 已有的有效偏好；模型、推理档位保持 mini 自己的当前值。不要直接复制 MBP 的整份配置，不调整审批、权限、登录或安全设置，不迁移令牌、Keychain、通知绝对路径、项目信任记录或 MCP 地址。不默认两台机器共享目录或已同步代码。本包未包含个人 config.toml、登录文件、备份、会话或记忆库。

## 本轮通用结论

- 全局 AGENTS.md 放稳定协作偏好及关键边界；项目细节放项目现有说明。简单任务直接完成，复杂且方向未定的任务先计划。
- 保留求真、方案修订不丢项、用户改动保护、授权复用、有效验证与模拟器收尾。达到约定完成条件就交付，范围外改进另列，不因一个小问题扩大为新工程。
- 验证应与改动相称；通过后仅因相关新改动、失败或未决风险增加检查。整条失败路线的尝试预算不能靠换方案重新计数。
- 记忆用作历史线索，当前状态重新核验；稳定偏好和临时任务进度分开。
- 当前官方文档将 personality=friendly/pragmatic 列为不再选择风格的兼容项。若 mini 存在该项，确认本机版本的支持情况后作为小项清理，不擅自改成 none；将需要的表达偏好保留在文字规则中。
- 最高推理档位不等同于所有任务最优。本轮不改模型或推理；如后续要调整，固定模型与任务比较质量、耗时和返工，再作决定。
- 配置文件默认值与当前会话实际运行限制要分别判断，不为了表面一致改权限。

## 包内参考如何使用

[`reference/global_codex/`](reference/global_codex/) 是 MBP 当前维护源中规则、五个自有工程技能、同步工具和测试的脱敏快照，不是让 mini 无条件覆盖的安装包。

**从这里开始：**用户将本链接交给 mini 上的 Codex 并要求执行后，先阅读本说明，再检查本机现状；按下列边界完成备份、适配、验证与交付。无需用户重新解释 MBP 上的整轮讨论。

参考文件入口：
- [全局规则](reference/global_codex/AGENTS.md)
- [维护工具说明](reference/global_codex/README.md)
- [同步入口](reference/global_codex/sync.sh)与[实现](reference/global_codex/sync.py)
- [同步回归测试](reference/global_codex/tests/test_sync.py)
- [五个自有工程技能](reference/global_codex/skills/)
- [文件哈希清单](manifest.json)

本目录是公开交接版，没有配置文件、密钥、登录态、私有备份、会话记录或记忆库。若采用脚本，需要下载完整 reference/global_codex 目录；不要只取 sync.sh。

1. 确认本机身份、用户目录、Codex 实际版本、当前生效全局规则与覆盖文件、配置和现有维护源。不假定它与 MBP 使用相同用户名或工作目录。
2. 查找 mini 已有维护源及其 Git 状态、远端与未提交修改。本包位于 xcheese/flux 仓库的独立交接目录。仓库原有 90_system/global_codex 路径不代表已经更新；应以本目录 reference/global_codex 快照为本轮参考，并与 mini 的现状合并。
3. 创建本机私有备份，记录原文件权限和哈希。把 mini 独有、明确的要求合并到维护源，保留未决冲突，不用 MBP 原文覆盖它的后续修改。
4. 包内 AGENTS.md 已将维护源路径和企业内网域名脱敏。先从 mini 现有规则核实并填回对应值，再同步；不把占位符直接部署，无法确认维护源时保留现状并报告。
5. 同步工具默认只管理 AGENTS.md 与五个工程技能；--check 只读。仅在范围、差异与验证明确后 --apply。不要使用 --migrate-config，它包含单独的历史配置迁移。
6. sync.sh 会寻找现有 Python 3.11+，覆盖 Intel/Apple Silicon 常见 Homebrew 位置；不要照搬 MBP 的 Python 绝对路径。不要因本次优化安装无关工具链。
7. 不批量重装第三方技能或覆盖插件缓存。只处理影响当前整体体验的已确认重复、误触发与冲突，保留来源、本地适配与机器差异。
8. 实际跑同步测试、检查源与生效文件一致，确认模型/推理及不在范围内的配置保持不变。用少量代表任务验证简单修改不扩大范围、方案修订不丢项、已有授权不反复询问。结构校验不等同实际生产流程验证。
9. 最终面向用户说明整体效果、具体变化、通过/失败/未测及回退位置，不堆单个技能实现细节。

## MBP 已验证与限制

维护入口及默认同步与配置迁移分离已完成；27 项同步测试通过，13 个受管文件与生效源一致；整个 config.toml 保持原字节。全局规则由 83 行压至 53 行。详细工作流前后冲突已作补修。

另发现两套演示技能的资源缺失：guizang 缺 assets/references/scripts，frontend-slides 缺部分模板和转换/发布/导出脚本。资源未恢复；不能称所有技能已可用。该发现只是 MBP 的状态，不得未经检查套用于 mini。本包没有包含这些第三方技能或其适配补丁，避免误搬机器差异。

## 官方依据（使用时确认是否有后续变化）

- https://learn.chatgpt.com/guides/best-practices
- https://learn.chatgpt.com/docs/customization/overview
- https://learn.chatgpt.com/docs/agent-configuration/agents-md
- https://learn.chatgpt.com/docs/config-file/config-reference
- https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra

最后一篇主要针对 Astra；可以参考减少过细流程的原则，不把它当作 Sol 的性能实测。
