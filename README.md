# Caramel Teddy Care（糖糖成长日记）

面向 7 岁女孩的宠物养成与隐性学习手游。当前商业化重构阶段只开放三页：

- 小屋：摸摸糖糖、签到、任务、三语信箱
- 星星小铺：在真实店铺空间里直接点击商品购买
- 宝贝柜：点击冰箱、衣帽间、玩具架和展示柜查看收藏并换装

## 技术

- React 19 + TypeScript + Vite
- PixiJS 场景底图与环境星光
- DOM HUD、文字与无障碍点击热区
- `localStorage` 版本化存档
- 本地狗叫和离线语音资源

## 本地运行

```bash
npm install
npm run dev
```

开发地址：`http://127.0.0.1:5173/caramel-teddy-care/`

## 验证

```bash
npm test
npm run build
```

美术资产合同见 [`docs/ASSET_MANIFEST_PHASE2.md`](docs/ASSET_MANIFEST_PHASE2.md)。旧版单文件页面保存在 `legacy/index.v28.html`，仅用于追溯，不参与构建。
