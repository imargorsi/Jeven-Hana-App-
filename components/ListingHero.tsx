import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ImageGallery } from "@/components/ImageGallery";
import {
  ACTION_PILL_SIZE,
  ACTION_PILL_STYLE,
  SaveButton,
  ShareButton,
} from "@/components/ui/SaveButton";
import { palette } from "@/constants/Colors";
import { withAlpha } from "@/lib/color.utils";
import type { TAppImage } from "@/types/common.types";
import type { TSavedItemType } from "@/types/saved-item.types";

interface IListingHeroProps {
  urls: TAppImage[];
  saveType: TSavedItemType;
  saveId: string;
  onShare: () => void;
  height?: number;
  /** Owner/admin — same glass pills as Explore cards. */
  canManage?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

/**
 * Full-bleed listing hero — gallery with back / manage / share / save overlaid.
 */
export function ListingHero({
  urls,
  saveType,
  saveId,
  onShare,
  height = 340,
  canManage = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: IListingHeroProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="relative overflow-hidden">
      <ImageGallery urls={urls} height={height} />

      <LinearGradient
        colors={[withAlpha(palette.background, 0.78), "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top + 88,
        }}
        pointerEvents="none"
      />

      <LinearGradient
        colors={["transparent", withAlpha(palette.background, 0.92)]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 56,
        }}
        pointerEvents="none"
      />

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 top-0 flex-row items-center justify-between px-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go Back"
          hitSlop={6}
          onPress={() => router.back()}
          className="items-center justify-center rounded-full active:opacity-80"
          style={{
            width: ACTION_PILL_SIZE,
            height: ACTION_PILL_SIZE,
            ...ACTION_PILL_STYLE,
          }}
        >
          <SymbolView
            name={{
              ios: "chevron.left",
              android: "arrow_back",
              web: "arrow_back",
            }}
            size={18}
            tintColor={palette.cream}
          />
        </Pressable>

        <View className="flex-row items-center gap-1.5">
          {canManage && onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit Listing"
              disabled={isDeleting}
              hitSlop={6}
              onPress={onEdit}
              className="items-center justify-center rounded-full active:opacity-80"
              style={{
                width: ACTION_PILL_SIZE,
                height: ACTION_PILL_SIZE,
                ...ACTION_PILL_STYLE,
              }}
            >
              <SymbolView
                name={{
                  ios: "pencil",
                  android: "edit",
                  web: "edit",
                }}
                size={16}
                tintColor={palette.cream}
              />
            </Pressable>
          ) : null}
          {canManage && onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete Listing"
              disabled={isDeleting}
              hitSlop={6}
              onPress={onDelete}
              className="items-center justify-center rounded-full active:opacity-80"
              style={{
                width: ACTION_PILL_SIZE,
                height: ACTION_PILL_SIZE,
                backgroundColor: withAlpha(palette.error, 0.12),
                borderWidth: 1,
                borderColor: withAlpha(palette.error, 0.35),
              }}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={palette.error} />
              ) : (
                <SymbolView
                  name={{
                    ios: "trash",
                    android: "delete",
                    web: "delete",
                  }}
                  size={16}
                  tintColor={palette.error}
                />
              )}
            </Pressable>
          ) : null}
          <ShareButton onPress={onShare} size={16} color={palette.cream} />
          <SaveButton type={saveType} id={saveId} size={16} />
        </View>
      </View>
    </View>
  );
}
