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

function parseHex(hex: string) {
  const cleaned = hex.replace("#", "");

  if (cleaned.length !== 6) {
    throw new Error(`Expected a 6-digit hex color, received: ${hex}`);
  }

  return {
    r: Number.parseInt(cleaned.slice(0, 2), 16),
    g: Number.parseInt(cleaned.slice(2, 4), 16),
    b: Number.parseInt(cleaned.slice(4, 6), 16),
  };
}

/** Mix two palette hex colors. `t` is 0 (from) → 1 (to). */
export function mixHex(from: string, to: string, t: number): string {
  const amount = Math.min(1, Math.max(0, t));
  const a = parseHex(from);
  const b = parseHex(to);
  const r = Math.round(a.r + (b.r - a.r) * amount);
  const g = Math.round(a.g + (b.g - a.g) * amount);
  const bl = Math.round(a.b + (b.b - a.b) * amount);
  const mixed = `#${[r, g, bl].map((n) => n.toString(16).padStart(2, "0")).join("")}`;

  return withAlpha(mixed, 1);
}
