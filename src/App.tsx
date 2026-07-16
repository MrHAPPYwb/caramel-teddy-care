import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { GameDialog } from './components/GameDialog';
import { GameIcon } from './components/GameIcon';
import { RewardDialog } from './components/RewardDialog';
import { TopStatusBar } from './components/TopStatusBar';
import type { RewardPayload, ScreenId } from './game/types';
import { CollectionScreen } from './screens/CollectionScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ShopScreen } from './screens/ShopScreen';
import { useGame } from './state/GameContext';

export function App() {
  const { state, visit, toggleSound } = useGame();
  const [screen, setScreen] = useState<ScreenId>('home');
  const [reward, setReward] = useState<RewardPayload | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    visit(screen);
  }, [screen, visit]);

  const changeScreen = (next: ScreenId) => {
    setScreen(next);
  };

  return (
    <div className="game-app">
      <div className="game-shell">
        <TopStatusBar onSettings={() => setSettingsOpen(true)} />
        <main className="screen-host" key={screen}>
          {screen === 'home' ? <HomeScreen onReward={setReward} /> : null}
          {screen === 'shop' ? <ShopScreen onReward={setReward} /> : null}
          {screen === 'collection' ? <CollectionScreen onReward={setReward} /> : null}
        </main>
        <BottomNav current={screen} onChange={changeScreen} />
      </div>

      {reward ? <RewardDialog reward={reward} onClose={() => setReward(null)} /> : null}

      {settingsOpen ? (
        <GameDialog title="星愿设置" onClose={() => setSettingsOpen(false)} className="settings-dialog">
          <button className="settings-row" onClick={toggleSound}>
            <GameIcon name={state.soundEnabled ? 'sound' : 'muted'} />
            <span><b>游戏声音</b><small>使用本地童声与真实狗叫</small></span>
            <strong>{state.soundEnabled ? '开启' : '关闭'}</strong>
          </button>
          <div className="growth-report">
            <h3><GameIcon name="level" />成长报告</h3>
            <div><span>亲密值<b>{state.hearts}/200</b></span><span>快乐值<b>{state.happiness}/100</b></span><span>收藏宝贝<b>{state.inventory.length}</b></span></div>
          </div>
          <p className="settings-footnote">成长报告只在设置里查看，不占用底部导航。</p>
        </GameDialog>
      ) : null}
    </div>
  );
}
