import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import type { IHomeHeroSlide } from "@/features/home/home.slides";
import { withAlpha } from "@/lib/color.utils";

export const HERO_SLIDE_HEIGHT = 200;

const GLASS_PILL = {
  backgroundColor: withAlpha(palette.background, 0.72),
  borderWidth: 1,
  borderColor: withAlpha(palette.cream, 0.22),
} as const;

interface IHomeHeroSlideCardProps {
  slide: IHomeHeroSlide;
  width: number;
}

/** Single hero slide — photo fades into navy; clean copy column (no ornaments). */
export function HomeHeroSlideCard({ slide, width }: IHomeHeroSlideCardProps) {
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

      <View className="absolute bottom-0 right-0 top-0 z-10 w-[78%] justify-center px-3.5 py-3">
        <Text
          isUrdu
          variant="h2"
          weight="bold"
          tone="primary"
          className="w-full text-right"
          style={{
            fontSize: 30,
            lineHeight: 40,
            writingDirection: "rtl",
            textAlign: "right",
          }}
        >
          {slide.titleUrdu}
        </Text>

        <Text
          isUrdu
          variant="body"
          className="mt-2 w-full text-right text-cream/90"
          numberOfLines={2}
          style={{
            fontSize: 17,
            lineHeight: 25,
            writingDirection: "rtl",
            textAlign: "right",
          }}
        >
          {slide.subtitleUrdu}
        </Text>
      </View>
    </View>
  );
}
