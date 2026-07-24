import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface IBusinessManageActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  className?: string;
}

/**
 * Owner/admin Edit + Delete — second row under contact actions on detail.
 * Kept separate from Call/WhatsApp/Share so the public row stays uncrowded.
 */
export function BusinessManageActions({
  onEdit,
  onDelete,
  isDeleting = false,
  className,
}: IBusinessManageActionsProps) {
  return (
    <View className={cn("flex-row gap-2.5", className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit Listing"
        disabled={isDeleting}
        onPress={onEdit}
        className="min-h-[56px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-cream/10 bg-surface px-3 py-3 active:opacity-80"
      >
        <SymbolView
          name={{
            ios: "pencil",
            android: "edit",
            web: "edit",
          }}
          size={18}
          tintColor={palette.cream}
        />
        <Text variant="bodySmall" weight="semibold">
          Edit
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete Listing"
        disabled={isDeleting}
        onPress={onDelete}
        className="min-h-[56px] flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-error/25 bg-error/10 px-3 py-3 active:opacity-80"
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
            size={18}
            tintColor={palette.error}
          />
        )}
        <Text variant="bodySmall" weight="semibold" tone="error">
          Delete
        </Text>
      </Pressable>
    </View>
  );
}
