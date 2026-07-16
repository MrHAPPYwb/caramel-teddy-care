import { useMemo, useState } from 'react';
import { GameIcon } from '../components/GameIcon';
import { WorldCanvas } from '../components/WorldCanvas';
import { assetUrl } from '../game/assetUrl';
import { furnitureLabels, shopItems } from '../game/catalog';
import type { RewardPayload, TeddySkin } from '../game/types';
import { useGame } from '../state/GameContext';

type ZoneId = keyof typeof furnitureLabels;

const furniture = [
  { id: 'fridge' as const, asset: 'assets/props/furniture-fridge.svg', x: 2, y: 38, width: 22 },
  { id: 'wardrobe' as const, asset: 'assets/props/furniture-wardrobe.svg', x: 20, y: 31, width: 29 },
  { id: 'toy-shelf' as const, asset: 'assets/props/furniture-toy-shelf.svg', x: 66, y: 37, width: 22 },
  { id: 'cabinet' as const, asset: 'assets/props/furniture-cabinet.svg', x: 84, y: 38, width: 19 },
];

export function CollectionScreen({ onReward }: { onReward: (payload: RewardPayload) => void }) {
  const { state, equip } = useGame();
  const [zone, setZone] = useState<ZoneId | null>(null);

  const zoneItems = useMemo(() => zone ? shopItems.filter((item) => item.target === zone) : [], [zone]);
  const teddyFile = `teddy-${state.equippedSkin}.png`;

  const useItem = (itemId: string, skin?: TeddySkin) => {
    const item = shopItems.find((entry) => entry.id === itemId);
    if (!item) return;
    if (item.lockedAtHearts && state.hearts < item.lockedAtHearts) {
      onReward({ title: '星愿还在长大', message: `亲密值达到 ${item.lockedAtHearts} 后就能解锁金牛守护。`, pose: 'happy' });
      return;
    }
    if (!state.inventory.includes(item.id)) {
      onReward({ title: '小铺里等着你', message: `先去星星小铺把${item.name}带回家吧。`, pose: 'wink' });
      return;
    }
    if (skin) {
      const result = equip(skin);
      if (result === 'equipped') onReward({ title: '换装完成', message: `糖糖穿上${item.name}，在镜子前转了一圈！`, pose: 'happy' });
      return;
    }
    onReward({ title: '找到宝贝啦', message: `糖糖很喜欢${item.name}，等照顾玩法开放就能使用。`, pose: 'wink' });
  };

  return (
    <section className="scene-screen collection-screen" aria-label="糖糖的宝贝柜">
      <WorldCanvas background="assets/scenes/collection-world.svg" mood="night" />
      <div className="scene-title-plaque collection-title">
        <GameIcon name="collection" />
        <div><b>{zone ? furnitureLabels[zone] : '糖糖的宝贝柜'}</b><small>{zone ? '点真实物品使用或换装' : '点家具，看看里面藏着什么'}</small></div>
      </div>
      <div className={`collection-room ${zone ? `focus-${zone}` : ''}`}>
        {furniture.map((entry) => (
          <button
            className={`furniture-piece ${zone === entry.id ? 'active' : ''}`}
            style={{ left: `${entry.x}%`, top: `${entry.y}%`, width: `${entry.width}%` }}
            onClick={() => setZone(zone === entry.id ? null : entry.id)}
            key={entry.id}
          >
            <img src={assetUrl(entry.asset)} alt="" />
            <span>{furnitureLabels[entry.id]}</span>
          </button>
        ))}
        <div className="collection-teddy">
          <span className="mirror-glow" aria-hidden="true" />
          <img src={assetUrl(`assets/teddy/${teddyFile}`)} alt={`穿着${state.equippedSkin === 'default' ? '星愿项圈' : state.equippedSkin === 'princess' ? '公主裙' : '金牛守护装'}的糖糖`} />
        </div>
      </div>

      {zone ? (
        <div className="collection-shelf-tray">
          <button className="tray-back" onClick={() => setZone(null)} aria-label="返回收藏室"><GameIcon name="back" /></button>
          <div className="shelf-items">
            {zoneItems.map((item) => {
              const owned = state.inventory.includes(item.id);
              const locked = Boolean(item.lockedAtHearts && state.hearts < item.lockedAtHearts);
              const equipped = item.skin === state.equippedSkin;
              return (
                <button className={`${owned ? 'owned' : 'missing'} ${equipped ? 'equipped' : ''}`} onClick={() => useItem(item.id, item.skin)} key={item.id}>
                  <img src={assetUrl(item.asset)} alt="" />
                  <span>{item.name}</span>
                  <small>{locked ? <><GameIcon name="lock" />{item.lockedAtHearts}</> : equipped ? '穿着中' : owned ? '点我使用' : '去小铺寻找'}</small>
                </button>
              );
            })}
            {zoneItems.length === 0 ? <p>这里正等着第一件纪念品。</p> : null}
          </div>
        </div>
      ) : (
        <div className="collection-room-hint"><GameIcon name="sparkle" /> 星星会记住你和糖糖的每次成长</div>
      )}
    </section>
  );
}
