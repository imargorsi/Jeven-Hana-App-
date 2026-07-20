import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/lib/cn.utils";

export interface IScreenProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  /** When false, skips SafeAreaView (e.g. screens with custom headers). */
  withSafeArea?: boolean;
}

export function Screen({
  children,
  className,
  withSafeArea = true,
  ...rest
}: IScreenProps) {
  const content = (
    <View className={cn("flex-1 bg-background", className)} {...rest}>
      {children}
    </View>
  );

  if (!withSafeArea) {
    return content;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      {content}
    </SafeAreaView>
  );
}
