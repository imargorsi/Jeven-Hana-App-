import { useAuth } from "@clerk/expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";

import {
  Button,
  EmptyState,
  ErrorState,
  NotificationListSkeleton,
  Screen,
  Text,
} from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { ClerkSignedInGuard } from "@/features/auth/components/ClerkSignedInGuard";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { href } from "@/lib/navigation.utils";
import { groupNotifications } from "@/lib/notificationGrouping.utils";
import {
  getNotificationsPage,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/services/notifications.service";
import type { INotification } from "@/types/notification.types";

function navigateForNotification(
  router: ReturnType<typeof useRouter>,
  n: INotification,
) {
  if (n.targetType === "about") {
    router.push(href("/about"));
    return;
  }
  if (!n.targetType || !n.targetId) return;
  if (n.targetType === "post") router.push(href("/(tabs)/community"));
  if (n.targetType === "event") router.push(href("/(tabs)/events"));
  if (n.targetType === "business")
    router.push(href(`/businesses/${n.targetId}`));
  if (n.targetType === "place") router.push(href("/(tabs)/explore"));
}

function invalidateNotificationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  void queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
}

function NotificationsContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  const query = useQuery({
    queryKey: ["notifications", userId ?? "guest"],
    queryFn: () => getNotificationsPage(getToken),
    staleTime: 60_000,
    enabled: Boolean(userId),
  });

  const markAll = useMutation({
    mutationFn: () => markAllNotificationsRead(getToken),
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });

  const markOne = useMutation({
    mutationFn: (id: string) => markNotificationRead(id, getToken),
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });

  const notifications = query.data?.notifications ?? [];
  const unreadFromApi = query.data?.unreadCount ?? 0;
  const grouped = groupNotifications(notifications);

  if (query.isLoading) {
    return (
      <Screen title="Notifications" showBack>
        <NotificationListSkeleton />
      </Screen>
    );
  }

  if (query.isError) {
    return (
      <Screen title="Notifications" showBack>
        <ErrorState onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen
      title="Notifications"
      showBack
      headerRight={
        <Button
          size="sm"
          variant="ghost"
          isLoading={markAll.isPending}
          onPress={() => markAll.mutate()}
        >
          Mark All Read
        </Button>
      }
    >
      <View className="px-4 pb-2">
        <Text variant="bodySmall" tone="muted">
          {unreadFromApi} unread
        </Text>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.key}
        contentContainerClassName="px-4 pb-10"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => {
          const n = item.latest;
          const isUnread = item.unreadCount > 0;
          return (
            <Pressable
              onPress={() => {
                item.items.forEach((x) => {
                  if (!x.isRead) markOne.mutate(x.id);
                });
                navigateForNotification(router, n);
              }}
              className={`rounded-card border p-4 ${
                isUnread
                  ? "border-primary/30 bg-primary/10"
                  : "border-cream/10 bg-surface"
              }`}
            >
              <View className="flex-row gap-3">
                <Avatar
                  uri={n.actorAvatarUrl}
                  name={n.actorName ?? "JH"}
                  size="sm"
                />
                <View className="flex-1">
                  <Text variant="bodySmall" weight="semibold">
                    {item.items.length > 1
                      ? `${n.title} (${item.items.length})`
                      : n.title}
                  </Text>
                  <Text variant="caption" tone="muted" className="mt-1">
                    {n.body}
                  </Text>
                  <Text variant="caption" tone="muted" className="mt-2">
                    {formatRelativeTime(n.createdAt)}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="No Notifications"
            description="You're all caught up."
          />
        }
      />
    </Screen>
  );
}

export default function NotificationsScreen() {
  if (!isClerkConfigured) {
    return (
      <Screen title="Notifications" showBack>
        <EmptyState
          title="Sign In Required"
          description="Configure Clerk to use notifications."
        />
      </Screen>
    );
  }

  return (
    <ClerkSignedInGuard redirectHref="/register">
      <NotificationsContent />
    </ClerkSignedInGuard>
  );
}
