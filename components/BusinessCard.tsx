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
import { getBusinessOpenStatus } from "@/features/businesses/business.utils";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinessCategoryLabel } from "@/lib/services/businesses.service";
import type { IBusiness } from "@/types/business.types";

interface IBusinessCardProps {
  business: IBusiness;
  variant?: "horizontal" | "vertical" | "compact";
  className?: string;
}

const LIST_THUMB_WIDTH = 118;

export function BusinessCard({
  business,
  variant = "vertical",
  className,
}: IBusinessCardProps) {
  const router = useRouter();
  const isHorizontal = variant === "horizontal";
  const isCompact = variant === "compact";
  const categoryLabel = getBusinessCategoryLabel(business.categorySlug);
  const image = business.imageUrls[0];
  const metaLine = [categoryLabel, business.tags?.[0]]
    .filter(Boolean)
    .join(" · ");
  const openStatus = getBusinessOpenStatus(business.hours);

  if (isCompact) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(href(`/businesses/${business.id}`))}
        className={cn(
          "flex-row overflow-hidden rounded-card border border-cream/10 bg-surface active:opacity-95",
          className,
        )}
      >
        <View
          className="relative self-stretch overflow-hidden"
          style={{ width: LIST_THUMB_WIDTH }}
        >
          <Image
            source={toImageSource(image)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            contentFit="cover"
            transition={200}
          />
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
        </View>

        <View className="min-w-0 flex-1 justify-center gap-1.5 px-3.5 py-2.5">
          <View className="flex-row items-start gap-2">
            <Text
              variant="bodySmall"
              weight="semibold"
              className="min-w-0 flex-1"
              numberOfLines={1}
            >
              {business.name}
            </Text>
            <View className="rounded-full bg-background/50 p-1">
              <SaveButton
                type="business"
                id={business.id}
                size={17}
                color={palette.primary}
              />
            </View>
          </View>

          <View className="flex-row flex-wrap items-center gap-2">
            {business.isKaBest ? <KaBestBadge size="sm" /> : null}
            <RatingDisplay
              rating={business.rating}
              reviewCount={business.reviewCount}
            />
          </View>

          {metaLine ? (
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {metaLine}
            </Text>
          ) : null}

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
              {business.location.address}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(href(`/businesses/${business.id}`))}
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        isHorizontal ? "w-64" : "w-full",
        className,
      )}
    >
      <Image
        source={toImageSource(image)}
        style={{ width: "100%", height: isHorizontal ? 140 : 160 }}
        contentFit="cover"
        transition={200}
      />
      <View className="flex-row p-3.5">
        <View className="flex-1 gap-1.5 pr-2">
          <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
            {business.name}
          </Text>
          {business.isKaBest ? <KaBestBadge size="sm" /> : null}
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {business.location.address}
          </Text>
          <RatingDisplay
            rating={business.rating}
            reviewCount={business.reviewCount}
            className="mt-0.5"
          />
        </View>
        <SaveButton type="business" id={business.id} color={palette.primary} />
      </View>
    </Pressable>
  );
}
