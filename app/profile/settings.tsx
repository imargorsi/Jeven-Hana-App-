import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, View } from "react-native";

import { Screen, Text } from "@/components/ui";
import { palette } from "@/constants/Colors";

export default function ProfileSettingsScreen() {
  const [eventReminders, setEventReminders] = useState(true);
  const [communityAlerts, setCommunityAlerts] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  return (
    <Screen withSafeArea={false}>
      <ScrollView contentContainerClassName="px-4 pb-10 pt-2">
        <Text variant="h3" className="mb-3">
          Notification settings
        </Text>
        <View className="mb-6 rounded-card border border-cream/10 bg-surface p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="bodySmall">Event reminders</Text>
            <Switch
              value={eventReminders}
              onValueChange={setEventReminders}
              trackColor={{ true: palette.primary, false: palette.surface }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text variant="bodySmall">Community alerts</Text>
            <Switch
              value={communityAlerts}
              onValueChange={setCommunityAlerts}
              trackColor={{ true: palette.primary, false: palette.surface }}
            />
          </View>
        </View>

        <Text variant="h3" className="mb-3">
          Privacy
        </Text>
        <View className="mb-6 rounded-card border border-cream/10 bg-surface p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text variant="bodySmall">Keep profile private</Text>
              <Text variant="caption" tone="muted" className="mt-1">
                Hide your posts from public listings (mock setting).
              </Text>
            </View>
            <Switch
              value={privateProfile}
              onValueChange={setPrivateProfile}
              trackColor={{ true: palette.primary, false: palette.surface }}
            />
          </View>
        </View>

        <Text variant="h3" className="mb-3">
          About Jevan Hana
        </Text>
        <Pressable
          className="rounded-card border border-cream/10 bg-surface p-4"
          onPress={() =>
            Alert.alert(
              "Jevan Hana",
              "A community app for residents of Jevan Hana, Garden Town, Lahore — local discovery, updates, and events in one place.",
            )
          }
        >
          <Text variant="bodySmall" weight="semibold">
            About this app
          </Text>
          <Text variant="caption" tone="muted" className="mt-1">
            Garden Town, Lahore · Version 1.0.0
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
