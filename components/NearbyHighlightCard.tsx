import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { KaBestBadge } from "@/components/ui/Badges";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SaveButton } from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinessCategoryLabel } from "@/lib/services/businesses.service";
import type { IBusiness } from "@/types/business.types";

export const NEARBY_HIGHLIGHT_CARD_WIDTH = 224;
export const NEARBY_HIGHLIGHT_CARD_GAP = 12;
const IMAGE_HEIGHT = 144;

interface INearbyHighlightCardProps {
  business: IBusiness;
  className?: string;
}

export function NearbyHighlightCard({
  business,
  className,
}: INearbyHighlightCardProps) {
  const router = useRouter();
  const categoryLabel = getBusinessCategoryLabel(business.categorySlug);
  const showKaBest = Boolean(business.isKaBest);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href(`/businesses/${business.id}`))}
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        className,
      )}
      style={{ width: NEARBY_HIGHLIGHT_CARD_WIDTH }}
    >
      <View style={{ height: IMAGE_HEIGHT }}>
        <Image
          source={toImageSource(business.imageUrls[0])}
          style={{
            width: NEARBY_HIGHLIGHT_CARD_WIDTH,
            height: IMAGE_HEIGHT,
          }}
          contentFit="cover"
          transition={200}
        />
        {showKaBest ? (
          <View className="absolute left-2 top-2">
            <KaBestBadge />
          </View>
        ) : null}
        <View
          className="absolute right-2 top-2 rounded-full bg-background/55 p-1"
          onStartShouldSetResponder={() => true}
        >
          <SaveButton type="business" id={business.id} size={18} />
        </View>
      </View>

      <View className="gap-1.5 p-3.5">
        <View className="flex-row items-center gap-1.5">
          <SymbolView
            name={{
              ios: "building.2",
              android: "store",
              web: "store",
            }}
            size={12}
            tintColor={palette.primary}
          />
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {categoryLabel}
          </Text>
        </View>

        <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
          {business.name}
        </Text>

        <RatingDisplay
          rating={business.rating}
          reviewCount={business.reviewCount}
        />

        <Text variant="caption" tone="muted" numberOfLines={1}>
          {business.location.address}
        </Text>
      </View>
    </Pressable>
  );
}
