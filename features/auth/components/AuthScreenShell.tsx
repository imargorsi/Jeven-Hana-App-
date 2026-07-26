import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollView } from "@/components/ui";
import { palette } from "@/constants/Colors";
import { AuthBrandHeader } from "@/features/auth/components/AuthBrandHeader";
import { AuthPrivacyNote } from "@/features/auth/components/AuthPrivacyNote";

interface IAuthScreenShellProps {
  children: React.ReactNode;
  showBack?: boolean;
}

export function AuthScreenShell({
  children,
  showBack = true,
}: IAuthScreenShellProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <KeyboardAwareScrollView
        contentContainerClassName="grow px-5 pb-8"
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ paddingTop: Math.max(insets.top, 12) }}
      >
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go Back"
            onPress={() => router.back()}
            className="mb-2 h-10 w-10 items-center justify-center"
            hitSlop={8}
          >
            <SymbolView
              name={{
                ios: "chevron.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              tintColor={palette.cream}
              size={22}
            />
          </Pressable>
        ) : (
          <View className="h-10" />
        )}

        <AuthBrandHeader />

        <View className="mt-8">{children}</View>

        <View
          className="mt-8"
          style={{ paddingBottom: Math.max(insets.bottom, 8) }}
        >
          <AuthPrivacyNote />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
