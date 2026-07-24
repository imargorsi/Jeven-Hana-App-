import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, View } from "react-native";

import { Button, Text, TextField } from "@/components/ui";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { hasUrduScript } from "@/lib/text.utils";
import {
  POST_CATEGORIES,
  POST_CATEGORY_LABELS,
  type TPostCategory,
} from "@/types/community.types";

export interface ICommunityPostFormValues {
  content: string;
  category: TPostCategory;
}

interface ICommunityPostFormProps {
  values: ICommunityPostFormValues;
  onChange: (patch: Partial<ICommunityPostFormValues>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  /** Admin-only pin control. */
  showPin?: boolean;
  isPinned?: boolean;
  onPinnedChange?: (isPinned: boolean) => void;
}

export function emptyCommunityPostFormValues(): ICommunityPostFormValues {
  return {
    content: "",
    category: "talk",
  };
}

export function CommunityPostForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel,
  showPin = false,
  isPinned = false,
  onPinnedChange,
}: ICommunityPostFormProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4 px-4 pb-10 pt-2"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text variant="caption" tone="muted">
        Posts go live immediately. English, Urdu, or both are fine.
      </Text>

      <TextField
        label="What's happening?"
        value={values.content}
        onChangeText={(content) => onChange({ content })}
        placeholder="Share a neighbourhood update…"
        autoCapitalize="sentences"
        multiline
        className="min-h-32"
        textAlignVertical="top"
      />

      <View className="gap-2">
        <Text
          variant="label"
          tone="cream"
          weight="medium"
          className="opacity-70"
        >
          Category
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {POST_CATEGORIES.map((category) => {
            const isActive = values.category === category;
            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => onChange({ category })}
                className={cn(
                  "rounded-full px-3.5 py-2 active:opacity-80",
                  isActive ? "bg-primary/15" : "bg-surface border border-cream/15",
                )}
              >
                <Text
                  variant="caption"
                  weight={isActive ? "semibold" : "medium"}
                  tone={isActive ? "primary" : "muted"}
                >
                  {POST_CATEGORY_LABELS[category]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {showPin ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isPinned }}
          onPress={() => onPinnedChange?.(!isPinned)}
          className="flex-row items-center gap-3 rounded-card border border-cream/15 bg-surface px-4 py-3.5 active:opacity-90"
        >
          <View
            className={cn(
              "h-5 w-5 items-center justify-center rounded border",
              isPinned
                ? "border-primary bg-primary"
                : "border-cream/30 bg-background",
            )}
          >
            {isPinned ? (
              <SymbolView
                name={{
                  ios: "checkmark",
                  android: "check",
                  web: "check",
                }}
                size={12}
                tintColor={palette.background}
              />
            ) : null}
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="bodySmall" weight="semibold">
              Pin to top of feed
            </Text>
            <Text variant="caption" tone="muted" className="mt-0.5">
              Admin only — shows first in Community
            </Text>
          </View>
        </Pressable>
      ) : null}

      <Button
        variant="primary"
        size="lg"
        isFullWidth
        isLoading={isSubmitting}
        onPress={onSubmit}
        className="mt-2"
      >
        {submitLabel}
      </Button>
    </ScrollView>
  );
}

export function buildCommunityPostPayload(values: ICommunityPostFormValues):
  | {
      payload: {
        content: string;
        category: TPostCategory;
        contentIsUrdu: boolean;
      };
    }
  | { error: string } {
  const content = values.content.trim();
  if (!content) return { error: "Write something for your post." };
  if (content.length > 2000) {
    return { error: "Post must be 2000 characters or less." };
  }
  return {
    payload: {
      content,
      category: values.category,
      contentIsUrdu: hasUrduScript(content),
    },
  };
}
