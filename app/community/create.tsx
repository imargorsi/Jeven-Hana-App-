import { Image } from "expo-image";
import { Pressable, ScrollView, View } from "react-native";

import { CategoryChip } from "@/components/CategoryChip";
import { Button, Screen, Text, TextField } from "@/components/ui";
import { useCreatePost } from "@/features/community/useCreatePost.hook";
import type { TPostCategory } from "@/types/community.types";

const CATEGORIES: { key: TPostCategory; label: string }[] = [
  { key: "general", label: "General" },
  { key: "local-update", label: "Local update" },
  { key: "recommendation", label: "Recommendation" },
  { key: "lost-found", label: "Lost & found" },
  { key: "news", label: "News" },
];

export default function CreatePostScreen() {
  const {
    content,
    setContent,
    category,
    setCategory,
    imageUrls,
    pickImages,
    removeImage,
    canSubmit,
    maxChars,
    isSubmitting,
    submit,
  } = useCreatePost();

  return (
    <Screen withSafeArea={false}>
      <ScrollView
        contentContainerClassName="px-4 pb-10 pt-2"
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="bodySmall" tone="muted" className="mb-4">
          Share with Jevan Hana neighbours
        </Text>

        <Text variant="label" className="mb-2">
          Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.key}
              label={cat.label}
              isActive={category === cat.key}
              onPress={() => setCategory(cat.key)}
            />
          ))}
        </ScrollView>

        <TextField
          label="What's happening?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          className="min-h-[140px]"
          textAlignVertical="top"
        />
        <Text
          variant="caption"
          tone={content.length > maxChars ? "error" : "muted"}
          className="mt-2 text-right"
        >
          {content.length}/{maxChars}
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-3">
          {imageUrls.map((uri) => (
            <View key={uri} className="relative">
              <Image
                source={{ uri }}
                className="h-24 w-24 rounded-lg bg-surface"
                contentFit="cover"
              />
              <Pressable
                onPress={() => removeImage(uri)}
                className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-error"
              >
                <Text variant="caption" weight="bold">
                  ×
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Button
          variant="secondary"
          className="mt-4"
          onPress={() => void pickImages()}
          isDisabled={imageUrls.length >= 4}
        >
          Add photos
        </Button>

        <Button
          className="mt-4"
          isFullWidth
          isLoading={isSubmitting}
          isDisabled={!canSubmit}
          onPress={submit}
        >
          Post
        </Button>
      </ScrollView>
    </Screen>
  );
}
