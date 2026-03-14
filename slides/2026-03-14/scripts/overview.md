# Memoh — 容器化 AI Agent System 演讲大纲（20 分钟）

---

## 一、开场：小龙虾热与 Agent 元年（~2.5min）

### 自我介绍

- Acbox / 小箱子，Memoh 核心贡献者
- 推特 / GitHub / Memoh 贡献者列表

### "养小龙虾" 现象

- 2026 年 1 月底 OpenClaw 病毒式传播，GitHub 星标飙到 25 万+
- Nvidia CEO Jensen Huang 称其为"史上最重要软件发布"
- 中国掀起"小龙虾热"，各地涌现装机服务、政府补贴、企业试点
- 这不只是一个开源项目的流行，而是 **AI Agent 从概念走向大众的分水岭**

### 但热潮之下暗流涌动

- 一键 RCE 漏洞（CVE-2026-25253）：恶意网站可劫持本地代理
- ClawHub 恶意技能、暴露实例泄露 API 密钥
- 中国政府警告国企和银行禁用，多家科技公司内部限制使用
- 本质问题：**Agent 直接操作你的电脑，安全边界在哪里？**

### 引出问题

- Agent 的能力毋庸置疑，但怎样让它**安全、可控、可管理**？
- 这正是 Memoh 要回答的问题

## 二、Memoh 是什么 — 定位与设计哲学（~2min）

### OpenClaw vs Memoh：两种路线

| | OpenClaw | Memoh |
|---|---------|-------|
| 定位 | Personal Assistant | Agent Platform / System |
| 运行环境 | 你的电脑 | 独立容器 |
| 安全模型 | 信任 Agent | 隔离 Agent |
| 用户 | 单人 | 多用户多租户 |
| 配置 | CLI / 配置文件 | 全图形化 WebUI |
| 部署 | 自己折腾 | 一键 Docker Compose |

### 核心设计哲学

- **不让 AI 操作你的电脑，给 AI 它自己的电脑**
- 每个 Bot 运行在独立容器中 → 即使 Agent 失控，也只是在自己的沙箱里
- 一开始就面向「稳定可落地的服务」设计，不是实验项目

### 平台化方案：私有部署 + SaaS 两条路

- **Memoh 是一个平台，不是一个客户端**
- 私有部署：一键安装到公司内网或自有服务器，数据完全自主可控
  - `curl -fsSL https://memoh.sh | sudo sh`，Docker Compose 一把梭
  - 适合对数据安全有要求的企业、团队、家庭
- SaaS：同一套系统也可以做托管服务，对外提供 Agent 平台能力
- 多租户：每个人有自己的账号和 Bot，角色权限控制（owner / admin / member）
- 一套代码两种交付方式 — 这是和 OpenClaw "个人工具" 的本质区别

## 三、项目故事：从 Telegram 水群到 Agent 平台（~1.5min）

### 起源

- 去年年底在 Telegram 水群，看到群友做的 bot：能分清群里的人、有长期记忆、加载 24h 上下文
- 触发思考：如果给这个 bot 一个独立的运行环境，它能做什么？
- 于是开始设计 Memoh：一开始就研究 Agent Container，做了定时任务、Telegram 支持、WebUI
- 定位从第一天起就是「稳定可落地的服务」，不是实验项目

### OpenClaw 的影响

- 1 月底 OpenClaw 爆火后，吸收了大量设计思路
- 上个月密集发布 features，社区反响不错
- 但 Memoh 不是 OpenClaw 的仿品 — 出发点和架构路线从一开始就不同

## 四、架构总览（~2min）

### 四大服务

| 服务 | 技术栈 | 职责 |
|------|--------|------|
| Server | Go + Echo | 主控：API、认证、数据库、容器管理、渠道适配 |
| Agent Gateway | Bun + Elysia | AI 推理网关：对话、流式输出、工具执行 |
| Web | Vue 3 + Vite | 管理界面：可视化配置一切 |
| Browser Gateway | Bun + Playwright | 浏览器自动化：每个 Bot 可拥有无头浏览器 |

### 为什么是 Go + TypeScript 双层

- Go 做「管控面」— 容器编排、数据库、认证、渠道路由；性能好、并发强、适合长期运行
- TypeScript 做「推理面」— Vercel AI SDK 生态成熟，模型适配、工具调用、流式输出都是现成的
- 两层通过 HTTP / Bearer Auth 通信，职责清晰

