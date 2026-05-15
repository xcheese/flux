---
type: video_analysis
source_platform: bilibili
url: https://www.bilibili.com/video/BV1Kk9kBAEJv/
bvid: BV1Kk9kBAEJv
author: 技术爬爬虾
title: Codex (APP) 保姆级全攻略，海量实战教程， 一期精通Codex
published: 2026-04-28
collected: 2026-05-15
processed: 2026-05-15
duration: 38:12
status: processed
evidence_level: high
confidence: medium_high
full_transcript_available: true
value_score: 9
tags:
  - AI
  - Codex
  - Agent
  - Skills
  - MCP
  - Computer Use
  - 个人知识库
---

# Codex (APP) 保姆级全攻略，海量实战教程， 一期精通 Codex

## 元信息

- 平台：Bilibili
- 作者：技术爬爬虾
- 原始链接：https://www.bilibili.com/video/BV1Kk9kBAEJv/
- 发布时间：2026-04-28
- 采集时间：2026-05-15
- 视频时长：38 分 12 秒
- 播放/互动：约 `47.7万` 播放、`1.88万` 点赞、`1818` 评论（metadata 读取时点）
- 证据等级：`high`
- 置信度：`medium_high`

## 证据与边界

- 已获取 B 站 metadata，含标题、作者、简介、发布时间、时长、播放/点赞/评论、章节与格式信息。
- 已下载原始音频并用 `whisper-cpp` 本地转录，生成完整 ASR 转录与 SRT。
- 本地证据目录：`10_raw/videos/2026-05-15_bilibili_BV1Kk9kBAEJv/`
- 未提交到 Git 的大文件/版权材料：`audio.m4a`、`audio.wav`、`transcript.txt`、`transcript.srt`、`transcript.json`、`metadata.json`。
- ASR 模型为 `ggml-base`，对中文技术词存在误听：如 `GitHub`、`AGENTS.md`、`Claude Code`、`sandbox` 等词需要结合上下文校正。
- 官方交叉验证来源：
  - OpenAI Help：`https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan/`
  - OpenAI Enterprise/Edu Release Notes：`https://help.openai.com/en/articles/10128477-chatgpt-enterprise-edu-release-notes`
  - OpenAI Skills Help：`https://help.openai.com/articles/20001066-skills-in-chatgpt`

## 一句话结论

这条视频是一份面向普通用户的 Codex App 上手教程，价值不在“功能罗列”，而在展示了 Codex 从单轮代码助手升级为“本地项目 + 云端任务 + Git 工作流 + Skills + MCP + Computer Use + 自动化”的 Agent 工作台；对你最有用的是把它转化成自己的 Agent-First 工作流检查清单。

## 内容结构

### 00:00-01:48 / 安装与初始化

视频开场把 Codex App 定位为 Codex 多种形态中能力最完整的一种，并强调它相对 Claude Code 的使用体验优势。随后讲安装前准备：Git、Node.js、VS Code，并演示用 ChatGPT 账号登录、选择工作类型、初始化沙箱。

### 01:48-04:55 / 基础使用与多任务并行

作者展示 Codex App 的三栏结构：左侧任务/项目，中间对话，右侧多功能区域。重点是同一时间可以在多个项目、多个对话中并行跑任务，并用任务状态区分运行中、等待批准和已完成。

### 04:55-08:57 / 权限、沙箱、上下文与模型

视频把 Codex 的权限体系解释为以沙箱为地基：默认可以读写项目文件夹，但不能越界修改沙箱外文件，也默认禁网。需要越权时走 `escalate`/提权审批。作者推荐“自动审查”模式：低风险提权自动放行，高风险再人工确认。随后讲上下文使用量、压缩、模型选择和额度。

### 08:57-12:24 / AI 画图、Steer 与计划模式

作者用宠物洗护店网页演示图片生成和页面修改，并指出如果 AI 方向错了，要及时用 `Steer` 中断/引导，而不是等错误执行到底。计划模式部分强调：复杂任务先让 Codex 产出计划，用户确认粒度和迁移策略后再执行。

### 12:24-19:42 / 内置浏览器、批注、Git、回滚与 worktree

