import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

interface IAuthFormHeaderProps {
  title: string;
  subtitle: string;
  isUrdu?: boolean;
}

export function AuthFormHeader({
  title,
  subtitle,
  isUrdu = false,
}: IAuthFormHeaderProps) {
  return (
    <View className="gap-2">
      <Text
        variant="h1"
        tone="cream"
        weight="bold"
        isUrdu={isUrdu}
        className={cn(isUrdu && "text-right")}
      >
        {title}
      </Text>
      <Text
        variant="body"
        tone="muted"
        isUrdu={isUrdu}
        className={cn(isUrdu && "text-right")}
      >
        {subtitle}
      </Text>
    </View>
  );
}
