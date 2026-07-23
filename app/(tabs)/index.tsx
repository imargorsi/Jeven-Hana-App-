import { ScrollView } from "react-native";

import { Screen } from "@/components/ui";
import { HomeCommunityUpdates } from "@/features/home/components/HomeCommunityUpdates";
import { HomeEvents } from "@/features/home/components/HomeEvents";
import { HomeHeroSlider } from "@/features/home/components/HomeHeroSlider";
import { HomeNearbyHighlights } from "@/features/home/components/HomeNearbyHighlights";
import { HomeQuickAccess } from "@/features/home/components/HomeQuickAccess";
import { HomeTownStrip } from "@/features/home/components/HomeTownStrip";

export default function HomeScreen() {
  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-12 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <HomeTownStrip />
        <HomeHeroSlider />
        <HomeQuickAccess />
        <HomeNearbyHighlights />
        <HomeCommunityUpdates />
        <HomeEvents />
      </ScrollView>
    </Screen>
  );
}
