import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen, Text } from "@/components/ui";
import { palette } from "@/constants/Colors";
import {
  GUIDELINES_INTRO,
  GUIDELINES_LAST_UPDATED,
  GUIDELINES_SECTIONS,
  GUIDELINES_TITLE,
} from "@/lib/content/guidelines.content";

export default function GuidelinesScreen() {
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
            accessibilityLabel="Go Back"
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
            {GUIDELINES_TITLE}
          </Text>
          <Text variant="caption" tone="muted" className="mb-6">
            Last updated: {GUIDELINES_LAST_UPDATED}
          </Text>

          <Text
            isUrdu
            variant="bodySmall"
            tone="muted"
            className="mb-4 text-right leading-6"
          >
            یہ رہنما اصول جیون ہانہ کمیونٹی کو محفوظ اور مفید رکھنے کے لیے ہیں۔
          </Text>

          <Text variant="body" tone="muted" className="mb-8 leading-7">
            {GUIDELINES_INTRO}
          </Text>

          {GUIDELINES_SECTIONS.map((section) => (
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
