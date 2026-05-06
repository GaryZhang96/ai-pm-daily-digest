// Edge TTS 把今日简报转成 mp3（中文，免费）
// 先用 Node 预处理 markdown -> 朗读文本，再调 Python 的 edge-tts CLI 合成音频
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const today = new Date().toISOString().slice(0, 10);
const mdPath = resolve(ROOT, 'output', today, 'digest.md');
const txtPath = resolve(ROOT, 'output', today, 'digest.txt');
const mp3Path = resolve(ROOT, 'output', today, 'digest.mp3');

if (!existsSync(mdPath)) {
  console.error(`[tts] 未找到 ${mdPath}`);
  process.exit(1);
}

const md = readFileSync(mdPath, 'utf-8');

function mdToSpeechText(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_`#>]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const speechText = mdToSpeechText(md);
writeFileSync(txtPath, speechText, 'utf-8');
console.log(`[tts] 朗读文本字数：${speechText.length}，已写入 ${txtPath}`);

if (!speechText || speechText.length < 50) {
  console.log('[tts] 朗读文本过短，跳过 TTS');
  process.exit(0);
}

const voice = process.env.TTS_VOICE || 'zh-CN-YunyangNeural';
const rate = process.env.TTS_RATE || '+0%';

console.log(`[tts] 调用 edge-tts CLI (voice=${voice}, rate=${rate})...`);
const result = spawnSync(
  'edge-tts',
  ['--voice', voice, '--rate', rate, '--file', txtPath, '--write-media', mp3Path],
  { stdio: 'inherit', shell: true },
);

if (result.status !== 0) {
  console.error(`[tts] edge-tts 退出码 ${result.status}`);
  process.exit(result.status ?? 1);
}

if (!existsSync(mp3Path)) {
  console.error('[tts] 未生成 mp3 文件');
  process.exit(1);
}

const sizeMb = (statSync(mp3Path).size / 1024 / 1024).toFixed(2);
console.log(`[tts] 音频已生成 → ${mp3Path} (${sizeMb} MB)`);
