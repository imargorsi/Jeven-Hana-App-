/**
 * Loaded font family names — must match useFonts keys in app/_layout.tsx.
 */
export const fonts = {
  english: {
    regular: "NotoSans_400Regular",
    medium: "NotoSans_500Medium",
    semibold: "NotoSans_600SemiBold",
    bold: "NotoSans_700Bold",
  },
  urdu: {
    regular: "NotoNaskhArabic_400Regular",
    medium: "NotoNaskhArabic_500Medium",
    semibold: "NotoNaskhArabic_600SemiBold",
    bold: "NotoNaskhArabic_700Bold",
  },
} as const;

export type TFontWeight = "regular" | "medium" | "semibold" | "bold";
