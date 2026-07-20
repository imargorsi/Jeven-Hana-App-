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
      },
      fontFamily: {
        nunito: ["Nunito_400Regular"],
        "nunito-medium": ["Nunito_500Medium"],
        "nunito-semibold": ["Nunito_600SemiBold"],
        "nunito-bold": ["Nunito_700Bold"],
        urdu: ["NotoNastaliqUrdu_400Regular"],
        "urdu-medium": ["NotoNastaliqUrdu_500Medium"],
        "urdu-semibold": ["NotoNastaliqUrdu_600SemiBold"],
        "urdu-bold": ["NotoNastaliqUrdu_700Bold"],
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
