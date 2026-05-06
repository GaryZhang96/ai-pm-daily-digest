# my-ai-daily-digest

每日 AI 简报播客 · 基于 [Zara Zhang 的 follow-builders](https://github.com/zarazhangrui/follow-builders)，跑在 GitHub Actions 上，输出私有播客 feed 供小宇宙订阅。

## 工作流

```
每天 09:30 (北京时间)
       │
       ▼
GitHub Actions 触发
       │
       ├── 1. follow-builders/scripts/prepare-digest.js  ──→ 抓取中心化 AI builder feed (含播客字幕 + X 推文)
       ├── 2. scripts/digest.mjs        ──→ DeepSeek LLM 摘要 + 按 4 大类目分类
       ├── 3. scripts/tts.mjs           ──→ Edge TTS 生成中文 mp3
       ├── 4. scripts/feed.mjs          ──→ 更新 podcast RSS feed.xml
       ├── 5. git commit + GitHub Pages ──→ mp3 / feed.xml 暴露成公网链接
       └── 6. scripts/notify.mjs        ──→ WxPusher 推送微信消息
                │
                ▼
        ① 微信收到摘要消息
        ② 小宇宙 App 自动下载今日新剧集
        ③ 通勤路上戴上耳机点播放
```

## 目录结构

```
my-ai-daily-digest/
├── .github/workflows/digest.yml    GitHub Actions 定时任务
├── follow-builders/                git submodule，Zara 维护
├── scripts/
│   ├── digest.mjs                  抓取 + LLM 摘要 (替代 Claude Code agent)
│   ├── tts.mjs                     Edge TTS 文转音
│   ├── feed.mjs                    生成 podcast RSS
│   └── notify.mjs                  WxPusher 微信推送
├── output/<日期>/digest.md          每日存档
├── output/<日期>/digest.mp3         每日音频
├── feed.xml                        播客订阅入口
└── package.json
```

## 部署

详见 [SETUP.md](./SETUP.md)。

## 后续规划

参考父级仓库的 `README.md` 和 `TODO.md` 的阶段 2-4。
