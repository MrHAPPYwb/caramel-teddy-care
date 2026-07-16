# 《Caramel Teddy Care》阶段 2 美术资产清单

状态：阶段 1 已确认；本清单是三页开发的唯一资产合同。

## 1. 资产原则

- 游戏由独立角色、场景、道具、UI 和特效资产组合，不使用整页游戏截图。
- 糖糖只允许使用同一套金牛座焦糖泰迪资产；旧版无牛角、无金牛项圈的狗狗全部停用。
- 场景背景不得包含可点击商品、按钮、价格或文字；交互物必须是独立资产并绑定自己的热区。
- UI 不使用 emoji、系统图标或临时 CSS 图形。简单标识使用同一套 SVG，角色和场景使用透明 PNG/WebP。
- 编辑源文件与运行时文件分离；运行时只加载压缩导出物。

## 2. 目录合同

```text
art-source/
  reference/               # 已确认设定图，只作身份与风格基准
  teddy-master/            # 糖糖主母版及动作源文件
  scenes/                  # 无 UI 的场景母版
  ui/                      # 九宫格面板、按钮、导航源文件
  props/                   # 商品、家具、收藏品源文件

public/assets/
  teddy/                    # 透明角色与服装层
  scenes/                   # 场景背景和前景遮挡层
  props/                    # 可点击商品、家具、收藏品
  ui/                       # SVG 图标及九宫格材质
  fx/                       # 星光、金币、粒子
  audio/                    # 本地音频
  manifests/                # 资产、场景、热区、商品清单
```

## 3. 糖糖角色资产库

### 3.1 三页首发锁定资产

| ID | 文件 | 用途 | 状态 |
|---|---|---|---|
| teddy.default | `assets/teddy/teddy-default.png` | 小屋默认、头像来源 | 已有透明母图，锁定 |
| teddy.wink | `assets/teddy/teddy-wink.png` | 签到、任务、购买成功 | 已有透明母图，锁定 |
| teddy.happy | `assets/teddy/teddy-happy.png` | 点击互动、快乐提升 | 已有透明母图，锁定 |
| teddy.sleep | `assets/teddy/teddy-sleep.png` | 收藏室月亮角落、后续故事 | 已有透明母图，锁定 |
| teddy.princess | `assets/teddy/teddy-princess.png` | 衣帽间高级皮肤 | 已有透明母图，锁定 |
| teddy.guardian | `assets/teddy/teddy-guardian.png` | 未解锁展示、成长剧情 | 已有透明母图，锁定 |
| teddy.avatar | `assets/teddy/teddy-avatar.webp` | 顶部状态栏 | 从 default 统一裁切 |

共同锚点：`bottom-center (0.5, 1.0)`。角色点击热区使用轮廓多边形，不使用矩形偏移热区。

### 3.2 后续扩展动作

以下资产必须从同一主母版整组制作，不能逐张另画：

- `teddy-stand`, `teddy-sit`, `teddy-pet-me`
- `teddy-eat`, `teddy-bath`, `teddy-dress`, `teddy-ball`
- `teddy-read`, `teddy-success`, `teddy-encourage`
- 动画条：`idle-breathe` 6 帧、`blink` 4 帧、`happy-hop` 8 帧、`reward-wink` 6 帧

身份不变量：焦糖卷毛、小型泰迪犬、大棕眼、奶油口鼻、粉色腮红、金色牛角、星星发饰、金牛项圈、圆润短腿；不得变成女孩、熊、emoji 或另一只狗。

## 4. 三个场景资产

### 4.1 小屋 `home`

保留已确认构图和暖粉世界观，仅拆分成可维护层：

- `home-bg.webp`：墙面、窗户、阳光和远景
- `home-mid.webp`：沙发、地毯、玩具、床边陈设
- `home-fg.webp`：前景柔光与局部遮挡
- `home-shadow.webp`：糖糖脚下接触阴影
- `home-hotspots.json`：糖糖、签到、任务、信箱热区

糖糖位于视觉中心；右侧只保留签到、任务、信箱。房间内不出现小铺入口。

### 4.2 星星小铺 `shop`

一个连续的真实店铺空间，不做商城列表：

- `shop-bg.webp`：暖色木墙、窗光、地板、天花灯
- `shop-counter.webp`：柜台与收银托盘
- `shop-shelf-food.webp`：食品货架
- `shop-rack-clothes.webp`：衣架与试衣镜
- `shop-shelf-care.webp`：洗护瓶架
- `shop-fg.webp`：前景木箱、植物、灯光遮挡
- `shop-hotspots.json`：每件商品真实轮廓热区

首发商品独立资产：

- 食物：`star-pancake`, `strawberry-milk`, `berry-tart`, `puppy-cookie`
- 服装：`basic-collar`, `pink-princess-dress`, `taurus-cape`
- 洗护：`caramel-shampoo`, `star-bubble-bath`
- 玩具：`star-ball`, `moon-pillow`
- 环境价格牌：`price-tag-10`, `price-tag-20`, `price-tag-30`, `price-tag-60`, `price-tag-120`

