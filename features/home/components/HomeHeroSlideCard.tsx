import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import type { IHomeHeroSlide } from "@/features/home/home.slides";
import { withAlpha } from "@/lib/color.utils";

export const HERO_SLIDE_HEIGHT = 208;

const GLASS_PILL = {
  backgroundColor: withAlpha(palette.background, 0.72),
  borderWidth: 1,
  borderColor: withAlpha(palette.cream, 0.22),
} as const;

interface IHomeHeroSlideCardProps {
  slide: IHomeHeroSlide;
  width: number;
  onCtaPress: () => void;
}

/** Single hero slide — photo fades into navy; clean copy column (no ornaments). */
export function HomeHeroSlideCard({
  slide,
  width,
  onCtaPress,
}: IHomeHeroSlideCardProps) {
  return (
    <View
      style={{ width, height: HERO_SLIDE_HEIGHT }}
      className="overflow-hidden bg-background"
    >
      {/* Full-bleed photo so the edge never reads as a hard cut */}
      <Image
        source={toImageSource(slide.image)}
        contentFit="cover"
        transition={250}
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      {/* Wide, soft left→right dissolve into navy (matches initial mock) */}
      <LinearGradient
        colors={[
          withAlpha(palette.background, 0.05),
          withAlpha(palette.background, 0.28),
          withAlpha(palette.background, 0.62),
          withAlpha(palette.background, 0.9),
          palette.background,
        ]}
        locations={[0.18, 0.38, 0.52, 0.68, 0.82]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        pointerEvents="none"
      />

      <View
        className="absolute bottom-3.5 left-3.5 z-10 flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5"
        style={GLASS_PILL}
      >
        <SymbolView
          name={{
            ios: "mappin.and.ellipse",
            android: "location_on",
            web: "location_on",
          }}
          size={11}
          tintColor={palette.cream}
        />
        <Text
          variant="caption"
          weight="semibold"
          style={{ fontSize: 11, lineHeight: 14 }}
        >
          {slide.badgeLabel}
        </Text>
      </View>

      <View className="absolute bottom-0 right-0 top-0 z-10 w-[56%] justify-center px-3.5 py-4">
        <Text
          isUrdu
          variant="h2"
          weight="bold"
          tone="primary"
          className="text-right"
          numberOfLines={2}
          style={{ fontSize: 28, lineHeight: 40 }}
        >
          {slide.titleUrdu}
        </Text>

        <Text
          isUrdu
          variant="bodySmall"
          className="mt-2.5 text-right text-cream/90"
          numberOfLines={3}
          style={{ fontSize: 13, lineHeight: 20 }}
        >
          {slide.subtitleUrdu}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={slide.ctaLabel}
          onPress={onCtaPress}
          className="mt-5 self-end flex-row items-center gap-2 rounded-full bg-primary py-2.5 pl-4 pr-2 active:opacity-90"
          style={{
            shadowColor: palette.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text variant="caption" weight="bold" tone="background">
            {slide.ctaLabel}
          </Text>
          <View
            className="h-7 w-7 items-center justify-center rounded-full"
            style={{
              backgroundColor: withAlpha(palette.background, 0.88),
              borderWidth: 1,
              borderColor: withAlpha(palette.primary, 0.35),
            }}
          >
            <SymbolView
              name={{
                ios: "arrow.right",
                android: "arrow_forward",
                web: "arrow_forward",
              }}
              size={12}
              tintColor={palette.primary}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
