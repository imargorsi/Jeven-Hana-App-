import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Button, Text, TextField } from "@/components/ui";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

export interface IBusinessReviewFormValues {
  rating: number;
  comment: string;
}

interface IBusinessReviewFormProps {
  values: IBusinessReviewFormValues;
  onChange: (patch: Partial<IBusinessReviewFormValues>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function emptyBusinessReviewFormValues(): IBusinessReviewFormValues {
  return { rating: 5, comment: "" };
}

export function BusinessReviewForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: IBusinessReviewFormProps) {
  return (
    <View className="gap-3 rounded-card border border-cream/10 bg-surface p-4">
      <Text variant="bodySmall" weight="semibold">
        Your Rating
      </Text>
      <View className="flex-row gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= values.rating;
          return (
            <Pressable
              key={star}
              accessibilityRole="button"
              accessibilityLabel={`${star} Star${star === 1 ? "" : "s"}`}
              accessibilityState={{ selected: isActive }}
              disabled={isSubmitting}
              onPress={() => onChange({ rating: star })}
              className="active:opacity-80"
              hitSlop={6}
            >
              <SymbolView
                name={{
                  ios: isActive ? "star.fill" : "star",
                  android: "star",
                  web: "star",
                }}
                size={28}
                tintColor={isActive ? palette.primary : palette.muted}
              />
            </Pressable>
          );
        })}
      </View>

      <TextField
        label="Review"
        value={values.comment}
        onChangeText={(comment) => onChange({ comment })}
        placeholder="Share your experience for neighbours…"
        autoCapitalize="sentences"
        multiline
        className="min-h-24"
        textAlignVertical="top"
      />

      <View className={cn("gap-2", onCancel ? "flex-row" : undefined)}>
        {onCancel ? (
          <Button
            variant="ghost"
            size="md"
            disabled={isSubmitting}
            onPress={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          onPress={onSubmit}
          className={onCancel ? "flex-1" : undefined}
          isFullWidth={!onCancel}
        >
          {submitLabel}
        </Button>
      </View>
    </View>
  );
}
