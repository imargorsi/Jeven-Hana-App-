import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";

import { FeaturedIcon } from "@/components/ui/Badges";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SaveButton } from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { getBusinessOpenStatus } from "@/features/businesses/business.utils";
import { getExploreCategoryIcon } from "@/features/explore/explore.icons";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import { toImageSource } from "@/lib/image.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinessCategoryLabel } from "@/lib/services/businesses.service";
import type { IBusiness } from "@/types/business.types";

interface IBusinessCardProps {
  business: IBusiness;
  /** `list` = Explore full-bleed card; `horizontal` = narrow carousel. */
  variant?: "list" | "horizontal" | "vertical" | "compact";
  className?: string;
  canManage?: boolean;
  isDeleting?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LIST_IMAGE_HEIGHT = 152;
const HORIZONTAL_IMAGE_HEIGHT = 140;

export function BusinessCard({
  business,
  variant = "list",
  className,
  canManage = false,
  isDeleting = false,
  onEdit,
  onDelete,
}: IBusinessCardProps) {
  const router = useRouter();
  const isHorizontal = variant === "horizontal";
  /** Explore + saved list: full image on top. */
  const isList =
    variant === "list" || variant === "compact" || variant === "vertical";
  const categoryLabel = getBusinessCategoryLabel(business.category);
  const categoryIcon = getExploreCategoryIcon(business.category);
  const image = business.imageUrls[0];
  const openStatus = getBusinessOpenStatus(business.hours);
  const phone = business.phone?.trim() || null;
  const showManage = canManage && Boolean(onEdit || onDelete);

  if (isList) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={business.name}
        onPress={() => router.push(href(`/businesses/${business.id}`))}
        className={cn(
          "overflow-hidden rounded-card border border-cream/10 bg-surface active:opacity-95",
          className,
        )}
      >
        <View
          className="relative w-full overflow-hidden"
          style={{ height: LIST_IMAGE_HEIGHT }}
        >
          <Image
            source={toImageSource(image)}
            style={{ width: "100%", height: LIST_IMAGE_HEIGHT }}
            contentFit="cover"
            transition={200}
          />

          <View className="absolute left-2.5 top-2.5 flex-row items-center gap-1.5 rounded-full border border-primary/35 bg-background/50 px-2.5 py-1.5">
            <SymbolView
              name={categoryIcon}
              size={13}
              tintColor={palette.primary}
            />
            <Text
              variant="caption"
              weight="semibold"
              tone="primary"
              style={{ fontSize: 11, lineHeight: 14 }}
            >
              {categoryLabel}
            </Text>
          </View>

          <View className="absolute right-2.5 top-2.5 flex-row items-center gap-1.5">
            {showManage && onEdit ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit Listing"
                disabled={isDeleting}
                hitSlop={6}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onEdit();
                }}
                className="items-center justify-center rounded-full active:opacity-80"
                style={{
                  width: 34,
                  height: 34,
                  backgroundColor: withAlpha(palette.cream, 0.1),
                  borderWidth: 1,
                  borderColor: withAlpha(palette.cream, 0.2),
                }}
              >
                <SymbolView
                  name={{
                    ios: "pencil",
                    android: "edit",
                    web: "edit",
                  }}
                  size={16}
                  tintColor={palette.cream}
                />
              </Pressable>
            ) : null}
            {showManage && onDelete ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete Listing"
                disabled={isDeleting}
                hitSlop={6}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onDelete?.();
                }}
                className="items-center justify-center rounded-full active:opacity-80"
                style={{
                  width: 34,
                  height: 34,
                  backgroundColor: withAlpha(palette.error, 0.12),
                  borderWidth: 1,
                  borderColor: withAlpha(palette.error, 0.35),
                }}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={palette.error} />
                ) : (
                  <SymbolView
                    name={{
                      ios: "trash",
                      android: "delete",
                      web: "delete",
                    }}
                    size={16}
                    tintColor={palette.error}
                  />
                )}
              </Pressable>
            ) : null}
            <SaveButton type="business" id={business.id} size={16} />
          </View>

          {openStatus.hasHours ? (
            <View className="absolute bottom-2.5 left-2.5 rounded-chip bg-background/75 px-2 py-0.5">
              <Text
                variant="caption"
                weight="semibold"
                tone={openStatus.isOpen ? "success" : "muted"}
              >
                {openStatus.isOpen ? "Open" : "Closed"}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-1.5 px-3.5 py-2.5">
          <View className="flex-row items-center gap-2">
            <View className="min-w-0 flex-1 flex-row items-center gap-1">
              <Text
                variant="bodySmall"
                weight="semibold"
                className="shrink"
                numberOfLines={1}
              >
                {business.name}
              </Text>
              {business.isFeatured ? <FeaturedIcon size={16} /> : null}
            </View>
            <View className="shrink-0">
              <RatingDisplay
                rating={business.rating}
                reviewCount={business.reviewCount}
              />
            </View>
          </View>

          <View className="gap-1">
            <View className="flex-row items-center gap-1">
              <SymbolView
                name={{
                  ios: "mappin.and.ellipse",
                  android: "location_on",
                  web: "location_on",
                }}
                size={11}
                tintColor={palette.primary}
              />
              <Text
                variant="caption"
                tone="muted"
                className="min-w-0 flex-1"
                numberOfLines={1}
              >
                {business.address}
              </Text>
            </View>
            {phone ? (
              <View className="flex-row items-center gap-1">
                <SymbolView
                  name={{
                    ios: "phone.fill",
                    android: "call",
                    web: "call",
                  }}
                  size={11}
                  tintColor={palette.primary}
                />
                <Text
                  variant="caption"
                  tone="muted"
                  className="min-w-0 flex-1"
                  numberOfLines={1}
                >
                  {phone}
                </Text>
              </View>
            ) : null}
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
        style={{
          width: "100%",
          height: isHorizontal ? HORIZONTAL_IMAGE_HEIGHT : LIST_IMAGE_HEIGHT,
        }}
        contentFit="cover"
        transition={200}
      />
      <View className="gap-1.5 p-3.5">
        <View className="flex-row items-start gap-2">
          <View className="min-w-0 flex-1 flex-row items-center gap-1">
            <Text
              variant="bodySmall"
              weight="semibold"
              className="shrink"
              numberOfLines={1}
            >
              {business.name}
            </Text>
            {business.isFeatured ? <FeaturedIcon size={16} /> : null}
          </View>
          <SaveButton type="business" id={business.id} />
        </View>
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {business.address}
        </Text>
        <RatingDisplay
          rating={business.rating}
          reviewCount={business.reviewCount}
        />
      </View>
    </Pressable>
  );
}
