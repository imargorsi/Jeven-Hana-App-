import { Image } from "expo-image";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { toImageSource } from "@/data/mocks/mock.utils";
import { cn } from "@/lib/cn.utils";
import type { TAppImage } from "@/types/common.types";

interface IAvatarProps {
  uri?: TAppImage | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16",
} as const;

export function Avatar({ uri, name, size = "md", className }: IAvatarProps) {
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
        className={cn("rounded-full bg-surface", sizeClass[size], className)}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      className={cn(
        "items-center justify-center rounded-full bg-primary/20",
        sizeClass[size],
        className,
      )}
    >
      <Text
        variant={size === "lg" ? "h3" : "caption"}
        tone="primary"
        weight="semibold"
      >
        {initials}
      </Text>
    </View>
  );
}
