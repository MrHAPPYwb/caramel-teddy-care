export type ScreenId = 'home' | 'shop' | 'collection';

export type TeddySkin = 'default' | 'princess' | 'guardian';

export type ItemKind = 'food' | 'outfit' | 'care' | 'toy' | 'keepsake';

export interface ShopItem {
  id: string;
  name: string;
  kind: ItemKind;
  price: number;
  asset: string;
  x: number;
  y: number;
  width: number;
  target: 'fridge' | 'wardrobe' | 'toy-shelf' | 'cabinet';
  skin?: TeddySkin;
  lockedAtHearts?: number;
}

export interface GameState {
  saveVersion: 2;
  name: string;
  level: number;
  hearts: number;
  coins: number;
  happiness: number;
  inventory: string[];
  equippedSkin: TeddySkin;
  lastCheckIn: string | null;
  visited: Record<ScreenId, boolean>;
  soundEnabled: boolean;
}

export interface RewardPayload {
  title: string;
  message: string;
  coins?: number;
  hearts?: number;
  pose?: 'wink' | 'happy';
}
