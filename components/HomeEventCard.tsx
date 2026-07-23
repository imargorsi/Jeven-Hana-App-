import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import {
  formatEventDate,
  formatEventDay,
  formatEventMonthAbbrev,
} from "@/lib/formatter.utils";
import { href } from "@/lib/navigation.utils";
import type { IEvent } from "@/types/event.types";

interface IHomeEventCardProps {
  event: IEvent;
  isToggling?: boolean;
  onToggleInterested: () => void;
  className?: string;
}

export function HomeEventCard({
  event,
  isToggling = false,
  onToggleInterested,
  className,
}: IHomeEventCardProps) {
  const router = useRouter();
  const month = formatEventMonthAbbrev(event.startsAt);
  const day = formatEventDay(event.startsAt);
  const isGoing = Boolean(event.isInterestedByMe);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href(`/events/${event.id}`))}
      className={cn(
        "rounded-card border border-cream/10 bg-surface p-3.5 active:opacity-95",
        className,
      )}
    >
      <View className="flex-row items-start gap-3">
        <View className="w-14 items-center justify-center rounded-card bg-background px-1.5 py-2">
          <Text
            variant="caption"
            weight="semibold"
            tone="muted"
            className="tracking-wide"
          >
            {month}
          </Text>
          <Text variant="h3" weight="bold" className="mt-0.5 text-cream">
            {day}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <Text variant="bodySmall" weight="semibold" numberOfLines={2}>
            {event.title}
          </Text>

          <View className="mt-1.5 flex-row items-center gap-1.5">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-primary/15">
              <SymbolView
                name={{
                  ios: "clock",
                  android: "schedule",
                  web: "schedule",
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
              {formatEventDate(event.startsAt)}
            </Text>
          </View>

          <View className="mt-1 flex-row items-center gap-1.5">
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
              {event.location.address}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-3 border-t border-cream/10 pt-2.5">
        <View className="flex-row items-center gap-1.5">
          <SymbolView
            name={{
              ios: "person.2",
              android: "group",
              web: "group",
            }}
            size={13}
            tintColor={palette.muted}
          />
          <Text variant="caption" tone="muted">
            {event.interestedCount} interested
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isGoing ? "Cancel going" : "Mark as going"}
          disabled={isToggling}
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleInterested();
          }}
          className={cn(
            "min-h-9 flex-row items-center gap-1.5 rounded-button border border-primary bg-transparent px-3 py-1.5 active:opacity-80",
            isGoing && "bg-primary/15",
            isToggling && "opacity-60",
          )}
        >
          {isToggling ? (
            <ActivityIndicator size="small" color={palette.primary} />
          ) : (
            <>
              <SymbolView
                name={{
                  ios: isGoing ? "checkmark.circle.fill" : "checkmark.circle",
                  android: isGoing ? "check_circle" : "radio_button_unchecked",
                  web: isGoing ? "check_circle" : "radio_button_unchecked",
                }}
                size={14}
                tintColor={palette.primary}
              />
              <Text variant="caption" weight="semibold" tone="primary">
                Going
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
}
