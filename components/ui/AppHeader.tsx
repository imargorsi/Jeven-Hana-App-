import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Image, Pressable, View } from "react-native";

import { SearchInput } from "@/components/ui/SearchInput";
import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getNotifications } from "@/lib/services/notifications.service";

interface IAppHeaderProps {
  className?: string;
  /** Hide the inline search (e.g. on the dedicated Search screen). */
  hideSearch?: boolean;
}

type TGetToken = () => Promise<string | null>;

/**
 * Global header — logo · search (public) · notifications (account).
 */
export function AppHeader(props: IAppHeaderProps) {
  if (!isClerkConfigured) {
    return (
      <AppHeaderView
        {...props}
        getToken={async () => null}
        userId={null}
        isSignedIn={false}
        requireAuth={(action) => {
          action?.();
          return true;
        }}
      />
    );
  }

  return <AppHeaderWithClerk {...props} />;
}

function AppHeaderWithClerk(props: IAppHeaderProps) {
  const { getToken, userId } = useAuth();
  const { requireAuth, isSignedIn } = useRequireAuth();

  return (
    <AppHeaderView
      {...props}
      getToken={getToken}
      userId={userId}
      isSignedIn={isSignedIn}
      requireAuth={requireAuth}
    />
  );
}

interface IAppHeaderViewProps extends IAppHeaderProps {
  getToken: TGetToken;
  userId: string | null | undefined;
  isSignedIn: boolean;
  requireAuth: (action?: () => void) => boolean;
}

function AppHeaderView({
  className,
  hideSearch = false,
  getToken,
  userId,
  isSignedIn,
  requireAuth,
}: IAppHeaderViewProps) {
  const router = useRouter();

  const notificationsQuery = useQuery({
    queryKey: ["notifications", userId ?? "guest"],
    queryFn: () => getNotifications(getToken),
    staleTime: 30_000,
    enabled: isSignedIn && Boolean(userId),
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
        accessibilityLabel="Jevan Hana Home"
        onPress={() => router.push(href("/(tabs)"))}
        className="shrink-0 active:opacity-80"
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ height: 52, width: 52 }}
          resizeMode="contain"
          accessibilityLabel="Jevan Hana Logo"
        />
      </Pressable>

      {!hideSearch ? (
        <View className="min-w-0 flex-1">
          <SearchInput
            value=""
            onChangeText={() => undefined}
            placeholder="Search businesses, events…"
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
        onPress={() =>
          requireAuth(() => router.push(href("/notifications")))
        }
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
        {isSignedIn && unreadCount > 0 ? (
          <View className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        ) : null}
      </Pressable>
    </View>
  );
}
