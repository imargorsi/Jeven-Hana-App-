/** Detect Arabic / Urdu script for RTL + Urdu font. */
export function hasUrduScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
