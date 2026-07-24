import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable } from "react-native";

import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";

interface IStackBackButtonProps {
  className?: string;
}

/** Compact circular back control for nested stack screens. */
export function StackBackButton({ className }: IStackBackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go Back"
      hitSlop={8}
      onPress={() => router.back()}
      className={cn(
        "ml-1 mr-3 h-9 w-9 items-center justify-center rounded-full active:opacity-80",
        className,
      )}
      style={{
        backgroundColor: withAlpha(palette.cream, 0.08),
        borderWidth: 1,
        borderColor: withAlpha(palette.cream, 0.12),
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
  );
}
