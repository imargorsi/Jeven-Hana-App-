import { View } from "react-native";

import { Text } from "@/components/ui/Text";

interface IAuthFormHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthFormHeader({ title, subtitle }: IAuthFormHeaderProps) {
  return (
    <View className="gap-2">
      <Text variant="h1" tone="cream" weight="bold">
        {title}
      </Text>
      <Text variant="body" tone="muted">
        {subtitle}
      </Text>
    </View>
  );
}
