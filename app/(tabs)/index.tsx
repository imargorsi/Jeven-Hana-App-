import { ScrollView, View } from "react-native";

import { Button, Card, Chip, Screen, Text } from "@/components/ui";

export default function HomeScreen() {
  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-10 pt-4"
      >
        <View className="gap-2">
          <Text variant="caption" tone="primary" weight="semibold">
            JEVAN HANA
          </Text>
          <Text variant="display">Theme preview</Text>
          <Text isUrdu variant="h3" tone="primary">
            خوش آمدید
          </Text>
          <Text variant="body" tone="muted">
            Design tokens, Noto Sans, and Noto Naskh Arabic — use Text, Button, Chip,
            and Card everywhere.
          </Text>
        </View>

        <Card className="gap-3">
          <Text variant="h3">Typography</Text>
          <Text variant="h1">Heading One</Text>
          <Text variant="h2">Heading Two</Text>
          <Text variant="body">Body copy for English content.</Text>
          <Text isUrdu variant="body">
            اپنا محلہ، اپنی پہچان
          </Text>
          <Text variant="caption" tone="muted">
            Caption / helper text
          </Text>
        </Card>

        <View className="gap-3">
          <Text variant="h3">Buttons</Text>
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
          <Button variant="ghost">Ghost action</Button>
          <Button variant="success">Success action</Button>
        </View>

        <View className="gap-3">
          <Text variant="h3">Chips</Text>
          <View className="flex-row flex-wrap gap-2">
            <Chip isActive>All</Chip>
            <Chip>Cafes</Chip>
            <Chip>Restaurants</Chip>
            <Chip>Shops</Chip>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
