# MVP 部署手册（GitHub Actions 云端版）

> 跑通这套流程后，你每天早上 09:30 会自动收到：
> - 📱 微信消息（WxPusher）：今日 AI 简报摘要
> - 🎧 mp3 音频：通过小宇宙 App 订阅，通勤路上听
> - 📄 Markdown 全文：仓库里永久存档

预计耗时：30-60 分钟。

---

## Step 1：创建 GitHub 仓库

```bash
# 1. 在 GitHub 新建一个仓库 my-ai-daily-digest（建议设为 Private）
# 2. 在本地：
cd d:/01_Workspace/My_AI_Project/ai探索项目/mvp
git init
git remote add origin git@github.com:<你的用户名>/my-ai-daily-digest.git
```

## Step 2：引入 follow-builders 作为子模块

```bash
git submodule add https://github.com/zarazhangrui/follow-builders.git follow-builders
git submodule update --init --recursive
```

## Step 3：申请 API key

### 3.1 Kimi (Moonshot AI) API Key（LLM 摘要）
1. 打开 https://platform.moonshot.cn 注册账号
2. 充值或使用赠送额度
3. 创建 API Key，复制保存（形如 `sk-xxx`）

> 我们用 OpenAI 兼容接口 `https://api.moonshot.cn/v1`，模型 `moonshot-v1-auto` 自动选 8k/32k/128k 上下文。
> 如果你后续想换成 DeepSeek/通义千问/智谱，只需改 `LLM_BASE_URL` 和 `LLM_MODEL` 两个环境变量。

### 3.2 WxPusher（微信推送，免费）
1. 打开 https://wxpusher.zjiecode.com
2. 微信扫码注册账号
3. 创建一个"应用"，记下 `appToken`
4. 关注他们的"WxPusher 消息推送"公众号
5. 在公众号里点"关注应用 → 选择你刚创建的应用"
6. 在管理后台拿到你的 UID（个人唯一标识）

> 也可以用 Server酱 / PushPlus，原理类似，三选一即可。

## Step 4：在 GitHub 仓库配置 Secrets

Settings → Secrets and variables → Actions → New repository secret，依次添加：

| Secret 名 | 值 |
|---|---|
| `KIMI_API_KEY` | Kimi 的 sk-xxx |
| `WXPUSHER_APP_TOKEN` | WxPusher 的 appToken |
| `WXPUSHER_UID` | WxPusher 的 UID |
| `SITE_URL` | `https://<你的用户名>.github.io/my-ai-daily-digest` |

## Step 5：开启 GitHub Pages

Settings → Pages：
- Source 选 `Deploy from a branch`
- Branch 选 `gh-pages`，目录 `/`（首次跑完 workflow 后才会有这个分支）

## Step 6：首次手动触发，验证流程

```bash
git add .
git commit -m "init MVP"
git push -u origin main
```

到 GitHub 仓库的 Actions 页面：
1. 选 `Daily AI Digest` workflow
2. 点 `Run workflow` 手动触发一次
3. 等 3-5 分钟跑完
4. 检查：
   - [ ] `output/<今日>/digest.md` 已生成
   - [ ] `output/<今日>/digest.mp3` 已生成
   - [ ] `feed.xml` 已更新
   - [ ] 微信收到 WxPusher 消息
   - [ ] 浏览器打开 `https://<用户名>.github.io/my-ai-daily-digest/feed.xml` 能看到 RSS XML

## Step 7：在小宇宙订阅你的私有播客

1. 打开小宇宙 App
2. 我的 → 设置 → 实验室 → 开启"通过 RSS 订阅播客"
3. 回到首页 → 搜索栏粘贴 `https://<用户名>.github.io/my-ai-daily-digest/feed.xml`
4. 点击"订阅"
5. ✅ 完成！明天 09:30 后小宇宙会自动出现今日新剧集

---

## 调试 & 调优

### 摘要风格不满意？
编辑 `scripts/digest.mjs` 里的 `systemPrompt`，调整段落字数、关注重点、语气。

### TTS 声音不喜欢？
编辑 `scripts/tts.mjs`，把 `zh-CN-XiaoxiaoNeural` 改成：
- `zh-CN-YunxiNeural`（沉稳男声）
- `zh-CN-YunyangNeural`（新闻男声，最适合早报）
- `zh-CN-XiaoyiNeural`（活泼女声）
完整列表：`npx msedge-tts --list`

### 想换发送时间？
改 `.github/workflows/digest.yml` 里的 cron 表达式：
- `'30 1 * * *'` → 北京 09:30
- `'0 0 * * *'` → 北京 08:00
- `'30 23 * * *'` → 北京 07:30

### 想加邮件备份？
在 `scripts/notify.mjs` 里加 Resend 调用：
```js
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'digest@你的域名.com',
  to: '你@邮箱.com',
  subject: `AI 简报 ${today}`,
  html: marked.parse(md),
});
```

### 想加更多中文信息源？
等 MVP 跑通后做阶段 2：在 `sources.yaml` 里登记小红书博主、公众号 RSS、文生图/视频/3D 源，
扩展 `scripts/digest.mjs` 在调 LLM 之前合并这些源的内容。

---

## 故障排查

| 问题 | 解决 |
|---|---|
| Actions 跑失败：找不到 prepare-digest.js | submodule 没初始化，运行 `git submodule update --init --recursive` |
| LLM 响应为空 / 401 | DeepSeek 余额不足或 key 错误，去后台充值或重新生成 |
| TTS 报错 ECONNREFUSED | Edge TTS 偶尔抽风，重跑一次即可 |
| 小宇宙搜不到 feed | 等 GitHub Pages 部署完成（5-10 分钟），用浏览器先访问 feed.xml 确认 200 |
| 微信收不到消息 | 检查是否关注了 WxPusher 公众号 + 选了对应应用 |

---

## 下一阶段（MVP 跑通后再做）

参考 `../README.md` 和 `../TODO.md` 的阶段 2-4：
- 加入小红书博主 / 公众号 / 文生图视频 3D / AI 游戏 信息源
- 优化 prompt 让 4 大类目分类更准
- 增加历史归档/月报功能
