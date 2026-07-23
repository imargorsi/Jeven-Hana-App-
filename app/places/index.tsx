import { Redirect } from "expo-router";

/** Places directory merged into Explore — single listings hub. */
export default function PlacesIndexScreen() {
  return <Redirect href="/(tabs)/explore" />;
}
