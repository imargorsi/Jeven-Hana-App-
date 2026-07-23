import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Image, Pressable, View } from "react-native";

import { SearchInput } from "@/components/ui/SearchInput";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getNotifications } from "@/lib/services/notifications.service";

interface IAppHeaderProps {
  className?: string;
  /** Hide the inline search (e.g. on the dedicated Search screen). */
  hideSearch?: boolean;
}

/**
 * Global production header — same on every authenticated screen:
 * [Logo] · [Search] · [Notifications]
 */
export function AppHeader({ className, hideSearch = false }: IAppHeaderProps) {
  const router = useRouter();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 30_000,
  });

  const unreadCount =
    notificationsQuery.data?.filter((n) => !n.isRead).length ?? 0;

  return (
    <View
      className={cn(
        "flex-row items-center gap-2 border-b border-cream/10 pb-3 pt-1",
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Jevan Hana home"
        onPress={() => router.push(href("/(tabs)"))}
        className="shrink-0 active:opacity-80"
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ height: 52, width: 52 }}
          resizeMode="contain"
          accessibilityLabel="Jevan Hana logo"
        />
      </Pressable>

      {!hideSearch ? (
        <View className="min-w-0 flex-1">
          <SearchInput
            value=""
            onChangeText={() => undefined}
            placeholder="Search businesses, places, events…"
            onPress={() => router.push(href("/search"))}
            className="min-h-10 rounded-chip border-cream/20 bg-surface/80 px-2.5"
          />
        </View>
      ) : (
        <View className="flex-1" />
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        hitSlop={8}
        className="h-10 w-10 shrink-0 items-center justify-center active:opacity-70"
        onPress={() => router.push(href("/notifications"))}
      >
        <SymbolView
          name={{
            ios: "bell",
            android: "notifications_none",
            web: "notifications",
          }}
          size={22}
          tintColor={palette.primary}
        />
        {unreadCount > 0 ? (
          <View className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        ) : null}
      </Pressable>
    </View>
  );
}
