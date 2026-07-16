import type { ShopItem } from './types';

export const shopItems: ShopItem[] = [
  { id: 'star-pancake', name: '星星松饼', kind: 'food', price: 10, asset: 'assets/props/star-pancake.svg', x: 9, y: 43, width: 17, target: 'fridge' },
  { id: 'strawberry-milk', name: '草莓牛奶', kind: 'food', price: 20, asset: 'assets/props/strawberry-milk.svg', x: 29, y: 43, width: 15, target: 'fridge' },
  { id: 'berry-tart', name: '莓莓挞', kind: 'food', price: 20, asset: 'assets/props/berry-tart.svg', x: 47, y: 44, width: 16, target: 'fridge' },
  { id: 'basic-collar', name: '星愿项圈', kind: 'outfit', price: 0, asset: 'assets/props/basic-collar.svg', x: 71, y: 37, width: 15, target: 'wardrobe', skin: 'default' },
  { id: 'pink-princess-dress', name: '公主裙', kind: 'outfit', price: 60, asset: 'assets/props/pink-princess-dress.svg', x: 83, y: 44, width: 18, target: 'wardrobe', skin: 'princess' },
  { id: 'caramel-shampoo', name: '焦糖香波', kind: 'care', price: 20, asset: 'assets/props/caramel-shampoo.svg', x: 12, y: 64, width: 14, target: 'cabinet' },
  { id: 'star-bubble-bath', name: '星星泡泡', kind: 'care', price: 30, asset: 'assets/props/star-bubble-bath.svg', x: 30, y: 64, width: 15, target: 'cabinet' },
  { id: 'star-ball', name: '星星球', kind: 'toy', price: 30, asset: 'assets/props/star-ball.svg', x: 66, y: 65, width: 16, target: 'toy-shelf' },
  { id: 'moon-pillow', name: '月亮抱枕', kind: 'toy', price: 30, asset: 'assets/props/moon-pillow.svg', x: 83, y: 64, width: 18, target: 'toy-shelf' },
  { id: 'taurus-cape', name: '金牛守护', kind: 'outfit', price: 120, asset: 'assets/props/taurus-cape.svg', x: 48, y: 66, width: 16, target: 'wardrobe', skin: 'guardian', lockedAtHearts: 180 },
];

export const furnitureLabels = {
  fridge: '甜点小冰箱',
  wardrobe: '星座衣帽间',
  'toy-shelf': '玩具星架',
  cabinet: '星愿展示柜',
} as const;
