export function getLanguage(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') || 'ru';
  return lang;
}