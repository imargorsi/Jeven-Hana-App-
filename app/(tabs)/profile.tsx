import { useAuth, useUser } from "@clerk/expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";

import { Screen, Text } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { palette } from "@/constants/Colors";
import { IMG } from "@/data/mocks/mock.utils";
import { withAlpha } from "@/lib/color.utils";
import { href } from "@/lib/navigation.utils";

type TSymbolName = NonNullable<ComponentProps<typeof SymbolView>["name"]>;

interface IProfileLink {
  title: string;
  subtitle: string;
  icon: TSymbolName;
  route: string;
}

const PROFILE_LINKS: IProfileLink[] = [
  {
    title: "Edit profile",
    subtitle: "Name, photo & account details",
    icon: {
      ios: "pencil",
      android: "edit",
      web: "edit",
    },
    route: "/profile/edit",
  },
  {
    title: "My posts",
    subtitle: "Updates you've shared",
    icon: {
      ios: "doc.text",
      android: "article",
      web: "article",
    },
    route: "/profile/posts",
  },
  {
    title: "Saved places",
    subtitle: "Businesses, places & Ka Best",
    icon: {
      ios: "bookmark",
      android: "bookmark_border",
      web: "bookmark",
    },
    route: "/profile/saved",
  },
  {
    title: "Events going",
    subtitle: "Neighbourhood events you're attending",
    icon: {
      ios: "calendar",
      android: "event",
      web: "event",
    },
    route: "/profile/going",
  },
];

export default function ProfileTabScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Neighbour";
  const username = user?.username ? `@${user.username}` : "@neighbour";
  const email = user?.primaryEmailAddress?.emailAddress;
  const avatarUri = user?.hasImage ? user.imageUrl : IMG.avatar;

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-3"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative mb-5 overflow-hidden rounded-card border border-cream/10 bg-surface">
          <LinearGradient
            colors={[
              withAlpha(palette.primary, 0.18),
              withAlpha(palette.surface, 0),
            ]}
            locations={[0, 1]}
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />

          <View className="flex-row items-center gap-3.5 px-4 py-4">
            <View
              className="rounded-full p-0.5"
              style={{
                backgroundColor: palette.surface,
                borderWidth: 2.5,
                borderColor: palette.primary,
              }}
            >
              <Avatar uri={avatarUri} name={fullName} size="lg" />
            </View>

            <View className="min-w-0 flex-1">
              <Text variant="h3" weight="bold" numberOfLines={1}>
                {fullName}
              </Text>
              <Text
                variant="bodySmall"
                weight="semibold"
                tone="primary"
                className="mt-0.5"
                numberOfLines={1}
              >
                {username}
              </Text>
              {email ? (
                <Text
                  variant="caption"
                  tone="muted"
                  className="mt-1"
                  numberOfLines={1}
                >
                  {email}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View className="overflow-hidden rounded-card border border-cream/10 bg-surface">
          {PROFILE_LINKS.map((link, index) => (
            <Pressable
              key={link.route}
              accessibilityRole="button"
              accessibilityLabel={link.title}
              onPress={() => router.push(href(link.route))}
              className="flex-row items-center gap-3.5 px-4 py-3.5 active:opacity-80"
              style={
                index < PROFILE_LINKS.length - 1
                  ? {
                      borderBottomWidth: 1,
                      borderBottomColor: withAlpha(palette.cream, 0.08),
                    }
                  : undefined
              }
            >
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary/15">
                <SymbolView
                  name={link.icon}
                  size={18}
                  tintColor={palette.primary}
                />
              </View>
              <View className="min-w-0 flex-1">
                <Text variant="bodySmall" weight="semibold">
                  {link.title}
                </Text>
                <Text variant="caption" tone="muted" className="mt-0.5">
                  {link.subtitle}
                </Text>
              </View>
              <SymbolView
                name={{
                  ios: "chevron.right",
                  android: "chevron_right",
                  web: "chevron_right",
                }}
                size={14}
                tintColor={palette.muted}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
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
          className="mt-8 flex-row items-center justify-center gap-2 py-3 active:opacity-70"
        >
          <SymbolView
            name={{
              ios: "rectangle.portrait.and.arrow.right",
              android: "logout",
              web: "logout",
            }}
            size={16}
            tintColor={palette.muted}
          />
          <Text variant="bodySmall" weight="medium" tone="muted">
            Log out
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
