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
  rightSlot,
  className,
}: IPageHeadingProps) {
  const router = useRouter();

  return (
    <View
      className={cn(
        "mb-3 flex-row items-center justify-between gap-3",
        className,
      )}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-2">
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
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
        <View className="min-w-0 flex-1">
          <Text variant="h3" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              variant="caption"
              tone="muted"
              className="mt-0.5"
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
