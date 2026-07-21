/**
 * @clerk/expo ships NativeClerkModule.android.js with requireNativeModule('ClerkExpo'),
 * which throws in Expo Go (no native Clerk binary). The plain .js build uses
 * requireOptionalNativeModule and is safe for the JavaScript-only auth path.
 *
 * Re-run automatically via package.json "postinstall".
 */
const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "../node_modules/@clerk/expo/dist/specs/NativeClerkModule.android.js",
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const source = fs.readFileSync(target, "utf8");

if (source.includes("requireOptionalNativeModule")) {
  process.exit(0);
}

if (!source.includes('requireNativeModule)("ClerkExpo")')) {
  process.exit(0);
}

const patched = source.replace(
  'requireNativeModule)("ClerkExpo")',
  'requireOptionalNativeModule)("ClerkExpo")',
);

fs.writeFileSync(target, patched);
console.log(
  "[patch-clerk-expo-go] NativeClerkModule.android.js → optional (Expo Go)",
);
