import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";

interface IBusinessReviewFormProps {
  isSubmitting?: boolean;
  onSubmit: (input: { rating: number; comment: string }) => void;
  className?: string;
}

export function BusinessReviewForm({
  isSubmitting = false,
  onSubmit,
  className,
}: IBusinessReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const canSubmit = rating > 0 && comment.trim().length >= 3 && !isSubmitting;

  return (
    <View
      className={cn(
        "rounded-card border border-cream/10 bg-surface/80 p-4",
        className,
      )}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text variant="bodySmall" weight="semibold">
            Write a review
          </Text>
          <Text variant="caption" tone="muted" className="mt-0.5">
            Rate with stars, then leave a short note.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Post review"
          disabled={!canSubmit}
          hitSlop={6}
          onPress={() => {
            onSubmit({ rating, comment: comment.trim() });
            setRating(0);
            setComment("");
          }}
          className={cn(
            "min-h-9 flex-row items-center gap-1.5 rounded-button border border-primary bg-transparent px-3 py-1.5 active:opacity-80",
            canSubmit ? "bg-primary/10" : "border-cream/20 opacity-45",
          )}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={palette.primary} />
          ) : (
            <>
              <SymbolView
                name={{
                  ios: "paperplane.fill",
                  android: "send",
                  web: "send",
                }}
                size={14}
                tintColor={canSubmit ? palette.primary : palette.muted}
              />
              <Text
                variant="caption"
                weight="semibold"
                tone={canSubmit ? "primary" : "muted"}
              >
                Post
              </Text>
            </>
          )}
        </Pressable>
      </View>

      <View className="mt-4 flex-row items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => {
          const isActive = value <= rating;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={`${value} star${value === 1 ? "" : "s"}`}
              hitSlop={8}
              onPress={() => setRating(value)}
              className="active:opacity-80"
            >
              <SymbolView
                name={{
                  ios: isActive ? "star.fill" : "star",
                  android: isActive ? "star" : "star_border",
                  web: isActive ? "star" : "star_border",
                }}
                size={24}
                tintColor={isActive ? palette.primary : withAlpha(palette.cream, 0.35)}
              />
            </Pressable>
          );
        })}
        {rating > 0 ? (
          <Text variant="caption" tone="primary" weight="medium" className="ml-1">
            {rating}.0
          </Text>
        ) : null}
      </View>

      <View className="mt-3.5 min-h-[72px] rounded-xl border border-cream/10 bg-background px-3.5 py-3">
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience…"
          placeholderTextColor={withAlpha(palette.cream, 0.4)}
          multiline
          textAlignVertical="top"
          maxLength={280}
          className="min-h-[52px] w-full text-[15px] text-cream"
          style={{
            fontFamily: fonts.english.regular,
            padding: 0,
            margin: 0,
            borderWidth: 0,
          }}
        />
      </View>
      <Text variant="caption" tone="muted" className="mt-2 text-right">
        {comment.length}/280
      </Text>
    </View>
  );
}
