export function getPlayer(): string | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  const player = urlParams.get('player') || undefined;
  return player?.toLocaleLowerCase();
}