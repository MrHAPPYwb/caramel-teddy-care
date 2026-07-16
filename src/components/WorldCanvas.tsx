import { useEffect, useRef } from 'react';
import { Application, Assets, Sprite } from 'pixi.js';
import { assetUrl } from '../game/assetUrl';

interface WorldCanvasProps {
  background: string;
  mood?: 'day' | 'shop' | 'night';
}

export function WorldCanvas({ background, mood = 'day' }: WorldCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let app: Application | null = null;
    let resizeObserver: ResizeObserver | null = null;

    void (async () => {
      const nextApp = new Application();
      await nextApp.init({
        resizeTo: host,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        backgroundAlpha: 0,
        preference: 'webgl',
      });
      if (disposed) {
        nextApp.destroy({ removeView: true }, { children: true });
        return;
      }
      app = nextApp;
      nextApp.canvas.className = 'world-canvas-element';
      host.appendChild(nextApp.canvas);

      const [backgroundTexture, starTexture] = await Promise.all([
        Assets.load(assetUrl(background)),
        Assets.load(assetUrl('assets/fx/star-sparkle.svg')),
      ]);
      if (disposed) return;

      const backdrop = new Sprite(backgroundTexture);
      backdrop.anchor.set(0.5);
      nextApp.stage.addChild(backdrop);

      const ambientCount = mood === 'night' ? 13 : mood === 'shop' ? 9 : 7;
      const stars = Array.from({ length: ambientCount }, (_, index) => {
        const star = new Sprite(starTexture);
        star.anchor.set(0.5);
        star.alpha = 0.22 + (index % 4) * 0.08;
        star.scale.set(0.18 + (index % 3) * 0.05);
        nextApp.stage.addChild(star);
        return star;
      });

      const layout = () => {
        const width = nextApp.screen.width;
        const height = nextApp.screen.height;
        const textureWidth = backgroundTexture.width || 390;
        const textureHeight = backgroundTexture.height || 700;
        const scale = Math.max(width / textureWidth, height / textureHeight);
        backdrop.scale.set(scale);
        backdrop.position.set(width / 2, height / 2);
        stars.forEach((star, index) => {
          star.position.set(
            width * (0.09 + ((index * 0.173) % 0.84)),
            height * (0.1 + ((index * 0.137) % 0.68)),
          );
        });
      };

      layout();
      resizeObserver = new ResizeObserver(layout);
      resizeObserver.observe(host);

      let elapsed = 0;
      nextApp.ticker.add((ticker) => {
        elapsed += ticker.deltaMS;
        stars.forEach((star, index) => {
          star.alpha = 0.18 + 0.2 * (0.5 + 0.5 * Math.sin(elapsed / 700 + index * 1.7));
          star.rotation = Math.sin(elapsed / 1200 + index) * 0.08;
        });
      });
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      app?.destroy({ removeView: true }, { children: true });
    };
  }, [background, mood]);

  return <div className="world-canvas" ref={hostRef} aria-hidden="true" />;
}
