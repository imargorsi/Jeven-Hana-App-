import { Redirect } from "expo-router";

/** Category browsing lives on Explore. */
export default function BusinessCategoryScreen() {
  return <Redirect href="/(tabs)/explore" />;
}
