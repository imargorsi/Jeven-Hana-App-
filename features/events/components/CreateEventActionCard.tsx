import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { withAlpha } from "@/lib/color.utils";

interface ICreateEventActionCardProps {
  onPress: () => void;
}

/**
 * Profile-style action card: soft gradient, circular icon, title + subtitle,
 * outlined chevron.
 */
export function CreateEventActionCard({ onPress }: ICreateEventActionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="ایونٹ بنائیں"
      onPress={onPress}
      className="relative mb-6 overflow-hidden rounded-card border border-cream/15 bg-surface active:opacity-90"
      style={{
        shadowColor: palette.background,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={[
          withAlpha(palette.primary, 0.22),
          withAlpha(palette.primary, 0.06),
          withAlpha(palette.surface, 0),
        ]}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      <View className="flex-row items-center gap-3.5 px-4 py-4">
        <View
          className="h-12 w-12 items-center justify-center rounded-full bg-primary/15"
          style={{
            borderWidth: 1.5,
            borderColor: withAlpha(palette.primary, 0.45),
          }}
        >
          <SymbolView
            name={{
              ios: "calendar.badge.plus",
              android: "event",
              web: "event",
            }}
            size={22}
            tintColor={palette.primary}
          />
        </View>

        <View className="min-w-0 flex-1">
          <Text
            isUrdu
            variant="body"
            weight="bold"
            className="text-left"
            style={{ textAlign: "left" }}
          >
            ایونٹ بنائیں
          </Text>
          <Text
            isUrdu
            variant="caption"
            tone="muted"
            className="mt-1 text-left"
            style={{ textAlign: "left" }}
          >
            اپنے محلے کے لیے کوئی سرگرمی یا ایونٹ منعقد کریں
          </Text>
        </View>

        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{
            borderWidth: 1.5,
            borderColor: withAlpha(palette.cream, 0.28),
            backgroundColor: withAlpha(palette.cream, 0.06),
          }}
        >
          <SymbolView
            name={{
              ios: "chevron.right",
              android: "chevron_right",
              web: "chevron_right",
            }}
            size={18}
            tintColor={palette.cream}
          />
        </View>
      </View>
    </Pressable>
  );
}
