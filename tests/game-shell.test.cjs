const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));

test('三页 React 游戏结构与主导航固定为小屋、小铺、宝贝柜', () => {
  const app = read('src/App.tsx');
  const nav = read('src/components/BottomNav.tsx');
  assert.match(app, /HomeScreen/);
  assert.match(app, /ShopScreen/);
  assert.match(app, /CollectionScreen/);
  assert.match(nav, /label: '小屋'/);
  assert.match(nav, /label: '星星小铺'/);
  assert.match(nav, /label: '宝贝柜'/);
  assert.doesNotMatch(nav, /报告/);
});

test('糖糖六种锁定形象均为独立透明素材，不再使用 CSS 小狗', () => {
  const names = ['default', 'wink', 'happy', 'sleep', 'princess', 'guardian'];
  for (const name of names) {
    const file = path.join(root, 'public', 'assets', 'teddy', `teddy-${name}.png`);
    assert.ok(fs.existsSync(file), `缺少 teddy-${name}.png`);
    const bytes = fs.readFileSync(file);
    assert.ok(bytes.length > 150_000, `teddy-${name}.png 不是正式角色素材`);
    assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG');
  }
  const css = read('src/styles/game.css');
  assert.doesNotMatch(css, /\.dog-head|\.dog-ear|\.dog-body/);
});

test('小铺商品和宝贝柜家具为独立场景资产', () => {
  const catalog = read('src/game/catalog.ts');
  const products = ['star-pancake', 'strawberry-milk', 'berry-tart', 'basic-collar', 'pink-princess-dress', 'caramel-shampoo', 'star-bubble-bath', 'star-ball', 'moon-pillow', 'taurus-cape'];
  for (const id of products) {
    assert.match(catalog, new RegExp(`id: '${id}'`));
    assert.ok(exists(`public/assets/props/${id}.svg`), `缺少商品 ${id}.svg`);
  }
  for (const furniture of ['fridge', 'wardrobe', 'toy-shelf', 'cabinet']) {
    assert.ok(exists(`public/assets/props/furniture-${furniture}.svg`), `缺少家具 ${furniture}.svg`);
  }
});

test('iPhone 全屏规则、动态视口和安全区已固化', () => {
  const css = read('src/styles/game.css');
  const html = read('index.html');
  assert.match(css, /width:\s*100vw/);
  assert.match(css, /height:\s*100dvh/);
  assert.match(css, /overflow:\s*hidden/);
  assert.match(css, /safe-area-inset-top/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /apple-mobile-web-app-capable/);
});

test('状态使用版本化 localStorage，设备 TTS 与 emoji UI 均未回流', () => {
  const state = read('src/state/GameContext.tsx');
  const src = [
    read('src/App.tsx'),
    read('src/screens/HomeScreen.tsx'),
    read('src/screens/ShopScreen.tsx'),
    read('src/screens/CollectionScreen.tsx'),
  ].join('\n');
  assert.match(state, /caramel-teddy-care:save-v2/);
  assert.match(state, /saveVersion:\s*2/);
  assert.doesNotMatch(src, /speechSynthesis|SpeechSynthesisUtterance|createOscillator/);
  assert.doesNotMatch(src, /[\u{1F300}-\u{1FAFF}]/u);
});

test('真实狗叫保留为本地资源并由游戏事件调用', () => {
  const home = read('src/screens/HomeScreen.tsx');
  for (const mood of ['happy', 'alert', 'hungry', 'sleepy']) {
    const file = path.join(root, 'public', 'assets', 'audio', 'dog', `dog-${mood}.mp3`);
    assert.ok(fs.existsSync(file), `缺少 dog-${mood}.mp3`);
    assert.ok(fs.statSync(file).size > 5_000);
  }
  assert.match(home, /dog-happy\.mp3/);
});