视频演示 Codex 内置浏览器可用于启动本地服务、视觉检查、对页面元素批注并回写修改。Git 部分包括初始化仓库、提交、推送 GitHub、用 fork/分叉对话回退对话历史、用 Git commit 回退代码，以及用 Git worktree 并行开发多个分支。

### 19:42-21:40 / 云端运行

作者展示把本地代码推到 GitHub 后，Codex 可以在云端初始化运行环境、修改代码、创建 PR，再由用户审查合并，最后同步回本地。这个场景适合手机端审批和不在电脑旁时继续推进任务。

### 21:40-24:40 / 记忆系统

视频讲两层记忆：项目根目录的 `AGENTS.md`（ASR 误写为类似 `Asense.rmd`）用于当前项目上下文；全局指令用于所有项目。作者还提到实验性“聊天生成记忆”，但未深入展开。

### 24:40-27:06 / 插件与自动化

作者把插件理解为第三方服务注入 Codex 的能力，演示 GitHub 和 Gmail 插件，并把“每周统计 GitHub star 并发邮件”做成自动化。这里最重要的不是邮件 demo，而是“插件 + 自动化 + memory.md”形成可重复任务闭环。

### 27:06-32:42 / Skills

视频把 Skills 定义为给 Agent 的专业技能包：把工作流、专业规范或固定流程封装成说明书。作者演示官方 Remotion skill、第三方 PPT skill，以及用 `skill-creator` 自制“视频字幕转 Markdown 图文教程”的 skill。

### 32:42-36:13 / MCP 与部署插件

作者解释 MCP 是模型的标准化工具箱，并用 Supabase MCP 给项目添加数据库表和后端写入。随后演示 Netlify 插件部署项目。这个章节说明 Codex 的能力边界可以通过 MCP/插件扩到外部系统。

### 36:13-38:12 / Computer Use 与定时任务

最后展示 Computer Use 操作本机应用：给老板发消息、读取 GitHub 看板、汇总进度并发送英文简报。作者还把流程做成每天 17:00 自动化，并提醒 Mac 上要开启运行时防休眠。

## 核心观点

- Codex App 的核心价值是“多 Agent 工作台”，不是单纯聊天或单个终端代理。
- 沙箱、提权审批、自动审查是 Agent 可控执行的基础设施；没有权限边界，自动化越强越危险。
- 对复杂任务，`Plan Mode` 应该成为默认入口；先对齐方案，再让 Agent 动手。
- `Steer` 是高质量使用 Agent 的关键动作：发现方向错，及时干预，而不是等待错误完成。
- Git 与 worktree 是 AI 编程的安全网：用 commit 保存可回滚节点，用 worktree 并行探索方案。
- 记忆系统决定长期效率：项目级 `AGENTS.md`、全局指令、自动化生成的 `memory.md` 都是在减少重复解释。
- Skills/MCP/插件/Computer Use 是同一件事的不同层级：把 Agent 从“会写代码”扩展成“会调用外部能力并执行流程”。

## 事实 / 观点 / 推断

### 事实

- 视频 metadata 显示标题为“Codex (APP) 保姆级全攻略，海量实战教程， 一期精通Codex”，作者为“技术爬爬虾”，发布时间为 2026-04-28，时长约 38:12。
- B 站 metadata 提供 10 个章节：引言、基础使用、画图、计划模式、代码管理、云端运行、记忆系统、插件自动化、Skills、MCP。
- 本地 ASR 覆盖完整音频，内容与章节结构一致。
- OpenAI Help 页面说明 Codex 可本地配对或委托云端任务，Codex App 提供 worktree、skills、automations、git 等能力；Skills 也被官方说明为支持 Codex。

### 作者观点

- Codex App 是 Codex 多形态里综合能力最强的形态。
- 相比 Claude Code，Codex App 额度更高、功能更全、上手更快。
- 自动审查权限模式是作者最推荐的默认模式。
- 复杂任务应优先开启计划模式。
- 项目级和全局记忆对于复杂项目是必要能力。

### 我的推断

- 对你当前知识库来说，这条视频的最大价值是验证“shared memory + skills + 自动化 + git push”的方向是对的。
- 视频偏教程，不是深度评测；它会自然强调功能亮点，弱化失败率、权限风险、成本、模型行为不稳定等问题。
- 真正可复用的不是作者的 demo，而是背后的工作流模板：计划 → 执行 → 浏览器验证 → Git 保存 → 记忆沉淀 → 自动化复用。