### 基础设施

- PostgreSQL（35+ 张表，存储一切状态）
- Qdrant（向量数据库，记忆检索）
- Containerd（容器运行时，Bot 隔离）

## 五、安全设计：容器化隔离如何解决 OpenClaw 的核心问题（~3min）

### OpenClaw 的安全困境

- Agent 直接运行在用户电脑上 → 拥有用户所有权限
- 恶意提示注入 → Agent 可能执行危险命令、删除文件、泄露密钥
- Microsoft 警告的两大风险：间接提示注入 + 权限滥用
- 本质问题：**Agent 的能力边界 = 用户的能力边界，没有隔离层**

### Memoh 的回答：Containerd 容器隔离

- 每个 Bot = 一个 Containerd 容器（不是 Docker，更轻量，Docker 底层也是 Containerd）
- 容器内运行 gRPC 服务（ReadFile / WriteFile / ListDir / Exec）
- 主服务通过 gRPC 远程调用 → Agent 永远不直接接触宿主机
- 即使 Agent 被提示注入，影响范围只限于自己的容器
- 容器快照：保存/恢复状态，出问题可以回滚
- CNI 网络隔离：可以控制容器的网络访问范围

### MCP — 受控的工具体系

- ToolGateway 聚合 15+ 种内置工具源，全部通过 Server 层代理
- 外部 MCP 连接也通过统一网关，可做权限审计
- 对比 OpenClaw 的 ClawHub：我们的工具执行在受控环境内，不是在你的电脑上

## 六、Agent 推理层（~2.5min）

### Agent 核心（packages/agent）

- 基于 Vercel AI SDK 的 `streamText` / `generateText`
- 多模型支持：OpenAI / Anthropic / Google，按 `clientType` 自由切换
- 每个 Bot 独立配置聊天模型、记忆模型、嵌入模型

### 人格与技能系统

- 容器 `/data/` 下的人格文件：`IDENTITY.md`（身份）、`SOUL.md`（性格）、`TOOLS.md`（工具指南）
- 模块化技能文件：Bot 可以在运行时启用/禁用
- 子 Agent 协作：创建多个 Subagent，独立上下文和技能，主 Agent 可委派任务

### 工程防护

- 工具循环检测：检测重复工具调用，注入警告或中止
- 文本重复检测（Sential）：n-gram 分析，防止 Agent 陷入循环输出
- 这些不是 fancy feature，而是让 Agent 长期稳定运行的必要措施

## 七、记忆系统：从文件到多 Provider 架构（~3.5min）

### 为什么记忆很重要

- 没有记忆的 Agent 只是一个聊天机器人
- 有记忆的 Agent 才能真正理解你、为你服务
- OpenClaw 的记忆方案相对简单；Memoh 把记忆作为核心能力来设计

### 最新架构：可插拔的多 Provider 体系

- `Provider` 统一接口：
  - 对话钩子：`OnBeforeChat`（注入记忆上下文）/ `OnAfterChat`（提取存储）
  - MCP 工具：暴露 `search_memory` 给 Bot
  - CRUD + 生命周期管理（压缩、统计、重建）
- Registry 工厂模式：懒加载 + 缓存，配置变更自动热更新，无需重启

### 内置记忆的三种模式

| 模式 | 存储 | 检索 | 适用场景 |
|------|------|------|---------|
| off | Markdown 文件 | 文件扫描 | 零依赖，最简部署 |
| sparse | Markdown + Qdrant 稀疏向量 | BM25 风格 | 关键词精准匹配 |
| dense | Markdown + Qdrant 稠密向量 | Embedding 语义搜索 | 语义相似度 |

- 关键设计：**Markdown 文件是 source of truth**，Qdrant 是派生索引
- 即使 Qdrant 挂了，记忆数据不会丢，可以随时 Rebuild
- scan-based 索引取代旧的 manifest.json，消除同步问题

### 外部 Provider

- **Mem0**：对接 Mem0 SaaS API
- **OpenViking**：对接 OpenViking（自托管或 SaaS）
- 前端管理界面动态渲染配置 schema — 添加新 Provider 不需要改前端代码

