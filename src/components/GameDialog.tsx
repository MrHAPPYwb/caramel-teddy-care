import { useEffect, type ReactNode } from 'react';
import { GameIcon } from './GameIcon';

export function GameDialog({ title, onClose, children, className = '' }: { title: string; onClose: () => void; children: ReactNode; className?: string }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`game-dialog ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="dialog-stars" aria-hidden="true"><i/><i/><i/><i/></div>
        <header>
          <h2>{title}</h2>
          <button className="round-icon-button close-button" onClick={onClose} aria-label="关闭">
            <GameIcon name="close" />
          </button>
        </header>
        <div className="dialog-body">{children}</div>
      </section>
    </div>
  );
}
