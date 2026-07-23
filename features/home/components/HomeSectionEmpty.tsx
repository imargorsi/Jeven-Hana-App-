import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

interface IHomeSectionEmptyProps {
  message: string;
  className?: string;
}

/** Compact empty copy for Home rails (keeps section header visible). */
export function HomeSectionEmpty({ message, className }: IHomeSectionEmptyProps) {
  return (
    <View
      className={cn(
        "rounded-card border border-dashed border-cream/15 bg-surface/40 px-4 py-6",
        className,
      )}
    >
      <Text variant="bodySmall" tone="muted" className="text-center">
        {message}
      </Text>
    </View>
  );
}
