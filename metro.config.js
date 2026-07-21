const path = require("path");

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/**
 * Force the optional NativeClerkModule on Android so JS-only Clerk works in Expo Go.
 * Without this, Metro picks NativeClerkModule.android.js which requires the ClerkExpo
 * native binary (dev builds only).
 */
const optionalClerkNativeModule = path.resolve(
  __dirname,
  "node_modules/@clerk/expo/dist/specs/NativeClerkModule.js",
);

const config = withNativeWind(getDefaultConfig(__dirname), {
  input: "./global.css",
});

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const normalized =
    typeof moduleName === "string" ? moduleName.replace(/\\/g, "/") : "";

  if (
    platform === "android" &&
    (normalized.endsWith("/specs/NativeClerkModule") ||
      normalized === "../specs/NativeClerkModule")
  ) {
    return { type: "sourceFile", filePath: optionalClerkNativeModule };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
