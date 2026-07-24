import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import type { GestureResponderEvent } from "react-native";
import { Pressable, View } from "react-native";

import { palette } from "@/constants/Colors";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { cn } from "@/lib/cn.utils";
import { useSavedItemsStore } from "@/stores/useSavedItemsStore";
import type { TSavedItemType } from "@/types/saved-item.types";

interface ISaveButtonProps {
  type: TSavedItemType;
  id: string;
  size?: number;
  /** Override icon tint (defaults: primary when saved, cream when not). */
  color?: string;
  className?: string;
}

function useIsSaved(type: TSavedItemType, id: string): boolean {
  return useSavedItemsStore((s) => {
    if (type === "business") return s.businesses.includes(id);
    if (type === "place") return s.places.includes(id);
    return s.events.includes(id);
  });
}

export function SaveButton({
  type,
  id,
  size = 22,
  color,
  className,
}: ISaveButtonProps) {
  const { requireAuth } = useRequireAuth();
  const isSaved = useIsSaved(type, id);
  const toggleSaved = useSavedItemsStore((s) => s.toggleSaved);
  const tint = color ?? (isSaved ? palette.primary : palette.cream);

  const onPress = (event: GestureResponderEvent) => {
    // Nested inside listing cards — stop the parent Pressable from navigating.
    event.stopPropagation?.();
    requireAuth(() => {
      void Haptics.selectionAsync();
      toggleSaved(type, id);
    });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isSaved ? "Remove from Saved" : "Save"}
      hitSlop={8}
      className={cn("p-1 active:opacity-70", className)}
      onPress={onPress}
    >
      <SymbolView
        name={{
          ios: isSaved ? "bookmark.fill" : "bookmark",
          android: isSaved ? "bookmark" : "bookmark_border",
          web: "bookmark",
        }}
        size={size}
        tintColor={tint}
      />
    </Pressable>
  );
}

interface IShareButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  className?: string;
}

export function ShareButton({
  onPress,
  size = 22,
  color = palette.cream,
  className,
}: IShareButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Share"
      hitSlop={8}
      className={cn("p-1 active:opacity-70", className)}
      onPress={onPress}
    >
      <View>
        <SymbolView
          name={{
            ios: "square.and.arrow.up",
            android: "share",
            web: "share",
          }}
          size={size}
          tintColor={color}
        />
      </View>
    </Pressable>
  );
}
