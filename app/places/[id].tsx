import { Redirect } from "expo-router";

/**
 * Part 1: places folded into Business listings on Explore.
 * Deep links to /places/:id go to the combined hub.
 */
export default function PlaceDetailScreen() {
  return <Redirect href="/(tabs)/explore" />;
}
