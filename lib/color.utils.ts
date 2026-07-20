/**
 * Convert a 6-digit hex color to rgba using an alpha channel.
 * Prefer this over hand-written rgba() so muted colors stay tied to palette tokens.
 */
export function withAlpha(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "");

  if (cleaned.length !== 6) {
    throw new Error(`withAlpha expects a 6-digit hex color, received: ${hex}`);
  }

  const r = Number.parseInt(cleaned.slice(0, 2), 16);
  const g = Number.parseInt(cleaned.slice(2, 4), 16);
  const b = Number.parseInt(cleaned.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
