import { assetUrl } from '../game/assetUrl';
import type { RewardPayload } from '../game/types';
import { GameIcon } from './GameIcon';

export function RewardDialog({ reward, onClose }: { reward: RewardPayload; onClose: () => void }) {
  return (
    <div className="dialog-backdrop reward-backdrop" role="presentation">
      <section className="reward-dialog" role="dialog" aria-modal="true" aria-label={reward.title}>
        <div className="reward-rays" aria-hidden="true" />
        <div className="reward-sparkles" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => <GameIcon name="sparkle" key={index} />)}
        </div>
        <img
          className="reward-teddy"
          src={assetUrl(`assets/teddy/teddy-${reward.pose ?? 'wink'}.png`)}
          alt="开心的糖糖"
        />
        <h2>{reward.title}</h2>
        <p>{reward.message}</p>
        <div className="reward-values">
          {reward.coins ? <span><GameIcon name="coin" />+{reward.coins}</span> : null}
          {reward.hearts ? <span><GameIcon name="heart" />+{reward.hearts}</span> : null}
        </div>
        <button className="candy-button primary" onClick={onClose}>开心收下</button>
        {reward.coins ? <div className="coin-flight" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i}/>)}</div> : null}
      </section>
    </div>
  );
}
