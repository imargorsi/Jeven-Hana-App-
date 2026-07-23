import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/ui/AppHeader";
import { PageHeading } from "@/components/ui/PageHeading";
import { cn } from "@/lib/cn.utils";

export interface IScreenProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  /** When false, skips SafeAreaView (e.g. nested under a chrome layout). */
  withSafeArea?: boolean;
  /**
   * Show the global AppHeader (logo · search · notifications).
   * Default true for tab/content screens. Stack layouts may set false
   * when the parent layout already renders AppHeader.
   */
  withAppHeader?: boolean;
  /** Hide search inside AppHeader (Search screen). */
  hideHeaderSearch?: boolean;
  /** Unified page title under the header. */
  title?: string;
  subtitle?: string;
  /** Center the page title (e.g. Explore). */
  titleAlign?: "start" | "center";
  showBack?: boolean;
  headerRight?: React.ReactNode;
}

export function Screen({
  children,
  className,
  withSafeArea = true,
  withAppHeader,
  hideHeaderSearch = false,
  title,
  subtitle,
  titleAlign = "start",
  showBack = false,
  headerRight,
  ...rest
}: IScreenProps) {
  const showAppHeader = withAppHeader ?? withSafeArea;

  const chrome = (
    <>
      {showAppHeader ? (
        <View className="px-4">
          <AppHeader hideSearch={hideHeaderSearch} />
        </View>
      ) : null}
      {title ? (
        <View className="px-4 pt-3">
          <PageHeading
            title={title}
            subtitle={subtitle}
            align={titleAlign}
            showBack={showBack}
            rightSlot={headerRight}
          />
        </View>
      ) : null}
    </>
  );

  const content = (
    <View className={cn("flex-1 bg-background", className)} {...rest}>
      {chrome}
      {children}
    </View>
  );

  if (!withSafeArea) {
    return content;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      {content}
    </SafeAreaView>
  );
}