### 待验证

- 视频中关于“免费账户也能用”“不会限速、封号、降智”“额度更高”等说法，需要以 OpenAI 官方当前说明和你的实际账户体验为准。
- `GPT-Image-2`、具体模型名、额度展示、插件市场入口等 UI/产品细节可能会随版本变化。
- ASR 对部分术语存在误听，若要做逐字教程复刻，应回看原视频画面或使用更高精度模型重转录。

## 论据质量

- 强证据：原始 B 站 metadata、完整本地音频、完整 ASR 转录、B 站章节、官方 OpenAI Help/Release Notes/Skills 页面。
- 中等证据：作者的实机演示和个人体验判断。
- 弱证据：作者对 Claude Code、额度、限速、封号、降智等横向比较，缺少同条件测试数据。
- 风险点：视频标题是“保姆级全攻略”，天然偏教程营销风格；需要把“演示可行”与“长期稳定可依赖”区分开。

## 高价值点

- 对你当前阶段最重要的是 `Plan Mode`、`Steer`、`Git/worktree`、`AGENTS.md/shared memory`、`Skills`、`MCP`、`Computer Use` 七个概念。
- 它把 Codex 从“写代码工具”扩展成了“个人自动化操作系统”的雏形，和你正在做的跨 agent 记忆、视频分析 skill、AI 情报员高度同构。
- 它提供了一个可执行的成熟度模型：先本地任务跑通，再加 Git 安全网，再加记忆，再封装 Skills，最后接插件/MCP/自动化。
- 它也提醒你：自动化越强，越需要权限边界、审批、日志、可回滚和防休眠等工程治理。

## 噪音与风险

- “一期精通”是典型教程标题，实际不可能通过一条视频精通 Codex；更合理目标是建立功能地图和实践清单。
- 视频没有系统讨论失败案例：任务跑偏、错误修改、敏感数据访问、插件误操作、自动化误发消息。
- 对外部动作的 demo（发邮件、发消息、操作老板聊天）需要非常严格的人审确认，不能直接默认自动发送。
- 自动化任务依赖本地机器状态；如果机器休眠、断网、未登录、权限过期，任务会失败。
- Skills/MCP/插件会扩大攻击面；第三方 skill 和 MCP 配置不能无脑安装。

## 我的判断

值得沉淀。它不是高密度理论内容，但对你当前目标非常实用：它把你近期讨论的“跨 agent 记忆、skill 化、视频链接分析、自动化、Git push”放进了 Codex App 的完整产品能力图里。建议把它作为 Codex 工作流能力清单的参考，而不是当作产品真相的唯一来源。

## 可行动作

- 建一份 `Codex App 工作流成熟度清单`：基础使用、权限、计划模式、Steer、浏览器验证、Git、worktree、云端、记忆、插件、Skills、MCP、Computer Use、自动化。
- 把当前知识库补齐为视频里的闭环：每个长期任务都要有 `AGENTS.md` / shared memory、产物路径、Git 提交、下一步责任人。
- 为 Computer Use / 自动化建立强制安全规则：发消息、发邮件、删文件、花钱、改权限、访问敏感数据必须二次确认。
- 把“视频链接分析员.skill”继续产品化：B 站优先走 `yt-dlp metadata -> audio -> whisper-cpp transcript -> report`，抖音优先走浏览器页面 + 可见字幕 + OCR。
- 对视频中的产品事实另建 `Codex 官方事实核对清单`，只用 OpenAI 官方文档更新，避免被教程视频的产品口径带偏。

## 关联笔记

- [[Agent 工作流]]
- [[共享记忆]]
- [[视频链接分析员.skill]]
- [[Codex]]
- [[Skills]]
- [[MCP]]

## 后续补充

- 如需逐字级教程复刻，建议用更高精度 ASR 模型重新转录，并抽取关键界面截图。
- 可把本文的“工作流成熟度清单”沉淀到 `20_wiki/` 或 `90_system/tools/`。
- 可基于本视频单独创建一个 `codex-app-workflow-checklist` skill，用于评估每个 Codex 项目是否具备记忆、权限、回滚和自动化闭环。
