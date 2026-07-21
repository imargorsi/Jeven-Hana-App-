import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { useSavedItemsStore } from "@/stores/useSavedItemsStore";
import type { TSavedItemType } from "@/types/saved-item.types";

interface ISaveButtonProps {
  type: TSavedItemType;
  id: string;
  size?: number;
  className?: string;
}

export function SaveButton({ type, id, size = 22, className }: ISaveButtonProps) {
  const isSaved = useSavedItemsStore((s) => s.isSaved(type, id));
  const toggleSaved = useSavedItemsStore((s) => s.toggleSaved);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isSaved ? "Remove from saved" : "Save"}
      hitSlop={8}
      className={cn("p-1 active:opacity-70", className)}
      onPress={() => {
        void Haptics.selectionAsync();
        toggleSaved(type, id);
      }}
    >
      <SymbolView
        name={{
          ios: isSaved ? "bookmark.fill" : "bookmark",
          android: isSaved ? "bookmark" : "bookmark_border",
          web: "bookmark",
        }}
        size={size}
        tintColor={isSaved ? palette.primary : palette.cream}
      />
    </Pressable>
  );
}

interface IShareButtonProps {
  onPress: () => void;
  size?: number;
  className?: string;
}

export function ShareButton({ onPress, size = 22, className }: IShareButtonProps) {
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
          tintColor={palette.cream}
        />
      </View>
    </Pressable>
  );
}
