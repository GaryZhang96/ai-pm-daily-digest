// 把 follow-builders 抓回来的 JSON 用 LLM 重写成中文简报
// 替代了 Claude Code agent 的"remix"步骤
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FB_DIR = resolve(ROOT, 'follow-builders');

const today = new Date().toISOString().slice(0, 10);
const outDir = resolve(ROOT, 'output', today);
mkdirSync(outDir, { recursive: true });

console.log('[digest] 1/4 调用 follow-builders 抓取原始内容...');
const rawJson = execSync('node scripts/prepare-digest.js', {
  cwd: FB_DIR,
  encoding: 'utf-8',
  maxBuffer: 50 * 1024 * 1024,
});
const data = JSON.parse(rawJson);
writeFileSync(resolve(outDir, 'raw.json'), rawJson);

console.log(
  `[digest] 抓到 ${data.stats?.podcastEpisodes ?? 0} 期播客 / ${data.stats?.xBuilders ?? 0} 位 builder 的推文 / ${data.stats?.blogPosts ?? 0} 篇官方博客`,
);

if (
  (data.stats?.podcastEpisodes ?? 0) === 0 &&
  (data.stats?.xBuilders ?? 0) === 0 &&
  (data.stats?.blogPosts ?? 0) === 0
) {
  console.log('[digest] 今天没有新内容，退出');
  writeFileSync(resolve(outDir, 'digest.md'), `# AI 简报 ${today}\n\n今天暂无新内容。\n`);
  process.exit(0);
}

console.log('[digest] 2/4 读取 prompts (优先用 follow-builders 中心 feed 里的最新版)...');
const fbPrompts = data.prompts || {};
const readPrompt = (key, file) =>
  fbPrompts[key] ?? readFileSync(resolve(FB_DIR, 'prompts', file), 'utf-8');
const promptIntro = readPrompt('digest_intro', 'digest-intro.md');
const promptTweets = readPrompt('summarize_tweets', 'summarize-tweets.md');
const promptPodcast = readPrompt('summarize_podcast', 'summarize-podcast.md');
const promptBlogs = readPrompt('summarize_blogs', 'summarize-blogs.md');
const promptTranslate = readPrompt('translate', 'translate.md');

const systemPrompt = `你是一名 AI 行业资深编辑，专为一名游戏策划做每日 AI 简报。

风格要求：
${promptIntro}

推文摘要要求：
${promptTweets}

播客摘要要求：
${promptPodcast}

博客摘要要求：
${promptBlogs}

中文翻译要求：
${promptTranslate}

【附加个性化要求 - 必须严格遵守】
1. 阅读对象是一名游戏策划，对"AI 在游戏中的应用"特别敏感，相关内容请加重。
2. 重点关注：底层模型更新、AI 产品、文生图/视频/3D、AI 游戏与 Cursor Game Jam。
3. 输出语言：纯中文。所有英文专有名词（Anthropic、Replit 等）保留原文。
4. 严格按以下结构输出 Markdown，**今日要点必须放在最前面**：

## 今日要点
（这里写 60-100 字的高度概括，3-5 句话，让读者听 30 秒就能抓重点。这一段必须放在所有内容之前。）

## 1. 底层更新
（包括大模型迭代、AI 重大突破、底层原理、官方博客如 Anthropic Engineering）

## 2. AI 产品
（近期走红或值得关注的 AI 产品）

## 3. 文生图 / 视频 / 3D
（图像/视频/3D 生成相关进展）

## 4. AI 与游戏
（AI Agent 做游戏、Cursor Vibe Jam、游戏开发相关 AI 工具）

5. 每条内容 80-150 字，必须保留原始 URL。无相关内容的类目可省略，不要硬凑。
6. 全文控制在 1500-2500 字，TTS 朗读 5-8 分钟。
7. 不要在开头加"AI Builders Digest"这类英文标题，直接以"## 今日要点"开始。`;

console.log('[digest] 3/4 调用 LLM 生成简报...');
// Kimi (Moonshot) OpenAI 兼容接口；也可换 DeepSeek/通义千问，只改 baseURL + model
const client = new OpenAI({
  apiKey: process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY,
  baseURL: process.env.LLM_BASE_URL || 'https://api.moonshot.cn/v1',
});

const MODEL = process.env.LLM_MODEL || 'moonshot-v1-auto';

const userContent = `今日抓取的原始内容（JSON 格式，请基于此生成简报）：

\`\`\`json
${JSON.stringify(
  {
    podcasts: data.podcasts,
    x: data.x,
    blogs: data.blogs,
  },
  null,
  2,
).slice(0, 200000)}
\`\`\`

请按系统提示生成今日简报。`;

const completion = await client.chat.completions.create({
  model: MODEL,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ],
  temperature: 0.3,
});

const digestMd = `# AI 简报 ${today}\n\n${completion.choices[0].message.content}\n`;
writeFileSync(resolve(outDir, 'digest.md'), digestMd);
console.log(`[digest] 4/4 简报已生成 → output/${today}/digest.md`);
