import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { RankBadge } from "@/components/ui/Badges";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { SaveButton } from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { toImageSource } from "@/data/mocks/mock.utils";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import type { IBestOfListing } from "@/types/best-of.types";

interface IBestOfCardProps {
  listing: IBestOfListing;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function BestOfCard({
  listing,
  variant = "horizontal",
  className,
}: IBestOfCardProps) {
  const router = useRouter();
  const isHorizontal = variant === "horizontal";

  return (
    <Pressable
      onPress={() => router.push(href(`/best-of/${listing.id}`))}
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        isHorizontal ? "w-72" : "w-full",
        className,
      )}
    >
      <View>
        <Image
          source={toImageSource(listing.imageUrls[0])}
          className={cn("w-full bg-background", isHorizontal ? "h-36" : "h-44")}
          contentFit="cover"
        />
        <RankBadge rank={listing.rank} className="absolute left-3 top-3" />
      </View>
      <View className="flex-row p-3">
        <View className="flex-1 pr-2">
          <Text variant="bodySmall" weight="semibold" numberOfLines={1}>
            {listing.title}
          </Text>
          <Text variant="caption" tone="muted" className="mt-0.5" numberOfLines={1}>
            {listing.subtitle}
          </Text>
          <RatingDisplay rating={listing.rating} className="mt-1.5" />
        </View>
        <SaveButton type="best-of" id={listing.id} />
      </View>
    </Pressable>
  );
}
