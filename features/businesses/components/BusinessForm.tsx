import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { SymbolView } from "expo-symbols";
import { Alert, Pressable, View } from "react-native";

import {
  Button,
  KeyboardAwareScrollView,
  Text,
  TextField,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_CATEGORY_LABELS,
  getCoverPreviewUri,
  type IBusinessFormValues,
} from "@/features/businesses/businessForm.utils";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import { toImageSource } from "@/lib/image.utils";
import {
  getLocalFileByteSize,
  isCoverWithinSizeLimit,
  normalizeCoverContentType,
} from "@/lib/services/uploads.service";

interface IBusinessFormProps {
  values: IBusinessFormValues;
  onChange: (patch: Partial<IBusinessFormValues>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  /** Admin-only Featured control (edit). */
  showFeatured?: boolean;
  isFeatured?: boolean;
  onFeaturedToggle?: () => void;
  isTogglingFeatured?: boolean;
}

export function BusinessForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel,
  showFeatured = false,
  isFeatured = false,
  onFeaturedToggle,
  isTogglingFeatured = false,
}: IBusinessFormProps) {
  const coverPreview = getCoverPreviewUri(values);

  const pickCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo access to add a cover photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const contentType = normalizeCoverContentType(asset.mimeType);
    if (!contentType) {
      Alert.alert("Unsupported Photo", "Use a JPEG, PNG, or WebP image.");
      return;
    }

    const byteSize = await getLocalFileByteSize(asset.uri, asset.fileSize);
    if (!isCoverWithinSizeLimit(byteSize)) {
      Alert.alert(
        "Photo Too Large",
        "Cover photos must be 5 MB or smaller. Choose a smaller image.",
      );
      return;
    }

    onChange({
      coverLocalUri: asset.uri,
      coverMimeType: contentType,
      coverFileName: asset.fileName ?? null,
      coverFileSize: byteSize,
      coverCleared: false,
    });
  };

  const clearCover = () => {
    onChange({
      coverLocalUri: null,
      coverMimeType: null,
      coverFileName: null,
      coverFileSize: null,
      coverImageUrl: null,
      coverCleared: true,
    });
  };

  return (
    <KeyboardAwareScrollView contentContainerClassName="gap-4 px-4 pb-10 pt-2">
      <Text variant="caption" tone="muted">
        Listings go live immediately. Enter name and address in English.
      </Text>

      <View className="gap-2">
        <Text
          variant="label"
          tone="cream"
          weight="medium"
          className="opacity-70"
        >
          Cover Photo
        </Text>

        {coverPreview ? (
          <View className="overflow-hidden rounded-card border border-cream/15">
            <Image
              source={toImageSource(coverPreview)}
              style={{ width: "100%", height: 160 }}
              contentFit="cover"
            />
            <View className="flex-row gap-2 border-t border-cream/10 bg-surface p-2.5">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Change Cover Photo"
                disabled={isSubmitting}
                onPress={() => void pickCover()}
                className="flex-1 items-center rounded-full bg-primary/15 px-3 py-2.5 active:opacity-80"
              >
                <Text variant="caption" weight="semibold" tone="primary">
                  Change
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove Cover Photo"
                disabled={isSubmitting}
                onPress={clearCover}
                className="flex-1 items-center rounded-full px-3 py-2.5 active:opacity-80"
                style={{
                  backgroundColor: withAlpha(palette.error, 0.12),
                }}
              >
                <Text
                  variant="caption"
                  weight="semibold"
                  style={{ color: palette.error }}
                >
                  Remove
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add Cover Photo"
            disabled={isSubmitting}
            onPress={() => void pickCover()}
            className="items-center justify-center rounded-card border border-dashed border-cream/20 bg-surface/50 px-4 py-8 active:opacity-80"
          >
            <View
              className="mb-2.5 h-11 w-11 items-center justify-center rounded-full"
              style={{
                backgroundColor: withAlpha(palette.primary, 0.14),
                borderWidth: 1,
                borderColor: withAlpha(palette.primary, 0.28),
              }}
            >
              <SymbolView
                name={{
                  ios: "photo.on.rectangle",
                  android: "add_photo_alternate",
                  web: "add_photo_alternate",
                }}
                size={20}
                tintColor={palette.primary}
              />
            </View>
            <Text variant="bodySmall" weight="semibold">
              Add Cover Photo
            </Text>
            <Text variant="caption" tone="muted" className="mt-1 text-center">
              Optional — JPEG, PNG, or WebP, max 5 MB. Town logo used if empty.
            </Text>
          </Pressable>
        )}
      </View>

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
        label="Phone (Optional)"
        value={values.phone}
        onChangeText={(phone) => onChange({ phone })}
        placeholder="03XX XXXXXXX"
        keyboardType="phone-pad"
        returnKeyType="next"
      />

      <TextField
        label="WhatsApp (Optional)"
        value={values.whatsapp}
        onChangeText={(whatsapp) => onChange({ whatsapp })}
        placeholder="03XX XXXXXXX"
        keyboardType="phone-pad"
        returnKeyType="next"
      />

      <TextField
        label="Description (Optional)"
        value={values.description}
        onChangeText={(description) => onChange({ description })}
        placeholder="Short note for neighbours"
        autoCapitalize="sentences"
        multiline
        className="min-h-24"
        textAlignVertical="top"
      />

      {showFeatured ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isFeatured }}
          disabled={isTogglingFeatured}
          onPress={onFeaturedToggle}
          className="flex-row items-center gap-3 rounded-card border border-cream/15 bg-surface px-4 py-3.5 active:opacity-90"
        >
          <View
            className={cn(
              "h-5 w-5 items-center justify-center rounded border",
              isFeatured
                ? "border-primary bg-primary"
                : "border-cream/30 bg-background",
            )}
          >
            {isFeatured ? (
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
              Featured
            </Text>
            <Text variant="caption" tone="muted" className="mt-0.5">
              Admin only — feature this listing with the Featured badge
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
    </KeyboardAwareScrollView>
  );
}
