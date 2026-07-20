import { palette as paletteValues } from "@/constants/palette";
import { withAlpha } from "@/lib/color.utils";

/**
 * Jevan Hana design tokens — use Tailwind classes in UI;
 * use `palette` only for navigation, StatusBar, icons, and similar APIs.
 */
export const palette = paletteValues;

export type TPaletteColor = keyof typeof palette;

/** Navigation / Expo Router theme bridge (app is dark-first). */
const Colors = {
  light: {
    text: palette.cream,
    background: palette.background,
    tint: palette.primary,
    tabIconDefault: withAlpha(palette.cream, 0.45),
    tabIconSelected: palette.primary,
    card: palette.surface,
    border: withAlpha(palette.cream, 0.12),
  },
  dark: {
    text: palette.cream,
    background: palette.background,
    tint: palette.primary,
    tabIconDefault: withAlpha(palette.cream, 0.45),
    tabIconSelected: palette.primary,
    card: palette.surface,
    border: withAlpha(palette.cream, 0.12),
  },
};

export default Colors;
