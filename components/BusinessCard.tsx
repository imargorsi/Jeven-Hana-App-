import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SaveButton } from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import type { IBusiness } from "@/types/business.types";

interface IBusinessCardProps {
  business: IBusiness;
  variant?: "horizontal" | "vertical" | "compact";
  className?: string;
}

export function BusinessCard({
  business,
  variant = "vertical",
  className,
}: IBusinessCardProps) {
  const router = useRouter();
  const isHorizontal = variant === "horizontal";
  const isCompact = variant === "compact";

  return (
    <Pressable
      onPress={() => router.push(href(`/businesses/${business.id}`))}
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        isHorizontal ? "w-64" : "w-full",
        className,
      )}
    >
      {!isCompact ? (
        <Image
          source={{ uri: business.imageUrls[0] }}
          className={cn("w-full bg-background", isHorizontal ? "h-36" : "h-40")}
          contentFit="cover"
        />
      ) : null}
      <View className="flex-row p-3">
        <View className="flex-1 pr-2">
          <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
            {business.name}
          </Text>
          {business.nameUrdu ? (
            <Text variant="caption" tone="muted" isUrdu numberOfLines={1}>
              {business.nameUrdu}
            </Text>
          ) : null}
          <Text variant="caption" tone="muted" className="mt-1" numberOfLines={1}>
            {business.location.address}
          </Text>
          <RatingDisplay
            rating={business.rating}
            reviewCount={business.reviewCount}
            className="mt-1.5"
          />
        </View>
        <SaveButton type="business" id={business.id} />
      </View>
    </Pressable>
  );
}
