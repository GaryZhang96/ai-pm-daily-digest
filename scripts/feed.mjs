// 维护 Podcast RSS feed.xml，让小宇宙能订阅
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import RSS from 'rss';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SITE = process.env.SITE_URL || 'https://你的GitHub用户名.github.io/my-ai-daily-digest';

const feed = new RSS({
  title: '我的 AI 每日简报',
  description: '基于 Zara Zhang 的 follow-builders，每日精选 AI 行业动态、产品、文生图/视频/3D 与 AI 游戏。',
  feed_url: `${SITE}/feed.xml`,
  site_url: SITE,
  language: 'zh-CN',
  pubDate: new Date(),
  ttl: 60,
  custom_namespaces: { itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd' },
  custom_elements: [
    { 'itunes:author': '我' },
    { 'itunes:category': [{ _attr: { text: 'Technology' } }] },
    { 'itunes:explicit': 'no' },
    { 'itunes:image': { _attr: { href: `${SITE}/cover.jpg` } } },
  ],
});

const outputDir = resolve(ROOT, 'output');
if (!existsSync(outputDir)) {
  console.log('[feed] output 目录不存在，跳过');
  process.exit(0);
}

const days = readdirSync(outputDir)
  .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
  .sort()
  .reverse()
  .slice(0, 30);

for (const day of days) {
  const mp3 = resolve(outputDir, day, 'digest.mp3');
  const md = resolve(outputDir, day, 'digest.md');
  if (!existsSync(mp3) || !existsSync(md)) continue;
  const size = statSync(mp3).size;
  const mdContent = readFileSync(md, 'utf-8');
  const summaryMatch = mdContent.match(/##\s*今日要点[：:]?\s*\n+([\s\S]+?)(?=\n##|\n#|$)/);
  const summary = summaryMatch
    ? summaryMatch[1].trim().replace(/\n+/g, ' ').slice(0, 280)
    : `${day} AI 简报`;
  feed.item({
    title: `${day} AI 简报`,
    description: summary,
    url: `${SITE}/output/${day}/`,
    guid: day,
    date: new Date(`${day}T01:30:00Z`),
    enclosure: { url: `${SITE}/output/${day}/digest.mp3`, size, type: 'audio/mpeg' },
    custom_elements: [
      { 'itunes:duration': '00:06:00' },
      { 'itunes:explicit': 'no' },
    ],
  });
}

writeFileSync(resolve(ROOT, 'feed.xml'), feed.xml({ indent: true }));
console.log(`[feed] feed.xml 已更新（含最近 ${days.length} 期）`);
