import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { href } from "@/lib/navigation.utils";
import { createPost } from "@/lib/services/community.service";
import type { TPostCategory } from "@/types/community.types";

const MAX_CHARS = 500;
const MAX_IMAGES = 4;

export function useCreatePost() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<TPostCategory>("general");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: () =>
      createPost({
        content,
        imageUrls,
        category,
      }),
    onSuccess: (post) => {
      void queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      router.replace(href(`/community/${post.id}`));
    },
    onError: () => {
      Alert.alert("Could not post", "Please try again.");
    },
  });

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo library access to add images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_IMAGES - imageUrls.length,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImageUrls((prev) => [...prev, ...uris].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (uri: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== uri));
  };

  const canSubmit =
    content.trim().length > 0 &&
    content.trim().length <= MAX_CHARS &&
    !mutation.isPending;

  return {
    content,
    setContent,
    category,
    setCategory,
    imageUrls,
    pickImages,
    removeImage,
    canSubmit,
    maxChars: MAX_CHARS,
    isSubmitting: mutation.isPending,
    submit: () => {
      if (!canSubmit) return;
      mutation.mutate();
    },
  };
}
