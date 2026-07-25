import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { IMG, toImageSource } from "@/data/mocks/mock.utils";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import {
  formatEventDay,
  formatEventMonthAbbrev,
  formatEventTime,
  formatEventWeekdayAbbrev,
} from "@/lib/formatter.utils";
import type { IEvent } from "@/types/event.types";

type TSymbolName = NonNullable<ComponentProps<typeof SymbolView>["name"]>;

interface IEventCardProps {
  event: IEvent;
  isToggling?: boolean;
  onToggleInterested?: () => void;
  canManage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  className?: string;
}

const CARD_SHADOW = {
  shadowColor: palette.background,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.45,
  shadowRadius: 18,
  elevation: 8,
} as const;

const GLASS_PILL = {
  backgroundColor: withAlpha(palette.cream, 0.08),
  borderWidth: 1,
  borderColor: withAlpha(palette.cream, 0.18),
} as const;

const GLASS_ICON = {
  backgroundColor: withAlpha(palette.primary, 0.14),
  borderWidth: 1,
  borderColor: withAlpha(palette.primary, 0.28),
} as const;

function StatCell({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: TSymbolName;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={cn(
        "min-w-0 flex-1 flex-row items-center gap-2.5 px-2.5 py-3",
        !isLast && "border-r border-cream/10",
      )}
    >
      <View
        className="h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={GLASS_ICON}
      >
        <SymbolView name={icon} size={16} tintColor={palette.primary} />
      </View>
      <View className="min-w-0 flex-1 justify-center">
        <Text
          variant="caption"
          tone="muted"
          style={{ fontSize: 10, lineHeight: 13 }}
        >
          {label}
        </Text>
        <Text
          variant="caption"
          weight="semibold"
          className="mt-0.5"
          numberOfLines={1}
          style={{ lineHeight: 16 }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/** Event list card — title + actions on one row; date before start time. */
export function EventCard({
  event,
  isToggling = false,
  onToggleInterested,
  canManage = false,
  onEdit,
  onDelete,
  isDeleting = false,
  className,
}: IEventCardProps) {
  const { requireAuth } = useRequireAuth();
  const month = formatEventMonthAbbrev(event.startsAt);
  const day = formatEventDay(event.startsAt);
  const weekday = formatEventWeekdayAbbrev(event.startsAt);
  const startsTime = formatEventTime(event.startsAt);
  const isGoing = Boolean(event.isGoingByMe);
  const description = event.description?.trim() || null;

  return (
    <View
      className={cn("overflow-hidden rounded-card bg-surface p-3.5", className)}
      style={[
        CARD_SHADOW,
        {
          borderWidth: 1,
          borderColor: withAlpha(palette.cream, 0.14),
        },
      ]}
    >
      <Image
        source={toImageSource(IMG.businessFallback)}
        contentFit="cover"
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: 0.30,
        }}
      />

      {/* Top: title · edit · delete · Go */}
      <View className="relative z-10">
        <View className="flex-row items-center gap-2">
          <Text
            variant="h3"
            weight="bold"
            className="min-w-0 flex-1"
            numberOfLines={2}
          >
            {event.title}
          </Text>

          {canManage ? (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit Event"
                disabled={isDeleting}
                onPress={onEdit}
                className="h-8 w-8 shrink-0 items-center justify-center rounded-xl active:opacity-80"
                style={GLASS_PILL}
              >
                <SymbolView
                  name={{
                    ios: "pencil",
                    android: "edit",
                    web: "edit",
                  }}
                  size={14}
                  tintColor={palette.cream}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete Event"
                disabled={isDeleting}
                onPress={onDelete}
                className="h-8 w-8 shrink-0 items-center justify-center rounded-xl active:opacity-80"
                style={{
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
                    size={14}
                    tintColor={palette.error}
                  />
                )}
              </Pressable>
            </>
          ) : null}

          {onToggleInterested ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isGoing ? "Cancel Going" : "Mark as Going"}
              accessibilityState={{ selected: isGoing }}
              disabled={isToggling}
              onPress={() => requireAuth(() => onToggleInterested?.())}
              className={cn(
                "h-9 shrink-0 flex-row items-center gap-1 overflow-hidden rounded-full px-3 active:opacity-90",
                isToggling && "opacity-60",
              )}
              style={{
                ...GLASS_PILL,
                borderColor: withAlpha(palette.primary, 0.35),
                backgroundColor: withAlpha(palette.primary, 0.14),
              }}
            >
              {isToggling ? (
                <ActivityIndicator size="small" color={palette.primary} />
              ) : (
                <>
                  <SymbolView
                    name={{
                      ios: isGoing ? "checkmark" : "arrow.right",
                      android: isGoing ? "check" : "arrow_forward",
                      web: isGoing ? "check" : "arrow_forward",
                    }}
                    size={13}
                    tintColor={palette.primary}
                  />
                  <Text variant="caption" weight="bold" tone="primary">
                    {isGoing ? "Going" : "Go"}
                  </Text>
                </>
              )}
            </Pressable>
          ) : null}
        </View>

        {/* Location */}
        <View className="mt-2 flex-row items-center gap-1.5">
          <SymbolView
            name={{
              ios: "mappin.and.ellipse",
              android: "location_on",
              web: "location_on",
            }}
            size={13}
            tintColor={palette.primary}
          />
          <Text variant="caption" className="min-w-0 flex-1" numberOfLines={1}>
            {event.location}
          </Text>
        </View>

        {description ? (
          <Text
            variant="bodySmall"
            tone="muted"
            className="mt-2.5 leading-5"
            numberOfLines={3}
          >
            {description}
          </Text>
        ) : null}

        {/* Date · Starts · Interested */}
        <View
          className="mt-3.5 flex-row overflow-hidden rounded-2xl"
          style={{
            backgroundColor: withAlpha(palette.background, 0.55),
            borderWidth: 1,
            borderColor: withAlpha(palette.cream, 0.12),
            shadowColor: palette.background,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <StatCell
            icon={{
              ios: "calendar",
              android: "calendar_today",
              web: "calendar_today",
            }}
            label={weekday || "Date"}
            value={`${day} ${month}`.trim() || "—"}
          />
          <StatCell
            icon={{
              ios: "play.circle",
              android: "play_circle",
              web: "play_circle",
            }}
            label="Starts"
            value={startsTime || "—"}
          />
          <StatCell
            icon={{
              ios: "person.2",
              android: "group",
              web: "group",
            }}
            label="Interested"
            value={String(event.interestedCount)}
            isLast
          />
        </View>
      </View>
    </View>
  );
}
