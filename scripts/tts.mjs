// Edge TTS 把今日简报转成 mp3（中文，免费）
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const today = new Date().toISOString().slice(0, 10);
const mdPath = resolve(ROOT, 'output', today, 'digest.md');
const mp3Path = resolve(ROOT, 'output', today, 'digest.mp3');

if (!existsSync(mdPath)) {
  console.error(`[tts] 未找到 ${mdPath}`);
  process.exit(1);
}

const md = readFileSync(mdPath, 'utf-8');

// 朗读专用：去掉 markdown 标记、URL、emoji，让 TTS 顺畅
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

console.log(`[tts] 朗读文本字数：${speechText.length}`);

const tts = new MsEdgeTTS();
await tts.setMetadata('zh-CN-XiaoxiaoNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

const { audioStream } = await tts.toStream(speechText);
const chunks = [];
audioStream.on('data', (chunk) => chunks.push(chunk));
await new Promise((res, rej) => {
  audioStream.on('end', res);
  audioStream.on('error', rej);
});
writeFileSync(mp3Path, Buffer.concat(chunks));
console.log(`[tts] 音频已生成 → ${mp3Path} (${(Buffer.concat(chunks).length / 1024 / 1024).toFixed(2)} MB)`);