## 八、多平台渠道与身份识别（~1.5min）

### 统一渠道抽象

- 适配器：Telegram、Discord、飞书、WeCom、QQ、Email、Web/CLI
- 统一入站/出站消息格式，跨平台一致体验
- 出站消息智能分块，适配各平台长度限制

### 群聊多身份识别

- 这是 Memoh 最初的灵感来源
- `channel_identities` 表统一入站身份，Bot 能区分群里每个人
- 跨平台身份绑定：同一个人在 Telegram、Discord、飞书上关联为同一用户
- 绑定码机制：生成一次性 code，在不同平台输入即可关联

## 九、商业视角：Agent 经济与 Memoh 的机会（~2.5min）

### 小龙虾热的商业启示

- 装机服务火爆但本质是一次性生意 — 没有持续收入
- 安全问题让企业望而却步 → 个人设备上的 Agent 很难企业化
- 当本土 AI Agent 方案成熟时，纯客户端模式的天花板会很明显

### 平台化的商业优势

- 装机服务 vs 平台服务：一次性收入 vs 持续订阅
- 私有部署：企业买的是**可控性** — 数据在自己手里，Agent 在自己的容器里
- SaaS：面向中小团队，低门槛上手
- 开放生态（MCP + 多记忆 Provider + 多模型）→ 可以围绕平台构建增值服务

### SaaS → Agent 的趋势

- Agent 正在侵蚀传统 SaaS 的市场
- 未来不是"用软件"而是"管理 Agent"
- Memoh 提供的是 Agent 的管理基础设施

## 十、总结与展望（~1min）

### 核心信息

- OpenClaw 证明了 AI Agent 的市场需求是真实的
- 但"Agent 直接操作你的电脑"这个模式有根本性的安全瓶颈
- Memoh 的答案：**不是给 AI 你的电脑，而是给 AI 它自己的电脑**
- 容器隔离 + 多租户 + 可视化管理 + 可插拔记忆 → 面向真实生产环境的 Agent 平台

### 展望

- 记忆系统持续演进（更多 Provider、更智能的召回）
- 更丰富的 Agent 协作能力
- 社区驱动，欢迎贡献

---

## 演讲节奏备注

### 结构逻辑

整个演讲的叙事线是：

1. **现象**（小龙虾热）→ 2. **定位**（Memoh vs OpenClaw）→ 3. **故事**（我是怎么做出来的）→ 4-8. **技术深潜**（架构、安全、Agent、记忆、渠道）→ 9. **商业**（为什么这条路更有前途）→ 10. **收束**

把个人故事放在技术之前，让观众先建立情感连接和信任感，再带着"这个人为什么要做这件事"的 context 去听技术细节。

### 时间分配

| 部分 | 时长 | 性质 |
|------|------|------|
| 一（小龙虾热） | 2.5min | 抓注意力，建立行业 context |
| 二（Memoh 定位） | 2min | 对比定位，核心哲学 |
| 三（项目故事） | 1.5min | **情感连接，建立信任** |
| 四（架构总览） | 2min | 技术全景 |
| 五（安全/容器化） | 3min | **核心技术卖点** |
| 六（Agent 推理） | 2.5min | 技术深度 |
| 七（记忆系统） | 3.5min | **最新亮点** |
| 八（渠道/身份） | 1.5min | 差异化功能 |
| 九（商业分析） | 2.5min | **格局提升** |
| 十（总结） | 1min | 收束 |

### 建议配图/Demo

- 第一部分：OpenClaw GitHub 星标增长曲线、小龙虾 meme、新闻标题截图
- 第二部分：Memoh vs OpenClaw 对比表
- 第三部分：Memoh 早期截图 / GitHub 时间线
- 第四部分：架构图（README 中的 ASCII 图可以美化）
- 第五部分：容器生命周期示意图、WebUI 容器管理截图
- 第七部分：三种记忆模式的架构对比图
- 第九部分：平台化 vs 客户端模式的对比图、部署方式示意

### 如果时间紧张

- 第六部分（Agent 推理层）可压缩到 1.5min，只讲多模型 + 人格系统
- 第八部分（渠道/身份）可压缩到 1min，只讲身份识别
- 不要压缩第一、三、五、七、九部分 — 它们是演讲的骨架
