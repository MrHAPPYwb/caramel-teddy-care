import type { ScreenId } from '../game/types';
import { GameIcon, type IconName } from './GameIcon';

const navItems: Array<{ id: ScreenId; label: string; icon: IconName }> = [
  { id: 'home', label: '小屋', icon: 'home' },
  { id: 'shop', label: '星星小铺', icon: 'shop' },
  { id: 'collection', label: '宝贝柜', icon: 'collection' },
];

export function BottomNav({ current, onChange }: { current: ScreenId; onChange: (screen: ScreenId) => void }) {
  return (
    <nav className="bottom-nav" aria-label="游戏主导航">
      {navItems.map((item) => (
        <button
          className={`nav-button ${current === item.id ? 'active' : ''}`}
          key={item.id}
          onClick={() => onChange(item.id)}
          aria-current={current === item.id ? 'page' : undefined}
        >
          <span className="nav-icon"><GameIcon name={item.icon} /></span>
          <b>{item.label}</b>
        </button>
      ))}
    </nav>
  );
}
