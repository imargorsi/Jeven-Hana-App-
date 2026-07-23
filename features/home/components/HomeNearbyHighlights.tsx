import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import {
  NearbyHighlightCard,
  NEARBY_HIGHLIGHT_CARD_GAP,
  NEARBY_HIGHLIGHT_CARD_WIDTH,
} from "@/components/NearbyHighlightCard";
import {
  CarouselDots,
  ErrorState,
  LoadingBlock,
  SectionHeader,
} from "@/components/ui";
import { HomeSectionEmpty } from "@/features/home/components/HomeSectionEmpty";
import { useAutoScrollCarousel } from "@/features/home/useAutoScrollCarousel.hook";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinesses } from "@/lib/services/businesses.service";

const CARD_STEP = NEARBY_HIGHLIGHT_CARD_WIDTH + NEARBY_HIGHLIGHT_CARD_GAP;
const AUTO_INTERVAL_MS = 6000;

interface IHomeNearbyHighlightsProps {
  className?: string;
}

export function HomeNearbyHighlights({ className }: IHomeNearbyHighlightsProps) {
  const router = useRouter();

  const highlightsQuery = useQuery({
    queryKey: ["home-nearby-highlights"],
    queryFn: () => getBusinesses({ limit: 8 }),
  });

  const businesses = highlightsQuery.data?.items ?? [];

  const getOffsetForIndex = useCallback(
    (index: number) => index * CARD_STEP,
    [],
  );

  const {
    scrollRef,
    activeIndex,
    pause,
    resume,
    goToIndex,
    setIndexFromOffset,
  } = useAutoScrollCarousel({
    itemCount: businesses.length,
    intervalMs: AUTO_INTERVAL_MS,
    getOffsetForIndex,
  });

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIndexFromOffset(event.nativeEvent.contentOffset.x, CARD_STEP);
      resume();
    },
    [resume, setIndexFromOffset],
  );

  if (highlightsQuery.isLoading) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader title="Nearby Highlights" />
        <LoadingBlock className="py-10" />
      </View>
    );
  }

  if (highlightsQuery.isError) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader title="Nearby Highlights" />
        <ErrorState
          className="px-2 py-8"
          onRetry={() => void highlightsQuery.refetch()}
        />
      </View>
    );
  }

  if (businesses.length === 0) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader
          title="Nearby Highlights"
          actionLabel="View All"
          onActionPress={() => router.push(href("/(tabs)/explore"))}
        />
        <HomeSectionEmpty message="No nearby businesses yet." />
      </View>
    );
  }

  return (
    <View className={cn("mb-6", className)}>
      <SectionHeader
        title="Nearby Highlights"
        subtitle={`${businesses.length} ${businesses.length === 1 ? "place" : "places"} nearby`}
        actionLabel="View All"
        onActionPress={() => router.push(href("/(tabs)/explore"))}
      />

      <Pressable onHoverIn={pause} onHoverOut={resume}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_STEP}
          snapToAlignment="start"
          disableIntervalMomentum
          contentContainerStyle={{ gap: NEARBY_HIGHLIGHT_CARD_GAP }}
          onScrollBeginDrag={pause}
          onScrollEndDrag={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          {businesses.map((business) => (
            <NearbyHighlightCard key={business.id} business={business} />
          ))}
        </ScrollView>
      </Pressable>

      <CarouselDots
        count={businesses.length}
        activeIndex={activeIndex}
        onDotPress={(index) => {
          pause();
          goToIndex(index);
          resume();
        }}
        labelPrefix="Go to business highlight"
      />
    </View>
  );
}
