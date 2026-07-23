import { Redirect } from "expo-router";

/** Category browsing lives on Explore. */
export default function PlacesCategoryScreen() {
  return <Redirect href="/(tabs)/explore" />;
}