商品图必须带接触阴影并与盘子、衣架或瓶架发生空间关系；禁止漂浮 PNG。购买后写入宝贝柜。

### 4.3 宝贝柜 `collection`

糖糖私人收藏室，不做九宫格：

- `collection-bg.webp`：奶油收藏室、窗光、木地板
- `collection-fridge.webp`：食物小冰箱
- `collection-wardrobe.webp`：星座衣帽间
- `collection-toy-shelf.webp`：玩具架
- `collection-cabinet.webp`：纪念品展示柜
- `collection-rug.webp`：中央星星地毯
- `collection-fg.webp`：灯串、窗帘前景
- `collection-hotspots.json`：四件家具与内部物品热区

交互层级：收藏室总览 → 点击家具拉近 → 点击真实物品使用。服装点击后在镜前将糖糖切换到对应皮肤。

## 5. UI 资产系统

### 5.1 顶部状态栏

- `hud-profile-frame.svg`
- `hud-heart.svg`, `hud-coin.svg`, `hud-level-star.svg`, `hud-settings.svg`
- `hud-pill-cream.9.png`, `hud-pill-pink.9.png`, `hud-pill-gold.9.png`

固定信息：头像、糖糖、等级、爱心、星星币、设置。HUD 总高度不超过可用视口的 10%。

### 5.2 底部导航

- `nav-house.svg`, `nav-shop.svg`, `nav-collection.svg`
- `nav-tray.9.png`, `nav-active-glow.webp`

只允许三个入口：小屋、星星小铺、宝贝柜。报告进入设置。

### 5.3 通用组件

- `button-caramel.9.png`, `button-pink.9.png`, `button-cream.9.png`
- `panel-cream.9.png`, `panel-pink.9.png`, `dialog-reward.9.png`
- `label-wood.9.png`, `label-cream.9.png`
- `close.svg`, `back.svg`, `lock.svg`, `check.svg`, `sound.svg`
- `speech-bubble.9.png`, `toast.9.png`

所有组件共用圆角、奶油高光、焦糖描边和暖棕阴影；文本由 DOM 渲染，保证中文可读与无损缩放。

## 6. 动效与特效

- `fx-star-01..06.webp`：星星闪光序列
- `fx-coin.webp`：星星币粒子
- `fx-heart.webp`：亲密值粒子
- `fx-reward-rays.webp`：奖励弹窗柔光
- `fx-tap-ring.webp`：点击反馈

动作规范：呼吸 2.8 秒循环；眨眼 3–6 秒随机；跳跳 520 毫秒；弹窗弹出 360 毫秒；场景淡入 240 毫秒；按钮按下缩放至 0.94；星星币沿曲线飞向顶部币槽。支持 `prefers-reduced-motion`。

## 7. 音频

沿用现有本地狗叫与中英文离线语音，不再调用设备 TTS：

- 狗狗：`dog-happy`, `dog-alert`, `dog-hungry`, `dog-sleepy`
- UI：`ui-tap`, `ui-open`, `ui-close`, `ui-coin`, `ui-reward`, `ui-equip`
- 环境：`room-day`, `shop-warm`, `collection-night`

真实狗叫、糖糖角色声、普通话女声、美式英语女声必须分轨管理。

## 8. 运行时清单与热区

- `asset-manifest.json`：ID、URL、尺寸、锚点、预加载组
- `scene-layouts.json`：基于 390×844 的归一化坐标与层级
- `shop-catalog.json`：商品 ID、价格、库存、目标家具、解锁条件
- `inventory.json`：物品类型、可使用场景、皮肤映射

所有点击坐标按场景归一化，视觉层和热区层使用同一 transform；点击目标最小 44×44 CSS px。

## 9. 导出与性能标准

- 场景母版：1170×2532；运行时 WebP，不拉伸，只允许 `cover` 裁切。
- 角色母版：最长边至少 1200 px；运行时透明 PNG/WebP，保留 12% 安全边距。
- SVG：统一 `viewBox`，禁用外链字体与滤镜引用。
- 初始小屋视觉资源目标 ≤ 2.5 MB；每个延迟加载场景 ≤ 1.8 MB；三页视觉总量目标 ≤ 7 MB（音频另计）。
- 每张图片必须记录源文件、导出尺寸、版权来源和版本号。

## 10. 三页验收门槛

- 任一截图第一眼都必须是游戏场景，而不是卡片列表或网页仪表盘。
- 三页使用同一个糖糖、同一光照方向、同一材质系统和同一 HUD。
- 商品与家具必须落在环境中，点击物本身命中，不允许右侧偏移。
- 390×844、375×812、393×852、430×932 全屏无滚动、无空白、无遮挡。
- 页面切换、购买、换装、点击糖糖和奖励动画均有明确反馈。
