import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";

import {
  Button,
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
  Text,
} from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { formatRelativeTime } from "@/lib/formatter.utils";
import { href } from "@/lib/navigation.utils";
import { groupNotifications } from "@/lib/notificationGrouping.utils";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/services/notifications.service";
import type { INotification } from "@/types/notification.types";

function navigateForNotification(
  router: ReturnType<typeof useRouter>,
  n: INotification,
) {
  if (!n.targetType || !n.targetId) return;
  if (n.targetType === "post") router.push(href(`/community/${n.targetId}`));
  if (n.targetType === "event") router.push(href(`/events/${n.targetId}`));
  if (n.targetType === "business") router.push(href(`/businesses/${n.targetId}`));
  if (n.targetType === "place") router.push(href(`/places/${n.targetId}`));
  if (n.targetType === "best-of") router.push(href(`/best-of/${n.targetId}`));
}

export default function NotificationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const grouped = groupNotifications(query.data ?? []);

  if (query.isLoading) {
    return (
      <Screen withSafeArea={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (query.isError) {
    return (
      <Screen withSafeArea={false} className="px-4">
        <ErrorState onRetry={() => void query.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen withSafeArea={false}>
      <View className="flex-row items-center justify-between px-4 pb-2">
        <Text variant="bodySmall" tone="muted">
          {grouped.reduce((sum, g) => sum + g.unreadCount, 0)} unread
        </Text>
        <Button
          size="sm"
          variant="ghost"
          isLoading={markAll.isPending}
          onPress={() => markAll.mutate()}
        >
          Mark all read
        </Button>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.key}
        contentContainerClassName="px-4 pb-10"
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
            title="No notifications"
            description="You're all caught up."
          />
        }
      />
    </Screen>
  );
}
