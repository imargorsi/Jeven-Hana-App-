import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { SaveButton, ShareButton } from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { toImageSource } from "@/data/mocks/mock.utils";
import { cn } from "@/lib/cn.utils";
import { formatEventDate } from "@/lib/formatter.utils";
import { shareContent } from "@/lib/linking.utils";
import { href } from "@/lib/navigation.utils";
import type { IEvent } from "@/types/event.types";

interface IEventCardProps {
  event: IEvent;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function EventCard({
  event,
  variant = "vertical",
  className,
}: IEventCardProps) {
  const router = useRouter();
  const isHorizontal = variant === "horizontal";

  return (
    <Pressable
      onPress={() => router.push(href(`/events/${event.id}`))}
      className={cn(
        "overflow-hidden rounded-card border border-cream/10 bg-surface",
        isHorizontal ? "w-72" : "w-full",
        className,
      )}
    >
      <Image
        source={toImageSource(event.imageUrls[0])}
        className={cn("w-full bg-background", isHorizontal ? "h-36" : "h-40")}
        contentFit="cover"
      />
      <View className="p-3">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text variant="bodySmall" weight="semibold" numberOfLines={2}>
              {event.title}
            </Text>
            {event.titleUrdu ? (
              <Text variant="caption" tone="muted" isUrdu numberOfLines={1}>
                {event.titleUrdu}
              </Text>
            ) : null}
          </View>
          <View className="flex-row">
            <SaveButton type="event" id={event.id} />
            <ShareButton
              onPress={() =>
                void shareContent(`${event.title} — ${formatEventDate(event.startsAt)}`)
              }
            />
          </View>
        </View>
        <Text variant="caption" tone="primary" className="mt-2">
          {formatEventDate(event.startsAt)}
        </Text>
        <Text variant="caption" tone="muted" className="mt-1" numberOfLines={1}>
          {event.location.address}
        </Text>
      </View>
    </Pressable>
  );
}
