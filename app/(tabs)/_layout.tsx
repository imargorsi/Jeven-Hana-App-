import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Colors, { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { ClerkSignedInGuard } from "@/features/auth/components/ClerkSignedInGuard";

function TabNavigator() {
  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.cream,
        headerTitleStyle: { fontFamily: fonts.english.semibold },
        tabBarActiveTintColor: Colors.dark.tabIconSelected,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
        tabBarStyle: {
          backgroundColor: palette.background,
          borderTopColor: Colors.dark.border,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.english.medium,
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: "house.fill", android: "home", web: "home" }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "safari.fill",
                android: "explore",
                web: "explore",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "person.3.fill",
                android: "groups",
                web: "groups",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "calendar",
                android: "event",
                web: "event",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "person.fill",
                android: "person",
                web: "person",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
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
