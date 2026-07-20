import { Link, Stack } from "expo-router";
import { View } from "react-native";

import { Text } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-background px-5">
        <Text variant="h2">This screen doesn&apos;t exist.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text variant="body" tone="primary" weight="semibold">
            Go to home screen
          </Text>
        </Link>
      </View>
    </>
  );
}
