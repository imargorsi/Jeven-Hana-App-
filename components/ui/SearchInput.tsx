import { SymbolView } from "expo-symbols";
import { TextInput, Pressable, View } from "react-native";

import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";

interface ISearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  editable?: boolean;
  onPress?: () => void;
  className?: string;
  autoFocus?: boolean;
  /**
   * Placeholder may be Urdu for clarity. Typed input is always English LTR.
   */
  isUrduPlaceholder?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search Jevan Hana…",
  onSubmit,
  onClear,
  editable = true,
  onPress,
  className,
  autoFocus,
  isUrduPlaceholder = false,
}: ISearchInputProps) {
  const isEmpty = value.length === 0;

  const content = (
    <View
      className={cn(
        "min-h-12 flex-row items-center rounded-button border border-cream/15 bg-surface px-3",
        className,
      )}
    >
      <SymbolView
        name={{ ios: "magnifyingglass", android: "search", web: "search" }}
        size={18}
        tintColor={withAlpha(palette.cream, 0.5)}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={withAlpha(palette.cream, 0.4)}
        className="ml-2 flex-1 py-2 text-base text-cream"
        style={{
          // Urdu font only while showing the empty placeholder; typing stays English LTR.
          fontFamily:
            isUrduPlaceholder && isEmpty
              ? fonts.urdu.regular
              : fonts.english.regular,
          textAlign: "left",
          writingDirection: "ltr",
        }}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        editable={editable && !onPress}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && onClear ? (
        <Pressable onPress={onClear} hitSlop={8}>
          <SymbolView
            name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
            size={18}
            tintColor={withAlpha(palette.cream, 0.5)}
          />
        </Pressable>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
}
