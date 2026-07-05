const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const manifestPath = path.join(root, 'assets', 'audio', 'voice-manifest.js');
const html = fs.readFileSync(htmlPath, 'utf8');

function readManifest() {
  assert.ok(fs.existsSync(manifestPath), '缺少离线语音清单 assets/audio/voice-manifest.js');
  const source = fs.readFileSync(manifestPath, 'utf8');
  const match = source.match(/^window\.TEDDY_AUDIO_MANIFEST\s*=\s*([\s\S]+);\s*$/);
  assert.ok(match, '离线语音清单格式不正确');
  return JSON.parse(match[1]);
}

function assertAudioFile(relativeUrl) {
  const cleanPath = relativeUrl.replace(/^\.\//, '');
  const absolutePath = path.join(root, ...cleanPath.split('/'));
  assert.ok(fs.existsSync(absolutePath), `音频文件不存在：${relativeUrl}`);
  const data = fs.readFileSync(absolutePath);
  assert.ok(data.length > 1000, `音频文件异常或为空：${relativeUrl}`);
  const looksLikeMp3 =
    data.subarray(0, 3).toString('ascii') === 'ID3' ||
    (data[0] === 0xff && (data[1] & 0xe0) === 0xe0);
  assert.ok(looksLikeMp3, `音频不是可识别的 MP3：${relativeUrl}`);
}

test('运行时完全脱离设备 speechSynthesis，并加载项目内离线语音', () => {
  assert.doesNotMatch(html, /SpeechSynthesisUtterance/);
  assert.doesNotMatch(html, /speechSynthesis\.speak/);
  assert.doesNotMatch(html, /speechSynthesis\.getVoices/);
  assert.match(html, /assets\/audio\/voice-manifest\.js/);
  assert.match(html, /TEDDY_AUDIO_MANIFEST/);
});

test('真人狗叫按情绪状态路由，不再使用振荡器合成', () => {
  assert.doesNotMatch(html, /createOscillator/);
  assert.match(html, /function\s+playDogSound\s*\(/);
  assert.match(html, /AUDIO_MANIFEST\.dog/);
  assert.match(html, /dogSoundForCurrentMood/);

  const manifest = readManifest();
  for (const state of ['happy', 'hungry', 'sleepy', 'alert']) {
    assert.ok(Array.isArray(manifest.dog[state]) && manifest.dog[state].length > 0, `缺少 ${state} 狗叫`);
    manifest.dog[state].forEach(assertAudioFile);
  }
});

test('宠物台词、普通话朗读和美式英语分别使用独立离线女声', () => {
  const manifest = readManifest();
  assert.equal(manifest.voices.petZh, 'zh-CN-XiaoyiNeural');
  assert.equal(manifest.voices.narratorZh, 'zh-CN-XiaoxiaoNeural');
  assert.equal(manifest.voices.narratorEn, 'en-US-JennyNeural');

  const required = [
    'pet|zh-CN|我有点饿了，想吃一点小点心。',
    'pet|zh-CN|你摸摸我，我好开心呀。',
    'narrator|zh-CN|我们一起数一数，看哪个图案最合适。',
    'narrator|en-US|Listen. ball. b, ball. Choose ball.'
  ];
  for (const key of required) {
    assert.ok(manifest.clips[key], `清单缺少语音：${key}`);
    assertAudioFile(manifest.clips[key]);
  }
});

test('离线清单中的全部语音文件均完整可读取', () => {
  const manifest = readManifest();
  const clips = Object.values(manifest.clips);
  assert.ok(clips.length >= 350, `离线语音覆盖不足：仅 ${clips.length} 条`);
  for (const url of clips) assertAudioFile(url);
  for (const url of Object.values(manifest.fallback)) assertAudioFile(url);
});

test('iPhone 弹窗使用动态视口、安全区、内部滚动和页面滚动锁', () => {
  assert.match(html, /--visual-viewport-height/);
  assert.match(html, /100dvh/);
  assert.match(html, /body\.modal-open/);
  assert.match(html, /overscroll-behavior:\s*contain/);
  assert.match(html, /-webkit-overflow-scrolling:\s*touch/);
  assert.match(html, /window\.visualViewport/);
  assert.match(html, /document\.body\.classList\.add\(['"]modal-open['"]\)/);
  assert.match(html, /document\.body\.classList\.remove\(['"]modal-open['"]\)/);
});

test('矮屏 iPhone 的任务卡片保持紧凑双列并保留底部操作空间', () => {
  assert.match(html, /@media\s*\(max-height:\s*700px\)/);
  assert.match(html, /\.task-card-modal\s+\.choice-grid[\s\S]*grid-template-columns:\s*repeat\(2,\s*1fr\)/);
  assert.match(html, /scrollIntoView|scrollTop\s*=\s*0/);
});
