export function getPlayer(): string | undefined {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('player') || undefined;
  return lang;
}