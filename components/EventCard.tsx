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
import type { IEvent } from "@/types/event.types";

interface IEventCardProps {
  event: IEvent;
  isToggling?: boolean;
  onToggleInterested?: () => void;
  className?: string;
}

/** Shared list card used on Events (no detail screen in v1). */
export function EventCard({
  event,
  isToggling = false,
  onToggleInterested,
  className,
}: IEventCardProps) {
  const month = formatEventMonthAbbrev(event.startsAt);
  const day = formatEventDay(event.startsAt);
  const isGoing = Boolean(event.isInterestedByMe);

  return (
    <View
      className={cn(
        "rounded-card border border-cream/10 bg-surface p-3.5",
        className,
      )}
    >
      <View className="flex-row items-start gap-3">
        <View className="w-12 items-center justify-center rounded-xl bg-background px-1 py-2">
          <Text
            variant="caption"
            weight="semibold"
            tone="primary"
            className="tracking-wide"
            style={{ fontSize: 10, lineHeight: 12 }}
          >
            {month}
          </Text>
          <Text variant="h3" weight="bold" className="mt-0.5 text-cream">
            {day}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start gap-2">
            <Text
              variant="bodySmall"
              weight="semibold"
              className="min-w-0 flex-1"
              numberOfLines={2}
            >
              {event.title}
            </Text>

            {onToggleInterested ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isGoing ? "Cancel going" : "Mark as going"}
                accessibilityState={{ selected: isGoing }}
                disabled={isToggling}
                hitSlop={6}
                onPress={onToggleInterested}
                className={cn(
                  "h-8 min-w-8 items-center justify-center rounded-full px-2.5 active:opacity-80",
                  isGoing ? "bg-primary" : "bg-primary/15",
                  isToggling && "opacity-60",
                )}
              >
                {isToggling ? (
                  <ActivityIndicator
                    size="small"
                    color={isGoing ? palette.background : palette.primary}
                  />
                ) : (
                  <View className="flex-row items-center gap-1">
                    <SymbolView
                      name={{
                        ios: isGoing
                          ? "checkmark.circle.fill"
                          : "plus.circle",
                        android: isGoing ? "check_circle" : "add_circle",
                        web: isGoing ? "check_circle" : "add_circle",
                      }}
                      size={14}
                      tintColor={
                        isGoing ? palette.background : palette.primary
                      }
                    />
                    <Text
                      variant="caption"
                      weight="bold"
                      tone={isGoing ? "background" : "primary"}
                    >
                      {isGoing ? "Going" : "Go"}
                    </Text>
                  </View>
                )}
              </Pressable>
            ) : null}
          </View>

          <View className="mt-1.5 flex-row items-center gap-1.5">
            <SymbolView
              name={{
                ios: "clock",
                android: "schedule",
                web: "schedule",
              }}
              size={12}
              tintColor={palette.muted}
            />
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
            <SymbolView
              name={{
                ios: "mappin.and.ellipse",
                android: "location_on",
                web: "location_on",
              }}
              size={12}
              tintColor={palette.muted}
            />
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

      <View className="mt-3 flex-row items-center gap-1.5 border-t border-cream/10 pt-2.5">
        <Text variant="caption" tone="muted">
          Interested
        </Text>
        <View className="h-1 w-1 rounded-full bg-muted" />
        <Text variant="caption" weight="medium" tone="muted">
          {event.interestedCount}
        </Text>
      </View>
    </View>
  );
}
