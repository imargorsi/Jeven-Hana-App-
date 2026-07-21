import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { BestOfCard } from "@/components/BestOfCard";
import { BusinessCard } from "@/components/BusinessCard";
import { CategoryCard } from "@/components/CategoryChip";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { EventCard } from "@/components/EventCard";
import { PlaceCard } from "@/components/PlaceCard";
import {
  AppHeader,
  ErrorState,
  LoadingBlock,
  Screen,
  SearchInput,
  SectionHeader,
  Text,
} from "@/components/ui";
import { href } from "@/lib/navigation.utils";
import { getBestOfListings } from "@/lib/services/best-of.service";
import { getBusinesses } from "@/lib/services/businesses.service";
import { getCommunityPosts } from "@/lib/services/community.service";
import { getEvents } from "@/lib/services/events.service";
import { getNotifications } from "@/lib/services/notifications.service";
import { getPlaces } from "@/lib/services/places.service";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const firstName = user?.firstName ?? "neighbour";

  const homeQuery = useQuery({
    queryKey: ["home-feed"],
    queryFn: async () => {
      const [businesses, places, bestOf, posts, events, notifs] =
        await Promise.all([
          getBusinesses({ featuredOnly: true, limit: 6 }),
          getPlaces({ nearbyOnly: true, limit: 6 }),
          getBestOfListings({ limit: 6 }),
          getCommunityPosts({ limit: 4 }),
          getEvents({ upcomingOnly: true, limit: 4 }),
          getNotifications(),
        ]);
      return { businesses, places, bestOf, posts, events, notifs };
    },
  });

  if (homeQuery.isLoading) {
    return (
      <Screen className="px-4">
        <AppHeader greeting={`Assalamualaikum, ${firstName}`} />
        <LoadingBlock />
      </Screen>
    );
  }

  if (homeQuery.isError || !homeQuery.data) {
    return (
      <Screen className="px-4">
        <AppHeader greeting={`Assalamualaikum, ${firstName}`} />
        <ErrorState onRetry={() => void homeQuery.refetch()} />
      </Screen>
    );
  }

  const { businesses, places, bestOf, posts, events, notifs } = homeQuery.data;
  const unread = notifs.filter((n) => !n.isRead).length;

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          greeting={`Assalamualaikum, ${firstName}`}
          unreadCount={unread}
        />

        <SearchInput
          value=""
          onChangeText={() => undefined}
          placeholder="Search businesses, places, events…"
          onPress={() => router.push(href("/search"))}
          className="mb-5"
        />

        <Pressable
          onPress={() => router.push(href("/best-of"))}
          className="mb-6 overflow-hidden rounded-card border border-primary/30"
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&q=80",
            }}
            className="h-40 w-full"
            contentFit="cover"
          />
          <View className="absolute inset-0 justify-end bg-background/50 p-4">
            <Text variant="h3">Jevan Hana Ka Best</Text>
            <Text variant="caption" tone="muted" className="mt-1">
              Curated local favourites · مقامی پسندیدہ
            </Text>
          </View>
        </Pressable>

        <SectionHeader title="Quick access" className="mb-2" />
        <View className="mb-6 flex-row flex-wrap gap-3">
          <CategoryCard
            title="Businesses"
            subtitle="دکانوں کی فہرست"
            onPress={() => router.push(href("/businesses"))}
            className="min-w-[46%]"
          />
          <CategoryCard
            title="Places"
            subtitle="مقامات"
            onPress={() => router.push(href("/places"))}
            className="min-w-[46%]"
          />
          <CategoryCard
            title="Events"
            subtitle="تقریبات"
            onPress={() => router.push(href("/(tabs)/events"))}
            className="min-w-[46%]"
          />
          <CategoryCard
            title="Community"
            subtitle="کمیونٹی"
            onPress={() => router.push(href("/(tabs)/community"))}
            className="min-w-[46%]"
          />
        </View>

        <SectionHeader
          title="Jevan Hana Ka Best"
          onActionPress={() => router.push(href("/best-of"))}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerClassName="gap-3"
        >
          {bestOf.items.map((listing) => (
            <BestOfCard key={listing.id} listing={listing} />
          ))}
        </ScrollView>

        <SectionHeader
          title="Featured businesses"
          onActionPress={() => router.push(href("/businesses"))}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerClassName="gap-3"
        >
          {businesses.items.map((biz) => (
            <BusinessCard key={biz.id} business={biz} variant="horizontal" />
          ))}
        </ScrollView>

        <SectionHeader
          title="Nearby places"
          onActionPress={() => router.push(href("/places"))}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerClassName="gap-3"
        >
          {places.items.map((place) => (
            <PlaceCard key={place.id} place={place} variant="horizontal" />
          ))}
        </ScrollView>

        <SectionHeader
          title="Community highlights"
          onActionPress={() => router.push(href("/(tabs)/community"))}
        />
        <View className="mb-6 gap-3">
          {posts.items.slice(0, 2).map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </View>

        <SectionHeader
          title="Upcoming events"
          onActionPress={() => router.push(href("/(tabs)/events"))}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3"
        >
          {events.items.map((event) => (
            <EventCard key={event.id} event={event} variant="horizontal" />
          ))}
        </ScrollView>
      </ScrollView>
    </Screen>
  );
}
