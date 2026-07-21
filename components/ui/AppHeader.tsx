import { useRouter } from "expo-router";
import { Image , View } from "react-native";

import { IconButton } from "@/components/ui/IconButton";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";

interface IAppHeaderProps {
  greeting?: string;
  title?: string;
  showNotifications?: boolean;
  unreadCount?: number;
  className?: string;
}

export function AppHeader({
  greeting,
  title = "Jevan Hana",
  showNotifications = true,
  unreadCount = 0,
  className,
}: IAppHeaderProps) {
  const router = useRouter();

  return (
    <View className={cn("mb-4 flex-row items-center justify-between", className)}>
      <View className="flex-1 flex-row items-center gap-3">
        <Image
          source={require("@/assets/images/app-icon-transparent.png")}
          className="h-12 w-12"
          resizeMode="contain"
          accessibilityLabel="Jevan Hana"
        />
        <View className="flex-1">
          <Text variant="h3">{title}</Text>
          {greeting ? (
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {greeting}
            </Text>
          ) : null}
        </View>
      </View>
      {showNotifications ? (
        <IconButton
          name={{
            ios: "bell.fill",
            android: "notifications",
            web: "notifications",
          }}
          badgeCount={unreadCount}
          onPress={() => router.push(href("/notifications"))}
        />
      ) : null}
    </View>
  );
}
