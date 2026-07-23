import { ScrollView, View } from "react-native";

import { Screen } from "@/components/ui";
import { HomeCommunityUpdates } from "@/features/home/components/HomeCommunityUpdates";
import { HomeHeroSlider } from "@/features/home/components/HomeHeroSlider";
import { HomeNearbyHighlights } from "@/features/home/components/HomeNearbyHighlights";
import { HomeQuickAccess } from "@/features/home/components/HomeQuickAccess";

/** Pixel spacing between Home sections (style prop — reliable across platforms). */
const SECTION_SPACING = 28;

export default function HomeScreen() {
  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-16 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: SECTION_SPACING }}>
          <HomeHeroSlider />
        </View>
        <View style={{ marginBottom: SECTION_SPACING }}>
          <HomeQuickAccess />
        </View>
        <View style={{ marginBottom: SECTION_SPACING }}>
          <HomeNearbyHighlights />
        </View>
        <View>
          <HomeCommunityUpdates />
        </View>
      </ScrollView>
    </Screen>
  );
}
