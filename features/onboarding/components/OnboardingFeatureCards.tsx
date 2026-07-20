import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { OnboardingAccentLine } from "@/features/onboarding/components/OnboardingAccentLine";
import { ONBOARDING_FEATURES } from "@/features/onboarding/onboarding.content";

export function OnboardingFeatureCards() {
  return (
    <View className="w-full gap-6">
      {ONBOARDING_FEATURES.map((feature) => (
        <View
          key={feature.id}
          className="w-full flex-row items-center gap-4 px-1"
        >
          <View className="w-10 items-center justify-center">
            <SymbolView
              name={feature.symbol}
              tintColor={palette.cream}
              size={30}
            />
          </View>

          <OnboardingAccentLine />

          <View className="min-w-0 flex-1">
            <Text
              isUrdu
              variant="h3"
              tone="cream"
              weight="medium"
              className="w-full text-xl"
              style={{ textAlign: "right" }}
            >
              {feature.labelUrduLine1}
            </Text>
            <Text
              isUrdu
              variant="h3"
              tone="primary"
              weight="semibold"
              className="mt-1 w-full text-xl"
              style={{ textAlign: "right", lineHeight: 36 }}
            >
              {feature.labelUrduLine2}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
