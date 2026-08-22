# AI 简报 2026-08-22

## 今日要点
今日焦点集中在AI在医疗领域的应用，特别是Anthropic公司推出的Claude Code更新，以及其Managed Agents服务在企业中的应用。同时，OpenAI的Thibault Sottiaux强调了ChatGPT在API使用透明度和社区参与的重要性。此外，Replit与OpenAI的合作成为热议话题，预示着AI在编程教育和工具中的进一步融合。

## 1. 底层更新
### Anthropic Engineering: An update on recent Claude Code quality reports
Anthropic公司针对近期用户反馈Claude响应质量下降的问题进行了调查，并发现三个独立的问题影响了Claude Code、Claude Agent SDK和Claude Cowork。这些问题已于4月20日（版本2.1.116）全部解决。官方表示，他们非常重视用户关于模型性能下降的反馈，并在确认API和推理层未受影响后，迅速定位并解决了问题。[阅读更多](https://www.anthropic.com/engineering/april-23-postmortem)

### Anthropic Engineering: Scaling Managed Agents: Decoupling the brain from the hands
Anthropic介绍了Managed Agents的新功能，允许Claude Managed Agents在企业自己的基础设施上运行，从而控制数据的位置和访问权限。这标志着Anthropic在构建有效代理和为长期工作设计Harness方面迈出了重要一步。[阅读更多](https://www.anthropic.com/engineering/managed-agents)

### Claude Blog: New in Claude Managed Agents: self-hosted sandboxes and MCP tunnels
Claude Managed Agents现在可以在企业控制的沙箱中运行，并连接到私有的Model Context Protocol (MCP)服务器。这意味着代理执行工具和服务运行在企业的安全和运行时控制之下。[阅读更多](https://claude.com/blog/claude-managed-agents-updates)

## 2. AI 产品
### Boris Cherny (Claude Code @anthropicai)
Boris Cherny宣布，Anthropic正在为企业推出新的Fable安全措施，允许企业在自己的基础设施上运行，控制数据存储位置和访问权限。这一服务已经与约100家公司合作开发了一段时间，并计划在秋季更广泛地推出。[了解更多](https://x.com/bcherny/status/2090537902912815536)

### Thibault Sottiaux (Codex & ChatGPT @OpenAI)
Thibault Sottiaux澄清了关于Codex使用限制变化的一些传言，强调任何变更都会与社区沟通并保持透明。他提到，使用sub2api转换订阅为API流量以供多个用户使用是不被支持的，此类使用会被防欺诈系统标记。[了解更多](https://x.com/thsottiaux/status/2090675027670978569)

### Amjad Masad (CEO @replit)
Replit的CEO Amjad Masad宣布与OpenAI的合作，强调Replit的Free Mode在速度上的改进，使编码再次变得互动。[了解更多](https://x.com/amasad/status/2090484698413740186)

## 3. 文生图 / 视频 / 3D
### Thibault Sottiaux (Codex & ChatGPT @OpenAI)
Thibault Sottiaux分享了使用ChatGPT和API通过GPT-Image-2创建透明图像的功能，展示了他即将打印并放在笔记本电脑上的仙人掌图片。[查看图片](https://x.com/thsottiaux/status/2090631723302469995)

## 4. AI 与游戏
### No Priors: From Restoring Sight to Reimagining the Brain, with Max Hodak
No Priors播客邀请了Max Hodak，讨论了从恢复视力到重新构想大脑的技术进展，包括Prima植入物帮助失明者重见光明的技术，以及AI模型与神经科学之间的对齐表示。[收听播客](https://www.youtube.com/watch?v=7HXqMepjvy8)

Generated through the Follow Builders skill: https://github.com/zarazhangrui/follow-builders
