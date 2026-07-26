import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Image, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import {
  ONBOARDING_TAGLINE_URDU,
  ONBOARDING_TITLE_URDU,
} from "@/features/onboarding/onboarding.content";
import { withAlpha } from "@/lib/color.utils";
import { useAppStore } from "@/stores/useAppStore";

export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);

  const handleContinue = () => {
    setHasOnboarded(true);
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="flex-1 items-center justify-center px-6"
        style={{
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <View className="w-full max-w-sm items-center">
          <View className="w-full items-center px-1">
            <Text
              isUrdu
              variant="h1"
              tone="cream"
              weight="bold"
              className="w-full text-center text-4xl"
              style={{ textAlign: "center" }}
            >
              {ONBOARDING_TITLE_URDU.line1}
            </Text>
            <Text
              isUrdu
              variant="h1"
              tone="primary"
              weight="bold"
              className="mt-2 w-full text-center text-4xl"
              style={{ textAlign: "center" }}
            >
              {ONBOARDING_TITLE_URDU.line2}
            </Text>
          </View>

          <Image
            source={require("@/assets/images/logo.png")}
            className="mt-10 h-52 w-52"
            resizeMode="contain"
            accessibilityLabel="Jevan Hana"
          />

          <View className="mt-10 w-full items-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="شروع کریں"
              onPress={handleContinue}
              className="relative w-full overflow-hidden rounded-card border border-cream/15 bg-surface active:opacity-90"
              style={{
                shadowColor: palette.background,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.28,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <LinearGradient
                colors={[
                  withAlpha(palette.primary, 0.22),
                  withAlpha(palette.primary, 0.06),
                  withAlpha(palette.surface, 0),
                ]}
                locations={[0, 0.45, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />

              <View className="flex-row items-center gap-3.5 px-4 py-4">
                <View
                  className="h-12 w-12 items-center justify-center rounded-full bg-primary/15"
                  style={{
                    borderWidth: 1.5,
                    borderColor: withAlpha(palette.primary, 0.45),
                  }}
                >
                  <SymbolView
                    name={{
                      ios: "arrow.right",
                      android: "arrow_forward",
                      web: "arrow_forward",
                    }}
                    size={22}
                    tintColor={palette.primary}
                  />
                </View>

                <View className="min-w-0 flex-1">
                  <Text
                    isUrdu
                    variant="h3"
                    weight="bold"
                    className="text-left text-2xl"
                    style={{ textAlign: "left" }}
                  >
                    شروع کریں
                  </Text>
                </View>

                <View
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    borderWidth: 1.5,
                    borderColor: withAlpha(palette.cream, 0.28),
                    backgroundColor: withAlpha(palette.cream, 0.06),
                  }}
                >
                  <SymbolView
                    name={{
                      ios: "chevron.right",
                      android: "chevron_right",
                      web: "chevron_right",
                    }}
                    size={18}
                    tintColor={palette.cream}
                  />
                </View>
              </View>
            </Pressable>

            <Text
              isUrdu
              variant="bodySmall"
              tone="muted"
              weight="medium"
              className="mt-4 w-full text-center text-base"
              style={{ textAlign: "center" }}
            >
              {ONBOARDING_TAGLINE_URDU}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
