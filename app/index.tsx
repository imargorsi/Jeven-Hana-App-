import { Redirect } from "expo-router";

import { useAppStore } from "@/stores/useAppStore";

export default function Index() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/login" />;
}
