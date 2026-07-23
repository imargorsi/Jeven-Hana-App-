import { Image } from "expo-image";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import type { TAppImage } from "@/types/common.types";

interface IAvatarProps {
  uri?: TAppImage | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_PX = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 96,
} as const;

/** Avatar with explicit pixel size — NativeWind sizing is unreliable on expo-image. */
export function Avatar({ uri, name, size = "md", className }: IAvatarProps) {
  const px = SIZE_PX[size];
  const initials =
    name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  if (uri) {
    return (
      <Image
        source={toImageSource(uri)}
        style={{
          width: px,
          height: px,
          borderRadius: px / 2,
          backgroundColor: palette.surface,
        }}
        className={className}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      className={cn("items-center justify-center", className)}
      style={{
        width: px,
        height: px,
        borderRadius: px / 2,
        backgroundColor: withAlpha(palette.primary, 0.2),
      }}
    >
      <Text
        variant={size === "xl" || size === "lg" ? "h3" : "caption"}
        tone="primary"
        weight="semibold"
      >
        {initials}
      </Text>
    </View>
  );
}
