import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { FeaturedIcon } from "@/components/ui/Badges";
import { SaveButton } from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { toImageSource } from "@/data/mocks/mock.utils";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import type { IPlace } from "@/types/place.types";

interface IPlaceCardProps {
  place: IPlace;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function PlaceCard({
  place,
  variant = "vertical",
  className,
}: IPlaceCardProps) {
  const router = useRouter();
  const isHorizontal = variant === "horizontal";

  return (
    <Pressable
      onPress={() => router.push(href("/(tabs)/explore"))}
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        isHorizontal ? "w-64" : "w-full",
        className,
      )}
    >
      <Image
        source={toImageSource(place.imageUrls[0])}
        className={cn("w-full bg-background", isHorizontal ? "h-36" : "h-40")}
        contentFit="cover"
      />
      <View className="flex-row p-3">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-1">
            <Text
              variant="bodySmall"
              weight="semibold"
              className="shrink"
              numberOfLines={1}
            >
              {place.name}
            </Text>
            {place.isFeatured ? <FeaturedIcon size={15} /> : null}
          </View>
          {place.nameUrdu ? (
            <Text variant="caption" tone="muted" isUrdu numberOfLines={1}>
              {place.nameUrdu}
            </Text>
          ) : null}
          <Text
            variant="caption"
            tone="muted"
            className="mt-1"
            numberOfLines={2}
          >
            {place.description}
          </Text>
        </View>
        <SaveButton type="place" id={place.id} />
      </View>
    </Pressable>
  );
}
