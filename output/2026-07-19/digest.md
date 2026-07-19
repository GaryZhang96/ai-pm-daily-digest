# AI 简报 2026-07-19

## 今日要点
今日焦点集中在AI算力需求的爆炸性增长以及AI在游戏开发中的应用。OpenAI的算力负责人Sachin Katti在播客中讨论了AI算力供应的紧迫性，强调了AI设计自身芯片的能力。同时，游戏策划应关注AI在游戏开发中的新应用，如Claude Managed Agents的更新，允许在私有环境中执行AI工具。

## 1. 底层更新
### Anthropic Engineering: An update on recent Claude Code quality reports
Anthropic团队调查了近期关于Claude响应质量下降的报告，发现三个独立的问题影响了Claude Code、Claude Agent SDK和Claude Cowork。所有问题已于4月20日（版本2.1.116）解决。文章详细解释了问题的原因、修复措施及未来预防措施。特别是，Claude Code默认推理努力从高调整为中等，随后用户反馈质量下降，团队于4月7日恢复至高努力模式。此外，还解决了会话缓存优化的问题，该问题导致Claude在会话中忘记之前的推理。[阅读更多](https://www.anthropic.com/engineering/april-23-postmortem)

### Anthropic Engineering: Scaling Managed Agents: Decoupling the brain from the hands
Anthropic介绍了Managed Agents的新功能，该功能允许在用户控制的沙箱中运行，并连接到私有的Model Context Protocol (MCP)服务器。这意味着代理执行工具和服务都在企业的安全和运行时控制之下。[阅读更多](https://www.anthropic.com/engineering/managed-agents)

## 2. AI 产品
### Claude Blog: New in Claude Managed Agents: self-hosted sandboxes and MCP tunnels
Claude Managed Agents现在可以在您控制的沙箱中运行，并连接到您的私有MCP服务器。这意味着代理执行工具和它所触及的服务都在您的企业边界内运行，受到您的安全和运行时控制。[阅读更多](https://claude.com/blog/claude-managed-agents-updates)

## 3. 文生图 / 视频 / 3D
无相关更新。

## 4. AI 与游戏
### The MAD Podcast with Matt Turck: OpenAI’s Compute Chief: We Can’t Build Fast Enough | Sachin Katti
Sachin Katti，OpenAI的工业计算负责人，在播客中讨论了AI算力需求的爆炸性增长，以及OpenAI如何通过自建和合作来满足这一需求。他提到，AI的发展速度如此之快，以至于算力供应始终跟不上需求。此外，他还讨论了AI如何帮助设计自己的芯片，以及OpenAI在定制芯片Jalapeno上的进展。[观看视频](https://www.youtube.com/watch?v=wEZBlmvxx4o)

Generated through the Follow Builders skill: https://github.com/zarazhangrui/follow-builders
