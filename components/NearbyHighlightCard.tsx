import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { FeaturedIcon } from "@/components/ui/Badges";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SaveButton } from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import { getBusinessOpenStatus } from "@/features/businesses/business.utils";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinessCategoryLabel } from "@/lib/services/businesses.service";
import type { IBusiness } from "@/types/business.types";

export const NEARBY_HIGHLIGHT_CARD_WIDTH = 248;
export const NEARBY_HIGHLIGHT_CARD_GAP = 14;
const IMAGE_HEIGHT = 128;

interface INearbyHighlightCardProps {
  business: IBusiness;
  className?: string;
}

export function NearbyHighlightCard({
  business,
  className,
}: INearbyHighlightCardProps) {
  const router = useRouter();
  const categoryLabel = getBusinessCategoryLabel(business.category);
  const openStatus = getBusinessOpenStatus(business.hours);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={business.name}
      onPress={() => router.push(href(`/businesses/${business.id}`))}
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface active:opacity-95",
        className,
      )}
      style={{ width: NEARBY_HIGHLIGHT_CARD_WIDTH }}
    >
      <View className="relative overflow-hidden" style={{ height: IMAGE_HEIGHT }}>
        <Image
          source={toImageSource(business.imageUrls[0])}
          style={{
            width: NEARBY_HIGHLIGHT_CARD_WIDTH,
            height: IMAGE_HEIGHT,
          }}
          contentFit="cover"
          transition={200}
        />
        {openStatus.hasHours ? (
          <View className="absolute bottom-1.5 left-1.5 rounded-chip bg-background/75 px-1.5 py-0.5">
            <Text
              variant="caption"
              weight="semibold"
              tone={openStatus.isOpen ? "success" : "muted"}
              style={{ fontSize: 10, lineHeight: 12 }}
            >
              {openStatus.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        ) : null}
        <View className="absolute right-1.5 top-1.5">
          <SaveButton type="business" id={business.id} size={15} />
        </View>
      </View>

      <View className="gap-1.5 px-3.5 py-2.5">
        <View className="flex-row items-center gap-1">
          <Text
            variant="bodySmall"
            weight="semibold"
            className="shrink"
            numberOfLines={1}
          >
            {business.name}
          </Text>
          {business.isFeatured ? <FeaturedIcon size={15} /> : null}
        </View>

        <RatingDisplay
          rating={business.rating}
          reviewCount={business.reviewCount}
        />

        <Text variant="caption" tone="muted" numberOfLines={1}>
          {categoryLabel}
        </Text>

        <View className="flex-row items-center gap-1.5">
          <View className="h-5 w-5 items-center justify-center rounded-full bg-primary/15">
            <SymbolView
              name={{
                ios: "mappin.and.ellipse",
                android: "location_on",
                web: "location_on",
              }}
              size={11}
              tintColor={palette.primary}
            />
          </View>
          <Text
            variant="caption"
            tone="muted"
            className="min-w-0 flex-1"
            numberOfLines={1}
          >
            {business.address}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
