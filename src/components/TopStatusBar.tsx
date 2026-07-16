import { assetUrl } from '../game/assetUrl';
import { useGame } from '../state/GameContext';
import { GameIcon } from './GameIcon';

export function TopStatusBar({ onSettings }: { onSettings: () => void }) {
  const { state } = useGame();
  return (
    <header className="status-bar">
      <div className="profile-cluster">
        <span className="avatar-frame">
          <img src={assetUrl('assets/teddy/teddy-default.png')} alt="糖糖头像" />
        </span>
        <span className="profile-copy">
          <b>{state.name}</b>
          <small>Lv.{state.level}</small>
        </span>
      </div>
      <div className="status-pills">
        <span className="status-pill heart-pill" aria-label={`爱心 ${state.hearts}`}>
          <GameIcon name="heart" /> <b>{state.hearts}</b>
        </span>
        <span className="status-pill coin-pill" aria-label={`星星币 ${state.coins}`}>
          <GameIcon name="coin" /> <b>{state.coins}</b>
        </span>
        <button className="round-icon-button settings-button" onClick={onSettings} aria-label="设置">
          <GameIcon name="settings" />
        </button>
      </div>
    </header>
  );
}
