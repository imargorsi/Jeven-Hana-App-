import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface IPageHeadingProps {
  title: string;
  subtitle?: string;
  /** When true, shows a back chevron (stack screens). */
  showBack?: boolean;
  /** Center the title when there is no back button / right slot. */
  align?: "start" | "center";
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Unified page title / breadcrumb row under the global AppHeader.
 */
export function PageHeading({
  title,
  subtitle,
  showBack = false,
  align = "start",
  rightSlot,
  className,
}: IPageHeadingProps) {
  const router = useRouter();
  const isCentered = align === "center" && !showBack && !rightSlot;

  return (
    <View
      className={cn(
        "mb-3 flex-row items-center gap-3",
        isCentered ? "justify-center" : "justify-between",
        className,
      )}
    >
      <View
        className={cn(
          "min-w-0 flex-row items-center gap-2",
          isCentered ? "justify-center" : "flex-1",
        )}
      >
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go Back"
            hitSlop={8}
            className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
            onPress={() => router.back()}
          >
            <SymbolView
              name={{
                ios: "chevron.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              size={22}
              tintColor={palette.cream}
            />
          </Pressable>
        ) : null}
        <View className={cn("min-w-0", isCentered ? "items-center" : "flex-1")}>
          <Text
            variant="h3"
            numberOfLines={1}
            className={isCentered ? "text-center" : undefined}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              variant="caption"
              tone="muted"
              className={cn("mt-0.5", isCentered && "text-center")}
              numberOfLines={1}
              isUrdu={/[؀-ۿ]/.test(subtitle)}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {rightSlot ? <View className="shrink-0">{rightSlot}</View> : null}
    </View>
  );
}
