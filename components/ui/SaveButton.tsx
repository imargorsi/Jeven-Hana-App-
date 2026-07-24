import { useAuth } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import type { GestureResponderEvent } from "react-native";
import { Pressable } from "react-native";

import { palette } from "@/constants/Colors";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { useRequireAuth } from "@/features/auth/useRequireAuth.hook";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import { useSavedItemsStore } from "@/stores/useSavedItemsStore";
import type { TSavedItemType } from "@/types/saved-item.types";

/** Dev / no-Clerk fallback so bookmarks still work without a Clerk session. */
const LOCAL_SAVED_USER_ID = "local";

/** Shared glass chip used by listing action pills (edit / delete / save / share). */
export const ACTION_PILL_STYLE = {
  backgroundColor: withAlpha(palette.cream, 0.1),
  borderWidth: 1,
  borderColor: withAlpha(palette.cream, 0.2),
} as const;

export const ACTION_PILL_SIZE = 34;

interface ISaveButtonProps {
  type: TSavedItemType;
  id: string;
  size?: number;
  /**
   * Tint when saved (solid). Unsaved always uses cream outline so states stay distinct.
   */
  savedColor?: string;
  className?: string;
  /** Fixed glass pill hit target (aligned with edit/delete). Default true. */
  isPill?: boolean;
}

function useSavedScopeUserId(): string | null {
  if (!isClerkConfigured) {
    return LOCAL_SAVED_USER_ID;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- clerk key is fixed for the app session
  const { userId } = useAuth();
  return userId ?? null;
}

function useIsSaved(type: TSavedItemType, id: string): boolean {
  const normalizedId = String(id);
  return useSavedItemsStore((s) => {
    if (type === "business") return s.businesses.includes(normalizedId);
    if (type === "place") return s.places.includes(normalizedId);
    return s.events.includes(normalizedId);
  });
}

export function SaveButton({
  type,
  id,
  size = 16,
  savedColor = palette.primary,
  className,
  isPill = true,
}: ISaveButtonProps) {
  const { requireAuth } = useRequireAuth();
  const scopeUserId = useSavedScopeUserId();
  const isSaved = useIsSaved(type, id);
  const setCurrentUserId = useSavedItemsStore((s) => s.setCurrentUserId);
  const tint = isSaved ? savedColor : palette.cream;

  const onPress = (event: GestureResponderEvent) => {
    event.stopPropagation?.();

    requireAuth(() => {
      if (!scopeUserId) return;
      setCurrentUserId(scopeUserId);
      void Haptics.selectionAsync();
      useSavedItemsStore.getState().toggleSaved(type, String(id));
    });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isSaved ? "Remove from Saved" : "Save"}
      accessibilityState={{ selected: isSaved }}
      hitSlop={6}
      onPress={onPress}
      className={cn(
        "items-center justify-center active:opacity-80",
        isPill ? "rounded-full" : "p-1.5",
        className,
      )}
      style={
        isPill
          ? {
              width: ACTION_PILL_SIZE,
              height: ACTION_PILL_SIZE,
              ...ACTION_PILL_STYLE,
            }
          : undefined
      }
    >
      <SymbolView
        key={isSaved ? "saved" : "unsaved"}
        name={
          isSaved
            ? {
                ios: "bookmark.fill",
                android: "bookmark",
                web: "bookmark",
              }
            : {
                ios: "bookmark",
                android: "bookmark_border",
                web: "bookmark_border",
              }
        }
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
  isPill?: boolean;
}

export function ShareButton({
  onPress,
  size = 16,
  color = palette.cream,
  className,
  isPill = true,
}: IShareButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Share"
      hitSlop={6}
      onPress={onPress}
      className={cn(
        "items-center justify-center active:opacity-80",
        isPill ? "rounded-full" : "p-1",
        className,
      )}
      style={
        isPill
          ? {
              width: ACTION_PILL_SIZE,
              height: ACTION_PILL_SIZE,
              ...ACTION_PILL_STYLE,
            }
          : undefined
      }
    >
      <SymbolView
        name={{
          ios: "square.and.arrow.up",
          android: "share",
          web: "share",
        }}
        size={size}
        tintColor={color}
      />
    </Pressable>
  );
}
