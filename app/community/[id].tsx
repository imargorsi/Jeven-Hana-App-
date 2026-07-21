import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  View,
} from "react-native";

import { CommunityPostCard } from "@/components/CommunityPostCard";
import {
  Button,
  ErrorState,
  LoadingBlock,
  Screen,
  Text,
  TextField,
} from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { useCommunityPosts } from "@/features/community/useCommunityPosts.hook";
import { usePostDetail } from "@/features/community/usePostDetail.hook";
import { formatRelativeTime } from "@/lib/formatter.utils";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const { postQuery, commentsQuery, addComment, removePost, editPost, report } =
    usePostDetail(id);
  const { likePost } = useCommunityPosts();

  if (postQuery.isLoading) {
    return (
      <Screen withSafeArea={false}>
        <LoadingBlock />
      </Screen>
    );
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <Screen withSafeArea={false} className="px-4">
        <ErrorState onRetry={() => void postQuery.refetch()} />
      </Screen>
    );
  }

  const post = postQuery.data;
  const isOwn = post.user.id === "user-1";

  return (
    <Screen withSafeArea={false}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              hitSlop={8}
              onPress={() => {
                Alert.alert("Post options", undefined, [
                  {
                    text: "Report",
                    onPress: () => report.mutate(),
                  },
                  ...(isOwn
                    ? [
                        {
                          text: "Edit",
                          onPress: () => {
                            setEditContent(post.content);
                            setIsEditing(true);
                          },
                        },
                        {
                          text: "Delete",
                          style: "destructive" as const,
                          onPress: () => {
                            Alert.alert(
                              "Delete post?",
                              "This cannot be undone.",
                              [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: () => {
                                    removePost.mutate(undefined, {
                                      onSuccess: () => router.back(),
                                    });
                                  },
                                },
                              ],
                            );
                          },
                        },
                      ]
                    : []),
                  { text: "Cancel", style: "cancel" },
                ]);
              }}
            >
              <Text tone="primary" weight="semibold">
                More
              </Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={commentsQuery.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-4 pb-10"
        ListHeaderComponent={
          <View className="gap-4 py-2">
            {isEditing ? (
              <View className="rounded-card border border-cream/10 bg-surface p-4">
                <TextField
                  label="Edit post"
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline
                />
                <View className="mt-3 flex-row gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    isLoading={editPost.isPending}
                    onPress={() =>
                      editPost.mutate(
                        { content: editContent, category: post.category },
                        { onSuccess: () => setIsEditing(false) },
                      )
                    }
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1"
                    onPress={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            ) : (
              <CommunityPostCard post={post} onLike={likePost} />
            )}

            <Text variant="h3">Comments</Text>
            <TextField
              label="Add a comment"
              value={comment}
              onChangeText={setComment}
            />
            <Button
              size="sm"
              isDisabled={!comment.trim()}
              isLoading={addComment.isPending}
              onPress={() =>
                addComment.mutate(comment, {
                  onSuccess: () => setComment(""),
                })
              }
            >
              Comment
            </Button>
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <View className="flex-row gap-3 rounded-card border border-cream/10 bg-surface p-3">
            <Avatar uri={item.user.avatarUrl} name={item.user.fullName} size="sm" />
            <View className="flex-1">
              <Text variant="bodySmall" weight="semibold">
                {item.user.fullName}
              </Text>
              <Text variant="bodySmall" className="mt-1">
                {item.content}
              </Text>
              <Text variant="caption" tone="muted" className="mt-1">
                {formatRelativeTime(item.createdAt)}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          commentsQuery.isLoading ? null : (
            <Text tone="muted" className="py-4">
              No comments yet.
            </Text>
          )
        }
      />
    </Screen>
  );
}
