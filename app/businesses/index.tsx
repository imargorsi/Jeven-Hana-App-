import { Redirect } from "expo-router";

/**
 * Business directory lives on the Explore tab.
 * Keep this route so existing `/businesses` links still resolve.
 */
export default function BusinessesIndexScreen() {
  return <Redirect href="/(tabs)/explore" />;
}
