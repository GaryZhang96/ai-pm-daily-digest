// 企业微信群机器人推送（最稳定，无封禁风险）
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SITE = process.env.SITE_URL || 'https://example.github.io/my-ai-daily-digest';

const today = new Date().toISOString().slice(0, 10);
const mdPath = resolve(ROOT, 'output', today, 'digest.md');
if (!existsSync(mdPath)) {
  console.log(`[wecom] 没有 ${today} 的简报，跳过`);
  process.exit(0);
}

const webhook = process.env.WECOM_WEBHOOK;
if (!webhook) {
  console.log('[wecom] 未配置 WECOM_WEBHOOK，跳过');
  process.exit(0);
}

const md = readFileSync(mdPath, 'utf-8');

const summaryMatch = md.match(/##\s*今日要点[：:]?\s*\n+([\s\S]+?)(?=\n##|\n#|$)/);
const summary = summaryMatch ? summaryMatch[1].trim() : md.split('\n').slice(0, 5).join('\n');

const text = `# 🎧 AI 简报 ${today}

> ${summary.split('\n').join('\n> ')}

[🔊 通勤路上听 (mp3)](${SITE}/output/${today}/digest.mp3)

[📄 查看完整文字版](${SITE}/output/${today}/digest.md)`;

try {
  const res = await axios.post(webhook, {
    msgtype: 'markdown',
    markdown: { content: text.slice(0, 4000) },
  });
  console.log('[wecom] 推送结果：', res.data?.errcode, res.data?.errmsg);
} catch (err) {
  console.error('[wecom] 推送失败：', err.response?.data || err.message);
  process.exit(0);
}
