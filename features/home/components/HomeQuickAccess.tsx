import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
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
    route: "/(tabs)/explore",
  },
  {
    id: "about",
    labelUrdu: "متعلق",
    icon: {
      ios: "info.circle" as const,
      android: "info" as const,
      web: "info" as const,
    },
    route: "/about",
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
  const { requireAuth } = useRequireAuth();

  return (
    <View className={cn(className)}>
      <SectionHeader isUrdu title="فوری رسائی" />
      <View className="flex-row gap-2">
        {QUICK_ACCESS_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={item.labelUrdu}
            onPress={() => {
              if (item.id === "saved") {
                requireAuth(() => router.push(href(item.route)));
                return;
              }
              router.push(href(item.route));
            }}
            className="min-h-[84px] flex-1 items-center justify-center rounded-card bg-surface px-1 py-2.5 active:opacity-90"
          >
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary/15">
              <SymbolView
                name={item.icon}
                size={22}
                tintColor={palette.primary}
              />
            </View>
            <Text
              isUrdu
              variant="caption"
              tone="primary"
              weight="medium"
              className="mt-1.5 text-center"
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
