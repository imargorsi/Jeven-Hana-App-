import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ImageGallery } from "@/components/ImageGallery";
import { SaveButton, ShareButton } from "@/components/ui";
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
}

/**
 * Full-bleed listing hero — gallery with back / share / save overlaid (no title bar).
 */
export function ListingHero({
  urls,
  saveType,
  saveId,
  onShare,
  height = 340,
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
          hitSlop={10}
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-background/45 active:opacity-80"
        >
          <SymbolView
            name={{
              ios: "chevron.left",
              android: "arrow_back",
              web: "arrow_back",
            }}
            size={20}
            tintColor={palette.cream}
          />
        </Pressable>

        <View className="flex-row items-center gap-0.5 rounded-full border border-cream/15 bg-background/45 px-1.5 py-0.5">
          <ShareButton onPress={onShare} size={20} color={palette.primary} />
          <SaveButton
            type={saveType}
            id={saveId}
            size={20}
            color={palette.primary}
          />
        </View>
      </View>
    </View>
  );
}
