import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";

const QUICK_ACCESS_ITEMS = [
  {
    id: "businesses",
    labelUrdu: "دکانیں",
    icon: {
      ios: "storefront" as const,
      android: "storefront" as const,
      web: "store" as const,
    },
    route: "/businesses",
  },
  {
    id: "places",
    labelUrdu: "مقامات",
    icon: {
      ios: "mappin.and.ellipse" as const,
      android: "place" as const,
      web: "place" as const,
    },
    route: "/places",
  },
  {
    id: "events",
    labelUrdu: "تقریبات",
    icon: {
      ios: "calendar" as const,
      android: "event" as const,
      web: "event" as const,
    },
    route: "/(tabs)/events",
  },
  {
    id: "community",
    labelUrdu: "کمیونٹی",
    icon: {
      ios: "megaphone" as const,
      android: "campaign" as const,
      web: "campaign" as const,
    },
    route: "/(tabs)/community",
  },
  {
    id: "saved",
    labelUrdu: "پسندیدہ",
    icon: {
      ios: "heart" as const,
      android: "favorite_border" as const,
      web: "favorite" as const,
    },
    route: "/saved",
  },
];

interface IHomeQuickAccessProps {
  className?: string;
}

export function HomeQuickAccess({ className }: IHomeQuickAccessProps) {
  const router = useRouter();

  return (
    <View className={cn("mb-6", className)}>
      <SectionHeader
        title="Quick Access"
        actionLabel="View All"
        onActionPress={() => router.push(href("/(tabs)/explore"))}
      />
      <View className="flex-row gap-2.5">
        {QUICK_ACCESS_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.labelUrdu}
            onPress={() => router.push(href(item.route))}
            className="min-h-[92px] flex-1 items-center justify-center rounded-card border border-cream/10 bg-surface px-1 py-3 active:opacity-90"
          >
            <SymbolView
              name={item.icon}
              size={26}
              tintColor={palette.primary}
            />
            <Text
              isUrdu
              variant="caption"
              tone="primary"
              weight="medium"
              className="mt-2 text-center"
              numberOfLines={1}
            >
              {item.labelUrdu}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
