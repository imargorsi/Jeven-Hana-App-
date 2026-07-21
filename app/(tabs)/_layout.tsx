import { Tabs } from "expo-router";

import { AppTabBar } from "@/components/ui/AppTabBar";
import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { ClerkSignedInGuard } from "@/features/auth/components/ClerkSignedInGuard";

function TabNavigator() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: palette.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="community" options={{ title: "Community" }} />
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (!isClerkConfigured) {
    return <TabNavigator />;
  }

  return (
    <ClerkSignedInGuard>
      <TabNavigator />
    </ClerkSignedInGuard>
  );
}
