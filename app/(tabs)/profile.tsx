import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, View } from "react-native";

import { Button, Screen, Text } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { href } from "@/lib/navigation.utils";

function SettingsRow({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="border-b border-cream/10 py-4 active:opacity-80"
    >
      <Text variant="bodySmall" weight="semibold">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="caption" tone="muted" className="mt-1">
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

export default function ProfileTabScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Neighbour";

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-10">
        <Text variant="h2" className="mb-1">
          Profile
        </Text>
        <Text variant="caption" tone="muted" isUrdu className="mb-6">
          پروفائل
        </Text>

        <View className="mb-6 items-center rounded-card border border-cream/10 bg-surface p-6">
          <Avatar
            uri={user?.imageUrl}
            name={fullName}
            size="lg"
            className="mb-3"
          />
          <Text variant="h3">{fullName}</Text>
          {user?.username ? (
            <Text variant="caption" tone="muted" className="mt-1">
              @{user.username}
            </Text>
          ) : null}
          {user?.primaryEmailAddress?.emailAddress ? (
            <Text variant="caption" tone="muted" className="mt-1">
              {user.primaryEmailAddress.emailAddress}
            </Text>
          ) : null}
          <Button
            size="sm"
            variant="secondary"
            className="mt-4"
            onPress={() => router.push(href("/profile/edit"))}
          >
            Edit profile
          </Button>
        </View>

        <SettingsRow
          title="My posts"
          subtitle="Posts you've shared with the community"
          onPress={() => router.push(href("/profile/posts"))}
        />
        <SettingsRow
          title="Saved items"
          subtitle="Businesses, places, events & Ka Best"
          onPress={() => router.push(href("/saved"))}
        />
        <SettingsRow
          title="Notifications"
          subtitle="See recent alerts"
          onPress={() => router.push(href("/notifications"))}
        />
        <SettingsRow
          title="Settings"
          subtitle="Privacy, about & more"
          onPress={() => router.push(href("/profile/settings"))}
        />

        <Button
          variant="ghost"
          className="mt-8"
          onPress={() => {
            Alert.alert("Log out?", "You can sign back in anytime.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Log out",
                style: "destructive",
                onPress: () => void signOut(),
              },
            ]);
          }}
        >
          Log out
        </Button>
      </ScrollView>
    </Screen>
  );
}
