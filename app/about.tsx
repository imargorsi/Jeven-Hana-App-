import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ErrorState,
  LoadingBlock,
  Screen,
  Text,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import { IMG, toImageSource } from "@/data/mocks/mock.utils";
import { withAlpha } from "@/lib/color.utils";
import { openWhatsApp } from "@/lib/linking.utils";
import { getAboutContent } from "@/lib/services/about.service";

const COVER_HEIGHT = 220;

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const query = useQuery({
    queryKey: ["about"],
    queryFn: getAboutContent,
  });

  if (query.isLoading) {
    return (
      <Screen withSafeArea={false} withAppHeader={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (query.isError || !query.data) {
    return (
      <Screen withSafeArea={false} withAppHeader={false} className="px-4 pt-12">
        <ErrorState onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  const about = query.data;
  const paragraphs: string[] = about.paragraphs;
  const coverUri = about.coverImageUrl?.trim() || null;
  const coverSource = coverUri
    ? toImageSource(coverUri)
    : toImageSource(IMG.businessFallback);

  return (
    <Screen withSafeArea={false} withAppHeader={false}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-14"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="relative overflow-hidden"
          style={{ height: COVER_HEIGHT }}
        >
          <Image
            source={coverSource}
            style={{ width: "100%", height: COVER_HEIGHT }}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={[withAlpha(palette.background, 0.75), "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: insets.top + 72,
            }}
            pointerEvents="none"
          />
          <LinearGradient
            colors={["transparent", palette.background]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 72,
            }}
            pointerEvents="none"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go Back"
            hitSlop={8}
            onPress={() => router.back()}
            className="absolute left-4 h-10 w-10 items-center justify-center rounded-full bg-background/55 active:opacity-80"
            style={{ top: insets.top + 8 }}
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
          <Text
            isUrdu
            variant="h1"
            weight="bold"
            tone="primary"
            className="mb-5 text-right"
          >
            {about.title}
          </Text>

          <View>
            {paragraphs.map((paragraph, index) => (
              <Text
                key={`p-${index}`}
                isUrdu
                variant="body"
                tone="muted"
                className="text-right leading-7"
                style={{ marginBottom: index === paragraphs.length - 1 ? 0 : 28 }}
              >
                {paragraph}
              </Text>
            ))}
          </View>

          <View
            className="rounded-card border border-cream/10 bg-surface px-3 py-3"
            style={{ marginTop: 56 }}
          >
            <Text
              isUrdu
              variant="label"
              weight="semibold"
              className="mb-2.5 text-right"
            >
              {about.contact.heading}
            </Text>

            {about.contact.body ? (
              <Text
                isUrdu
                variant="bodySmall"
                tone="muted"
                className="mb-3 text-right leading-6"
              >
                {about.contact.body}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={about.contact.whatsappLabel ?? "واٹس ایپ"}
              onPress={() =>
                void openWhatsApp(
                  about.contact.whatsapp,
                  about.contact.whatsappMessage,
                )
              }
              className="items-center justify-center rounded-button bg-success px-3 py-2.5 active:opacity-90"
            >
              <Text isUrdu variant="button" weight="semibold" tone="cream">
                {about.contact.whatsappLabel ?? "واٹس ایپ"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
