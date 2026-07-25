import { SymbolView } from "expo-symbols";
import type { GestureResponderEvent } from "react-native";
import { ActivityIndicator, Pressable } from "react-native";

import {
  ACTION_PILL_SIZE,
  ACTION_PILL_STYLE,
} from "@/components/ui/SaveButton";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import type { TReportTargetType } from "@/features/reports/report.types";
import { useReportContent } from "@/features/reports/useReportContent.hook";
import { cn } from "@/lib/cn.utils";

interface IReportButtonProps {
  targetType: TReportTargetType;
  targetId: string;
  /** `pill` = glass chip (heroes); `text` = feed footer link. */
  variant?: "pill" | "text";
  className?: string;
}

/** Report UGC — posts, listings, events. */
export function ReportButton({
  targetType,
  targetId,
  variant = "text",
  className,
}: IReportButtonProps) {
  const { openReport, isReporting } = useReportContent();

  const onPress = (event?: GestureResponderEvent) => {
    event?.stopPropagation?.();
    if (isReporting) return;
    openReport(targetType, targetId);
  };

  if (variant === "pill") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Report"
        hitSlop={6}
        disabled={isReporting}
        onPress={onPress}
        className={cn(
          "items-center justify-center rounded-full active:opacity-80",
          className,
        )}
        style={{
          width: ACTION_PILL_SIZE,
          height: ACTION_PILL_SIZE,
          ...ACTION_PILL_STYLE,
        }}
      >
        {isReporting ? (
          <ActivityIndicator size="small" color={palette.cream} />
        ) : (
          <SymbolView
            name={{
              ios: "flag",
              android: "flag",
              web: "flag",
            }}
            size={16}
            tintColor={palette.cream}
          />
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Report"
      hitSlop={8}
      disabled={isReporting}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-1.5 active:opacity-70",
        className,
      )}
    >
      {isReporting ? (
        <ActivityIndicator size="small" color={palette.muted} />
      ) : (
        <SymbolView
          name={{
            ios: "flag",
            android: "flag",
            web: "flag",
          }}
          size={14}
          tintColor={palette.muted}
        />
      )}
      <Text variant="caption" tone="muted">
        Report
      </Text>
    </Pressable>
  );
}
