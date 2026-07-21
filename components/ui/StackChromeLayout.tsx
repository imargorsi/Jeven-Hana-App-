import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/ui/AppHeader";
import { palette } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";

interface IStackChromeLayoutProps {
  children?: React.ReactNode;
}

/**
 * Shared stack chrome: global AppHeader + native stack title row (breadcrumb).
 */
export function StackChromeLayout({ children }: IStackChromeLayoutProps) {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="bg-background">
        <View className="px-4">
          <AppHeader />
        </View>
      </SafeAreaView>
      {children ?? (
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.cream,
            headerTitleStyle: {
              fontFamily: fonts.english.semibold,
              fontSize: 17,
            },
            headerShadowVisible: false,
            headerBackTitle: "",
            contentStyle: { backgroundColor: palette.background },
          }}
        />
      )}
    </View>
  );
}

export const stackChromeScreenOptions = {
  headerStyle: { backgroundColor: palette.background },
  headerTintColor: palette.cream,
  headerTitleStyle: {
    fontFamily: fonts.english.semibold,
    fontSize: 17,
  },
  headerShadowVisible: false,
  headerBackTitle: "",
  contentStyle: { backgroundColor: palette.background },
} as const;
