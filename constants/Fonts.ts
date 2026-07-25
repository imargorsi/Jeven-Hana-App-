/**
 * Loaded font family names — must match useFonts keys in app/_layout.tsx.
 * Medium is aliased to regular to keep the APK lean (3 weights × 2 scripts).
 */
export const fonts = {
  english: {
    regular: "NotoSans_400Regular",
    medium: "NotoSans_400Regular",
    semibold: "NotoSans_600SemiBold",
    bold: "NotoSans_700Bold",
  },
  urdu: {
    regular: "NotoNaskhArabic_400Regular",
    medium: "NotoNaskhArabic_400Regular",
    semibold: "NotoNaskhArabic_600SemiBold",
    bold: "NotoNaskhArabic_700Bold",
  },
} as const;

export type TFontWeight = "regular" | "medium" | "semibold" | "bold";
