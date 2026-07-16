import type { SVGProps } from 'react';

export type IconName = 'home' | 'shop' | 'collection' | 'heart' | 'coin' | 'level' | 'settings' | 'checkin' | 'task' | 'mail' | 'close' | 'back' | 'lock' | 'sound' | 'muted' | 'sparkle';

export function GameIcon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const path = {
    home: <><path {...common} d="M3.5 11 12 3.8 20.5 11"/><path {...common} d="M5.8 9.8v9.4h12.4V9.8M9.5 19.2v-5.8h5v5.8"/><path {...common} d="m17.2 5.5 1.9-1.6v4.5"/></>,
    shop: <><path {...common} d="M4 9.5h16l-1.5-5H5.5z"/><path {...common} d="M5 9.5v10h14v-10"/><path {...common} d="M9 19.5v-6h6v6"/><path {...common} d="M3.8 9.5c0 1.4 1 2.5 2.3 2.5s2.3-1.1 2.3-2.5c0 1.4 1 2.5 2.3 2.5S13 10.9 13 9.5c0 1.4 1 2.5 2.3 2.5s2.3-1.1 2.3-2.5c0 1.4 1 2.5 2.3 2.5"/></>,
    collection: <><path {...common} d="M4.5 4.5h15v15h-15z"/><path {...common} d="M8 4.5v15M16 4.5v15M4.5 11.8h15"/><circle cx="10.2" cy="9" r=".8" fill="currentColor"/><circle cx="13.8" cy="9" r=".8" fill="currentColor"/></>,
    heart: <path {...common} d="M12 20.2S4 15.4 4 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.2c0 6.2-8 11-8 11Z"/>,
    coin: <><path {...common} d="m12 3 2.2 4.4 4.8.7-3.5 3.4.8 4.8-4.3-2.2-4.3 2.2.8-4.8L5 8.1l4.8-.7Z"/><circle {...common} cx="12" cy="12" r="9"/></>,
    level: <path {...common} d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8Z"/>,
    settings: <><circle {...common} cx="12" cy="12" r="3.2"/><path {...common} d="M12 2.8v2M12 19.2v2M21.2 12h-2M4.8 12h-2M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4M18.5 18.5l-1.4-1.4M6.9 6.9 5.5 5.5"/></>,
    checkin: <><path {...common} d="M5 5.5h14v14H5zM8 3v5M16 3v5M5 9.5h14"/><path {...common} d="m8.5 14 2 2 4.5-4.5"/></>,
    task: <><path {...common} d="M7 4h12v16H7zM4 7h3M4 12h3M4 17h3"/><path {...common} d="m10 10 1.4 1.4L15 8M10 15h5"/></>,
    mail: <><rect {...common} x="3.5" y="5.5" width="17" height="13" rx="2"/><path {...common} d="m5 7 7 6 7-6"/></>,
    close: <path {...common} d="m6 6 12 12M18 6 6 18"/>,
    back: <><path {...common} d="m14.5 5-7 7 7 7"/><path {...common} d="M8 12h11"/></>,
    lock: <><rect {...common} x="5" y="10" width="14" height="11" rx="3"/><path {...common} d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    sound: <><path {...common} d="M5 10v4h3l4 4V6l-4 4Z"/><path {...common} d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></>,
    muted: <><path {...common} d="M5 10v4h3l4 4V6l-4 4Z"/><path {...common} d="m16 9 5 6M21 9l-5 6"/></>,
    sparkle: <path {...common} d="M12 2.5c.8 5.2 2.3 6.7 7.5 7.5-5.2.8-6.7 2.3-7.5 7.5-.8-5.2-2.3-6.7-7.5-7.5 5.2-.8 6.7-2.3 7.5-7.5Z"/>,
  }[name];

  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>{path}</svg>;
}
