// 通过 WxPusher 发微信消息（支持 SPT 极简模式 / AppToken+UID 标准模式）
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
  console.log(`[notify] 没有 ${today} 的简报，跳过`);
  process.exit(0);
}

const md = readFileSync(mdPath, 'utf-8');
const summary = md.split('\n').slice(0, 80).join('\n');

const content = `🎧 [点击在小宇宙听今日 AI 简报](${SITE}/output/${today}/digest.mp3)

${summary}

---
📄 [完整文字版](${SITE}/output/${today}/)`;

const spt = process.env.WXPUSHER_SPT;
const appToken = process.env.WXPUSHER_APP_TOKEN;
const uid = process.env.WXPUSHER_UID;

try {
  let res;
  if (spt) {
    res = await axios.post('https://wxpusher.zjiecode.com/api/send/message/simple-push', {
      content,
      summary: `AI 简报 ${today}`,
      contentType: 3,
      spt,
    });
    console.log('[notify] WxPusher (SPT) 推送结果：', res.data?.code, res.data?.msg);
  } else if (appToken && uid) {
    res = await axios.post('https://wxpusher.zjiecode.com/api/send/message', {
      appToken,
      content,
      contentType: 3,
      summary: `AI 简报 ${today}`,
      uids: [uid],
    });
    console.log('[notify] WxPusher (App) 推送结果：', res.data?.code, res.data?.msg);
  } else {
    console.log('[notify] 未配置 WXPUSHER_SPT 或 WXPUSHER_APP_TOKEN+WXPUSHER_UID，跳过');
    process.exit(0);
  }
} catch (err) {
  console.error('[notify] 推送失败：', err.response?.data || err.message);
  process.exit(0);
}
