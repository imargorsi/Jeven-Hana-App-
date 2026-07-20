import { View } from "react-native";

import { palette } from "@/constants/Colors";
import { mixHex } from "@/lib/color.utils";

const STOPS = 12;

/** Cream → primary vertical accent for feature rows. */
export function OnboardingAccentLine() {
  return (
    <View className="h-14 w-[2px] overflow-hidden rounded-full">
      {Array.from({ length: STOPS }).map((_, index) => (
        <View
          key={index}
          className="w-full flex-1"
          style={{
            backgroundColor: mixHex(
              palette.cream,
              palette.primary,
              index / (STOPS - 1),
            ),
          }}
        />
      ))}
    </View>
  );
}
