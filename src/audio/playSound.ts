import { assetUrl } from '../game/assetUrl';

const active = new Set<HTMLAudioElement>();

export function playSound(file: string, enabled: boolean, volume = 0.65) {
  if (!enabled) return;
  const audio = new Audio(assetUrl(file));
  audio.volume = volume;
  active.add(audio);
  const release = () => active.delete(audio);
  audio.addEventListener('ended', release, { once: true });
  audio.addEventListener('error', release, { once: true });
  void audio.play().catch(release);
}
