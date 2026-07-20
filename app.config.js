const { palette } = require("./constants/palette");

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  name: "Jevan Hana",
  slug: "jevan-hana",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "jevan-hana",
  userInterfaceStyle: "dark",
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: palette.background,
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: palette.background,
      },
    ],
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
  },
};
