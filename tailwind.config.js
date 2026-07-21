const { palette } = require("./constants/palette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: palette.background,
        surface: palette.surface,
        primary: palette.primary,
        cream: palette.cream,
        success: palette.success,
        error: palette.error,
        muted: palette.muted,
      },
      fontFamily: {
        english: ["NotoSans_400Regular"],
        "english-medium": ["NotoSans_500Medium"],
        "english-semibold": ["NotoSans_600SemiBold"],
        "english-bold": ["NotoSans_700Bold"],
        urdu: ["NotoNaskhArabic_400Regular"],
        "urdu-medium": ["NotoNaskhArabic_500Medium"],
        "urdu-semibold": ["NotoNaskhArabic_600SemiBold"],
        "urdu-bold": ["NotoNaskhArabic_700Bold"],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        chip: "9999px",
      },
    },
  },
  plugins: [],
};
