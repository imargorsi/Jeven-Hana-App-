import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen, Text } from "@/components/ui";
import { palette } from "@/constants/Colors";
import {
  PRIVACY_INTRO,
  PRIVACY_LAST_UPDATED,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
} from "@/lib/content/privacy.content";

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-14"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="flex-row items-center px-2"
          style={{ paddingTop: insets.top + 8 }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full active:opacity-80"
          >
            <SymbolView
              name={{
                ios: "chevron.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              size={20}
              tintColor={palette.cream}
            />
          </Pressable>
        </View>

        <View className="px-4 pt-2">
          <Text variant="h1" weight="bold" className="mb-2">
            {PRIVACY_TITLE}
          </Text>
          <Text variant="caption" tone="muted" className="mb-6">
            Last updated: {PRIVACY_LAST_UPDATED}
          </Text>

          <Text variant="body" tone="muted" className="mb-8 leading-7">
            {PRIVACY_INTRO}
          </Text>

          {PRIVACY_SECTIONS.map((section) => (
            <View key={section.heading} className="mb-7">
              <Text variant="h3" weight="semibold" className="mb-2">
                {section.heading}
              </Text>
              <Text variant="body" tone="muted" className="leading-7">
                {section.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
