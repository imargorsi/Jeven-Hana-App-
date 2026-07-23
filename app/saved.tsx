import { Redirect } from "expo-router";

/** Kept for Home Quick Access and old links — opens profile Saved places. */
export default function SavedRedirect() {
  return <Redirect href="/profile/saved" />;
}
