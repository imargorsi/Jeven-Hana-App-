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
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import { toImageSource } from "@/lib/image.utils";
import {
  getLocalFileByteSize,
  isCoverWithinSizeLimit,
  normalizeCoverContentType,
} from "@/lib/services/uploads.service";
import { hasUrduScript } from "@/lib/text.utils";
import {
  POST_CATEGORIES,
  POST_CATEGORY_LABELS,
  type TPostCategory,
} from "@/types/community.types";

export interface ICommunityPostFormValues {
  content: string;
  category: TPostCategory;
  /** Existing remote image (edit). */
  imageUrl: string | null;
  /** Newly picked local URI — upload on submit. */
  imageLocalUri: string | null;
  imageMimeType: string | null;
  imageFileName: string | null;
  imageFileSize: number | null;
  /** User removed image on edit. */
  imageCleared: boolean;
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
    imageUrl: null,
    imageLocalUri: null,
    imageMimeType: null,
    imageFileName: null,
    imageFileSize: null,
    imageCleared: false,
  };
}

function getImagePreviewUri(values: ICommunityPostFormValues): string | null {
  if (values.imageLocalUri) return values.imageLocalUri;
  if (values.imageCleared) return null;
  return values.imageUrl;
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
  const previewUri = getImagePreviewUri(values);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Needed",
        "Allow photo access to attach an image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

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
        "Post photos must be 5 MB or smaller. Choose a smaller image.",
      );
      return;
    }

    onChange({
      imageLocalUri: asset.uri,
      imageMimeType: contentType,
      imageFileName: asset.fileName ?? null,
      imageFileSize: byteSize,
      imageCleared: false,
    });
  };

  const clearImage = () => {
    onChange({
      imageLocalUri: null,
      imageMimeType: null,
      imageFileName: null,
      imageFileSize: null,
      imageUrl: null,
      imageCleared: true,
    });
  };

  return (
    <KeyboardAwareScrollView contentContainerClassName="gap-4 px-4 pb-10 pt-2">
      <Text variant="caption" tone="muted">
        Posts go live immediately. English, Urdu, or both are fine.
      </Text>

      {previewUri ? (
        <View className="overflow-hidden rounded-card border border-cream/15">
          <Image
            source={toImageSource(previewUri)}
            style={{ width: "100%", aspectRatio: 4 / 3 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
          <View className="flex-row gap-2 border-t border-cream/10 bg-surface p-2.5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change Image"
              disabled={isSubmitting}
              onPress={() => void pickImage()}
              className="flex-1 items-center rounded-full bg-primary/15 px-3 py-2.5 active:opacity-80"
            >
              <Text variant="caption" weight="semibold" tone="primary">
                Change
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove Image"
              disabled={isSubmitting}
              onPress={clearImage}
              className="flex-1 items-center rounded-full px-3 py-2.5 active:opacity-80"
              style={{ backgroundColor: withAlpha(palette.error, 0.12) }}
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
          accessibilityLabel="Attach Image"
          disabled={isSubmitting}
          onPress={() => void pickImage()}
          className="flex-row items-center gap-3.5 rounded-card border border-cream/15 bg-surface px-4 py-3.5 active:opacity-90"
        >
          <View
            className="h-12 w-12 items-center justify-center rounded-full bg-primary/15"
            style={{
              borderWidth: 1.5,
              borderColor: withAlpha(palette.primary, 0.45),
            }}
          >
            <SymbolView
              name={{
                ios: "camera.fill",
                android: "photo_camera",
                web: "photo_camera",
              }}
              size={22}
              tintColor={palette.primary}
            />
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="bodySmall" weight="semibold">
              Attach Image
            </Text>
            <Text
              isUrdu
              variant="caption"
              tone="muted"
              className="mt-0.5 text-left"
              style={{ textAlign: "left" }}
            >
              تصویر منسلک کریں (اختیاری، زیادہ سے زیادہ 5 MB)
            </Text>
          </View>
        </Pressable>
      )}

      <TextField
        label="What's Happening?"
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
              Pin To Top Of Feed
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
    </KeyboardAwareScrollView>
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
