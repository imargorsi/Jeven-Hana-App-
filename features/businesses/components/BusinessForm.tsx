import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, View } from "react-native";

import { Button, Text, TextField } from "@/components/ui";
import { palette } from "@/constants/Colors";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_CATEGORY_LABELS,
  type IBusinessFormValues,
} from "@/features/businesses/businessForm.utils";
import { cn } from "@/lib/cn.utils";

interface IBusinessFormProps {
  values: IBusinessFormValues;
  onChange: (patch: Partial<IBusinessFormValues>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  /** Admin-only Ka Best control (edit). */
  showKaBest?: boolean;
  isKaBest?: boolean;
  onKaBestToggle?: () => void;
  isTogglingKaBest?: boolean;
}

export function BusinessForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel,
  showKaBest = false,
  isKaBest = false,
  onKaBestToggle,
  isTogglingKaBest = false,
}: IBusinessFormProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-4 px-4 pb-10 pt-2"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text variant="caption" tone="muted">
        Listings go live immediately. English, Urdu, or both are fine for
        name and address.
      </Text>

      <TextField
        label="Name"
        value={values.name}
        onChangeText={(name) => onChange({ name })}
        placeholder="e.g. Chai Corner"
        autoCapitalize="sentences"
        returnKeyType="next"
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
          {BUSINESS_CATEGORIES.map((category) => {
            const isActive = values.category === category;
            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => onChange({ category })}
                className={cn(
                  "rounded-full px-3.5 py-2 active:opacity-80",
                  isActive
                    ? "bg-primary/15"
                    : "border border-cream/15 bg-surface",
                )}
              >
                <Text
                  variant="caption"
                  weight={isActive ? "semibold" : "medium"}
                  tone={isActive ? "primary" : "muted"}
                >
                  {BUSINESS_CATEGORY_LABELS[category]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <TextField
        label="Address"
        value={values.address}
        onChangeText={(address) => onChange({ address })}
        placeholder="e.g. Near Jamia Masjid, Jevan Hana"
        autoCapitalize="sentences"
        returnKeyType="next"
      />

      <TextField
        label="Phone (optional)"
        value={values.phone}
        onChangeText={(phone) => onChange({ phone })}
        placeholder="03XX XXXXXXX"
        keyboardType="phone-pad"
        returnKeyType="next"
      />

      <TextField
        label="WhatsApp (optional)"
        value={values.whatsapp}
        onChangeText={(whatsapp) => onChange({ whatsapp })}
        placeholder="03XX XXXXXXX"
        keyboardType="phone-pad"
        returnKeyType="next"
      />

      <TextField
        label="Description (optional)"
        value={values.description}
        onChangeText={(description) => onChange({ description })}
        placeholder="Short note for neighbours"
        autoCapitalize="sentences"
        multiline
        className="min-h-24"
        textAlignVertical="top"
      />

      <View className="rounded-card border border-dashed border-cream/15 bg-surface/50 px-4 py-3.5">
        <Text variant="bodySmall" weight="medium">
          Cover photo
        </Text>
        <Text variant="caption" tone="muted" className="mt-1">
          Photo upload comes next (Cloudflare R2). Until then, listings show
          the town fallback image.
        </Text>
      </View>

      {showKaBest ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isKaBest }}
          disabled={isTogglingKaBest}
          onPress={onKaBestToggle}
          className="flex-row items-center gap-3 rounded-card border border-cream/15 bg-surface px-4 py-3.5 active:opacity-90"
        >
          <View
            className={cn(
              "h-5 w-5 items-center justify-center rounded border",
              isKaBest
                ? "border-primary bg-primary"
                : "border-cream/30 bg-background",
            )}
          >
            {isKaBest ? (
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
              Jevan Hana Ka Best
            </Text>
            <Text variant="caption" tone="muted" className="mt-0.5">
              Admin only — feature this listing with the Ka Best badge
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
