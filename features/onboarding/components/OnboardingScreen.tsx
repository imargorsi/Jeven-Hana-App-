import { useRouter } from "expo-router";
import { Image, ImageBackground, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { OnboardingFeatureCards } from "@/features/onboarding/components/OnboardingFeatureCards";
import { ONBOARDING_TITLE_URDU } from "@/features/onboarding/onboarding.content";
import { withAlpha } from "@/lib/color.utils";
import { useAppStore } from "@/stores/useAppStore";

export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setHasOnboarded = useAppStore((state) => state.setHasOnboarded);

  const handleContinue = () => {
    setHasOnboarded(true);
    router.replace("/login");
  };

  return (
    <View className="flex-1 bg-background">
      <ImageBackground
        source={require("@/assets/images/splash-screen-bg.jpg")}
        className="absolute inset-0"
        resizeMode="cover"
      />
      <View
        className="absolute inset-0"
        style={{ backgroundColor: withAlpha(palette.background, 0.94) }}
      />

      <View
        className="flex-1 px-5"
        style={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 20) + 80,
        }}
      >
        <View className="flex-1 items-center justify-center">
          <View className="mb-6 w-full items-center px-2">
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
            source={require("@/assets/images/app-icon-transparent.png")}
            className="h-56 w-56"
            resizeMode="contain"
            accessibilityLabel="Jevan Hana"
          />
        </View>

        <OnboardingFeatureCards />
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 px-5"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <Button
          variant="primary"
          size="lg"
          isFullWidth
          onPress={handleContinue}
        >
          <Text
            isUrdu
            variant="h3"
            tone="background"
            weight="bold"
            className="text-center text-2xl"
            style={{ textAlign: "center" }}
          >
            شروع کریں
          </Text>
        </Button>
      </View>
    </View>
  );
}
