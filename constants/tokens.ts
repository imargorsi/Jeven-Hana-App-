/** Spacing, radii, and icon sizes — use with StyleSheet / inline styles. */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 14,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type TSpacingToken = keyof typeof spacing;
export type TRadiiToken = keyof typeof radii;
export type TIconSizeToken = keyof typeof iconSizes;
