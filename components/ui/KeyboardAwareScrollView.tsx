import { cssInterop } from "nativewind";
import {
  KeyboardAwareScrollView as RNKeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps as RNKeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

import { cn } from "@/lib/cn.utils";

const StyledKeyboardAwareScrollView = cssInterop(RNKeyboardAwareScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});

interface IKeyboardAwareScrollViewProps
  extends Omit<RNKeyboardAwareScrollViewProps, "bottomOffset"> {
  children: React.ReactNode;
  className?: string;
  contentContainerClassName?: string;
  /** Space between the focused input and the top of the keyboard. */
  bottomOffset?: number;
  /**
   * @deprecated Use `bottomOffset` instead. Kept for older call sites.
   */
  keyboardVerticalOffset?: number;
}

/**
 * Scroll view that keeps the focused field above the keyboard.
 * Backed by react-native-keyboard-controller (Expo-recommended).
 */
export function KeyboardAwareScrollView({
  children,
  className,
  contentContainerClassName,
  bottomOffset,
  keyboardVerticalOffset,
  keyboardShouldPersistTaps = "handled",
  keyboardDismissMode = "interactive",
  showsVerticalScrollIndicator = false,
  ...rest
}: IKeyboardAwareScrollViewProps) {
  const resolvedBottomOffset = bottomOffset ?? keyboardVerticalOffset ?? 24;

  return (
    <StyledKeyboardAwareScrollView
      className={cn("flex-1", className)}
      contentContainerClassName={contentContainerClassName}
      bottomOffset={resolvedBottomOffset}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode={keyboardDismissMode}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...rest}
    >
      {children}
    </StyledKeyboardAwareScrollView>
  );
}
