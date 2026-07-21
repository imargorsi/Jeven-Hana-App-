import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import {
  createComment,
  deleteComment,
  deletePost,
  getComments,
  getPostById,
  reportPost,
  updatePost,
} from "@/lib/services/community.service";
import type { TPostCategory } from "@/types/community.types";

export function usePostDetail(postId: string) {
  const queryClient = useQueryClient();

  const postQuery = useQuery({
    queryKey: ["community-post", postId],
    queryFn: () => getPostById(postId),
    enabled: Boolean(postId),
  });

  const commentsQuery = useQuery({
    queryKey: ["community-comments", postId],
    queryFn: () => getComments(postId),
    enabled: Boolean(postId),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["community-post", postId] });
    void queryClient.invalidateQueries({
      queryKey: ["community-comments", postId],
    });
    void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
  };

  const addComment = useMutation({
    mutationFn: (content: string) => createComment(postId, content),
    onSuccess: invalidate,
  });

  const removeComment = useMutation({
    mutationFn: deleteComment,
    onSuccess: invalidate,
  });

  const removePost = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
    },
  });

  const editPost = useMutation({
    mutationFn: (input: { content: string; category: TPostCategory }) =>
      updatePost(postId, input),
    onSuccess: invalidate,
  });

  const report = useMutation({
    mutationFn: () => reportPost(postId),
    onSuccess: () => Alert.alert("Reported", "Thanks — we'll review this post."),
  });

  return {
    postQuery,
    commentsQuery,
    addComment,
    removeComment,
    removePost,
    editPost,
    report,
  };
}
