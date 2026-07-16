import { useState } from 'react';
import { GameDialog } from '../components/GameDialog';
import { GameIcon } from '../components/GameIcon';
import { WorldCanvas } from '../components/WorldCanvas';
import { assetUrl } from '../game/assetUrl';
import { shopItems } from '../game/catalog';
import type { RewardPayload, ShopItem } from '../game/types';
import { useGame } from '../state/GameContext';

export function ShopScreen({ onReward }: { onReward: (payload: RewardPayload) => void }) {
  const { state, purchase } = useGame();
  const [notice, setNotice] = useState<string | null>(null);

  const buy = (item: ShopItem) => {
    const result = purchase(item.id);
    if (result === 'purchased') {
      onReward({ title: '带回宝贝柜啦', message: `${item.name}已经放进糖糖的${item.kind === 'outfit' ? '衣帽间' : '收藏室'}。`, pose: 'wink' });
      return;
    }
    if (result === 'owned') setNotice(`${item.name}已经在宝贝柜里啦。`);
    if (result === 'locked') setNotice(item.lockedAtHearts ? `亲密值达到 ${item.lockedAtHearts} 后，金牛守护会为你亮起。` : '这件宝贝还在准备中。');
    if (result === 'insufficient') setNotice('星星币还差一点点，陪糖糖完成任务就能收集更多。');
  };

  return (
    <section className="scene-screen shop-screen" aria-label="糖糖的星星小铺">
      <WorldCanvas background="assets/scenes/shop-world.svg" mood="shop" />
      <div className="scene-title-plaque shop-title">
        <GameIcon name="sparkle" />
        <div><b>糖糖的小铺</b><small>点一点击中喜欢的宝贝</small></div>
      </div>
      <div className="shopkeeper-teddy" aria-hidden="true">
        <img src={assetUrl('assets/teddy/teddy-wink.png')} alt="" />
      </div>
      <div className="shop-props" aria-label="小铺商品">
        {shopItems.map((item) => {
          const owned = state.inventory.includes(item.id);
          const locked = Boolean(item.lockedAtHearts && state.hearts < item.lockedAtHearts);
          return (
            <button
              className={`shop-prop ${owned ? 'owned' : ''} ${locked ? 'locked' : ''}`}
              style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.width}%` }}
              onClick={() => buy(item)}
              key={item.id}
              aria-label={`${item.name}，${locked ? '未解锁' : owned ? '已拥有' : `${item.price}星星币`}`}
            >
              <img src={assetUrl(item.asset)} alt="" />
              <span className="wood-price-tag">
                <b>{item.name}</b>
                <small>{locked ? <><GameIcon name="lock" />{item.lockedAtHearts}</> : owned ? '已拥有' : <><GameIcon name="coin" />{item.price}</>}</small>
              </span>
            </button>
          );
        })}
      </div>
      <div className="shop-counter-hint"><GameIcon name="coin" /><span>购买后自动送进宝贝柜</span></div>
      {notice ? (
        <GameDialog title="糖糖悄悄说" onClose={() => setNotice(null)}>
          <div className="notice-teddy"><img src={assetUrl('assets/teddy/teddy-wink.png')} alt="眨眼的糖糖" /></div>
          <p className="notice-copy">{notice}</p>
          <button className="candy-button primary" onClick={() => setNotice(null)}>知道啦</button>
        </GameDialog>
      ) : null}
    </section>
  );
}
