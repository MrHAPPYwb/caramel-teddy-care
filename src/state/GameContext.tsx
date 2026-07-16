import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { shopItems } from '../game/catalog';
import type { GameState, ScreenId, TeddySkin } from '../game/types';

const STORAGE_KEY = 'caramel-teddy-care:save-v2';

const initialState: GameState = {
  saveVersion: 2,
  name: '糖糖',
  level: 6,
  hearts: 132,
  coins: 178,
  happiness: 86,
  inventory: ['basic-collar'],
  equippedSkin: 'default',
  lastCheckIn: null,
  visited: { home: true, shop: false, collection: false },
  soundEnabled: true,
};

interface GameContextValue {
  state: GameState;
  visit: (screen: ScreenId) => void;
  purchase: (itemId: string) => 'purchased' | 'owned' | 'locked' | 'insufficient';
  equip: (skin: TeddySkin) => 'equipped' | 'locked' | 'missing';
  checkIn: () => 'claimed' | 'already';
  pet: () => void;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;
    const parsed = JSON.parse(saved) as Partial<GameState>;
    if (parsed.saveVersion !== 2) return initialState;
    return {
      ...initialState,
      ...parsed,
      visited: { ...initialState.visited, ...parsed.visited },
      inventory: Array.from(new Set(['basic-collar', ...(parsed.inventory ?? [])])),
    };
  } catch {
    return initialState;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadState);

  const visit = useCallback((screen: ScreenId) => {
    setState((current) => current.visited[screen] ? current : ({
      ...current,
      visited: { ...current.visited, [screen]: true },
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<GameContextValue>(() => ({
    state,
    visit,
    purchase: (itemId) => {
      const item = shopItems.find((entry) => entry.id === itemId);
      if (!item) return 'locked';
      if (item.lockedAtHearts && state.hearts < item.lockedAtHearts) return 'locked';
      if (state.inventory.includes(itemId)) return 'owned';
      if (state.coins < item.price) return 'insufficient';
      setState((current) => ({
        ...current,
        coins: current.coins - item.price,
        inventory: [...current.inventory, itemId],
      }));
      return 'purchased';
    },
    equip: (skin) => {
      if (skin === 'guardian' && state.hearts < 180) return 'locked';
      const item = shopItems.find((entry) => entry.skin === skin);
      if (item && !state.inventory.includes(item.id)) return 'missing';
      setState((current) => ({ ...current, equippedSkin: skin }));
      return 'equipped';
    },
    checkIn: () => {
      const today = new Date().toISOString().slice(0, 10);
      if (state.lastCheckIn === today) return 'already';
      setState((current) => ({
        ...current,
        lastCheckIn: today,
        coins: current.coins + 10,
        hearts: Math.min(200, current.hearts + 2),
      }));
      return 'claimed';
    },
    pet: () => setState((current) => ({
      ...current,
      happiness: Math.min(100, current.happiness + 2),
      hearts: Math.min(200, current.hearts + 1),
    })),
    toggleSound: () => setState((current) => ({ ...current, soundEnabled: !current.soundEnabled })),
  }), [state, visit]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const value = useContext(GameContext);
  if (!value) throw new Error('useGame must be used inside GameProvider');
  return value;
}
