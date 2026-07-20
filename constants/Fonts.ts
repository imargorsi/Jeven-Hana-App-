/**
 * Loaded font family names — must match useFonts keys in app/_layout.tsx.
 */
export const fonts = {
  nunito: {
    regular: "Nunito_400Regular",
    medium: "Nunito_500Medium",
    semibold: "Nunito_600SemiBold",
    bold: "Nunito_700Bold",
  },
  urdu: {
    regular: "NotoNastaliqUrdu_400Regular",
    medium: "NotoNastaliqUrdu_500Medium",
    semibold: "NotoNastaliqUrdu_600SemiBold",
    bold: "NotoNastaliqUrdu_700Bold",
  },
} as const;

export type TFontWeight = "regular" | "medium" | "semibold" | "bold";
