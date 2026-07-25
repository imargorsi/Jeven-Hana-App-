const { load } = require("@expo/env");

const { palette } = require("./constants/palette");

load(process.cwd());

const clerkPublishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

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
    /** Shrink the window when the keyboard opens so inputs stay visible. */
    softwareKeyboardLayoutMode: "resize",
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
    "expo-secure-store",
    "expo-image",
    "@react-native-community/datetimepicker",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    clerkPublishableKey,
  },
};
