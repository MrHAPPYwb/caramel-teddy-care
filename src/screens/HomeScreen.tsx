import { useEffect, useRef, useState } from 'react';
import { playSound } from '../audio/playSound';
import { GameDialog } from '../components/GameDialog';
import { GameIcon, type IconName } from '../components/GameIcon';
import { WorldCanvas } from '../components/WorldCanvas';
import { assetUrl } from '../game/assetUrl';
import type { RewardPayload } from '../game/types';
import { useGame } from '../state/GameContext';

type HomeDialog = 'checkin' | 'tasks' | 'mail' | null;

const sideActions: Array<{ id: Exclude<HomeDialog, null>; label: string; icon: IconName }> = [
  { id: 'checkin', label: '签到', icon: 'checkin' },
  { id: 'tasks', label: '任务', icon: 'task' },
  { id: 'mail', label: '信箱', icon: 'mail' },
];

export function HomeScreen({ onReward }: { onReward: (payload: RewardPayload) => void }) {
  const { state, checkIn, pet } = useGame();
  const [dialog, setDialog] = useState<HomeDialog>(null);
  const [pose, setPose] = useState<'idle' | 'wink' | 'happy'>('idle');
  const poseTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const scheduleBlink = () => {
      const delay = 3600 + Math.random() * 2600;
      poseTimer.current = window.setTimeout(() => {
        if (cancelled || state.equippedSkin !== 'default') return;
        setPose('wink');
        window.setTimeout(() => {
          if (!cancelled) setPose('idle');
          scheduleBlink();
        }, 320);
      }, delay);
    };
    scheduleBlink();
    return () => {
      cancelled = true;
      if (poseTimer.current) window.clearTimeout(poseTimer.current);
    };
  }, [state.equippedSkin]);

  const teddyFile = state.equippedSkin !== 'default'
    ? `teddy-${state.equippedSkin}.png`
    : pose === 'happy'
      ? 'teddy-happy.png'
      : pose === 'wink'
        ? 'teddy-wink.png'
        : 'teddy-default.png';

  const onPet = () => {
    pet();
    setPose('happy');
    playSound('assets/audio/dog/dog-happy.mp3', state.soundEnabled, 0.52);
    window.setTimeout(() => setPose('idle'), 760);
  };

  const claimCheckIn = () => {
    const result = checkIn();
    setDialog(null);
    if (result === 'claimed') {
      playSound('assets/audio/dog/dog-happy.mp3', state.soundEnabled, 0.45);
      onReward({ title: '今日签到成功', message: '糖糖把星星币装进你的小口袋啦！', coins: 10, hearts: 2, pose: 'wink' });
    } else {
      onReward({ title: '今天见过啦', message: '明天再来和糖糖击掌签到吧！', pose: 'happy' });
    }
  };

  return (
    <section className="scene-screen home-screen" aria-label="糖糖的小屋">
      <WorldCanvas background="assets/scenes/home-bg.png" mood="day" />
      <div className="home-sunbeam" aria-hidden="true" />
      <div className="home-copy">
        <p>早安呀，今天也要一起收集星光！</p>
      </div>
      <button className={`teddy-stage teddy-${pose}`} onClick={onPet} aria-label="摸摸糖糖">
        <span className="teddy-contact-shadow" aria-hidden="true" />
        <img src={assetUrl(`assets/teddy/${teddyFile}`)} alt="金牛座焦糖泰迪糖糖" />
        <span className="pet-hint">轻轻摸摸我</span>
      </button>
      <aside className="home-side-actions" aria-label="小屋快捷操作">
        {sideActions.map((action) => (
          <button className="candy-orb" key={action.id} onClick={() => setDialog(action.id)}>
            <span><GameIcon name={action.icon} /></span>
            <b>{action.label}</b>
          </button>
        ))}
      </aside>
      <div className="happiness-capsule" aria-label={`快乐值 ${state.happiness}`}>
        <span><GameIcon name="heart" /></span>
        <div><b>快乐值</b><i><em style={{ width: `${state.happiness}%` }} /></i></div>
        <strong>{state.happiness}</strong>
      </div>

      {dialog === 'checkin' ? (
        <GameDialog title="星光签到" onClose={() => setDialog(null)}>
          <div className="checkin-calendar">
            {Array.from({ length: 7 }, (_, index) => (
              <span className={index === 0 ? 'today' : ''} key={index}>
                <small>第{index + 1}天</small>
                <GameIcon name={index === 6 ? 'collection' : 'coin'} />
                <b>{index === 6 ? '宝箱' : `+${10 + index * 2}`}</b>
              </span>
            ))}
          </div>
          <button className="candy-button primary" onClick={claimCheckIn}>和糖糖击掌</button>
        </GameDialog>
      ) : null}

      {dialog === 'tasks' ? (
        <GameDialog title="糖糖的今日小事" onClose={() => setDialog(null)}>
          <div className="task-ribbon-list">
            <span className="done"><GameIcon name="heart" /><b>摸摸糖糖</b><small>完成</small></span>
            <span className={state.visited.shop ? 'done' : ''}><GameIcon name="shop" /><b>逛逛星星小铺</b><small>{state.visited.shop ? '完成' : '+5'}</small></span>
            <span className={state.visited.collection ? 'done' : ''}><GameIcon name="collection" /><b>看看宝贝柜</b><small>{state.visited.collection ? '完成' : '+5'}</small></span>
          </div>
          <p className="gentle-note">照顾糖糖的小事，会慢慢变成闪亮的成长回忆。</p>
        </GameDialog>
      ) : null}

      {dialog === 'mail' ? (
        <GameDialog title="糖糖写给你" onClose={() => setDialog(null)} className="mail-dialog">
          <div className="teddy-letter">
            <p className="pinyin">Nǐ shì wǒ zuì xǐhuan de xiǎo zhǔrén.</p>
            <p>你是我最喜欢的小主人。</p>
            <p className="english">You are my favorite little friend.</p>
            <span>—— 糖糖</span>
          </div>
        </GameDialog>
      ) : null}
    </section>
  );
}
