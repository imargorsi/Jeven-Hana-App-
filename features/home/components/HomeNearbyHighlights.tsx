import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  type LayoutChangeEvent,
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
  NearbyHighlightsSkeleton,
  SectionHeader,
} from "@/components/ui";
import { HomeSectionEmpty } from "@/features/home/components/HomeSectionEmpty";
import { useAutoScrollCarousel } from "@/features/home/useAutoScrollCarousel.hook";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";
import { getBusinesses } from "@/lib/services/businesses.service";
import type { IBusiness } from "@/types/business.types";

const CARD_STEP = NEARBY_HIGHLIGHT_CARD_WIDTH + NEARBY_HIGHLIGHT_CARD_GAP;
const AUTO_INTERVAL_MS = 12000;
/** Home nearby strip — keep payload small for slow networks. */
const HOME_NEARBY_LIMIT = 6;

interface IHomeNearbyHighlightsProps {
  className?: string;
}

export function HomeNearbyHighlights({
  className,
}: IHomeNearbyHighlightsProps) {
  const router = useRouter();
  const [viewportWidth, setViewportWidth] = useState(0);

  const highlightsQuery = useQuery({
    queryKey: ["home-nearby-highlights", HOME_NEARBY_LIMIT],
    queryFn: (): Promise<{ items: IBusiness[] }> =>
      getBusinesses({ limit: HOME_NEARBY_LIMIT }),
  });

  const businesses: IBusiness[] = highlightsQuery.data?.items ?? [];

  const getOffsetForIndex = useCallback(
    (index: number) => index * CARD_STEP,
    [],
  );

  /**
   * Last index that still fills the viewport (no lone card + empty half).
   * Next auto tick from here jumps back to the first card.
   */
  const maxAutoIndex = useMemo(() => {
    if (businesses.length <= 1) return 0;
    if (viewportWidth <= 0) return Math.max(0, businesses.length - 2);

    const contentWidth =
      businesses.length * NEARBY_HIGHLIGHT_CARD_WIDTH +
      (businesses.length - 1) * NEARBY_HIGHLIGHT_CARD_GAP;
    const maxScroll = Math.max(0, contentWidth - viewportWidth);
    const reachable = Math.floor(maxScroll / CARD_STEP);

    return Math.max(0, Math.min(businesses.length - 1, reachable));
  }, [businesses.length, viewportWidth]);

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
    maxIndex: maxAutoIndex,
  });

  const onViewportLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    setViewportWidth((current) => (current === next ? current : next));
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIndexFromOffset(event.nativeEvent.contentOffset.x, CARD_STEP);
      resume();
    },
    [resume, setIndexFromOffset],
  );

  if (highlightsQuery.isLoading) {
    return (
      <View className={cn(className)}>
        <SectionHeader isUrdu title="قریبی نمایاں جگہیں" />
        <NearbyHighlightsSkeleton />
      </View>
    );
  }

  if (highlightsQuery.isError) {
    return (
      <View className={cn(className)}>
        <SectionHeader isUrdu title="قریبی نمایاں جگہیں" />
        <ErrorState
          className="px-2 py-8"
          onRetry={() => void highlightsQuery.refetch()}
        />
      </View>
    );
  }

  if (businesses.length === 0) {
    return (
      <View className={cn(className)}>
        <SectionHeader
          isUrdu
          title="قریبی نمایاں جگہیں"
          actionLabel="View All"
          onActionPress={() => router.push(href("/(tabs)/explore"))}
        />
        <HomeSectionEmpty message="No nearby businesses yet." />
      </View>
    );
  }

  return (
    <View className={cn(className)}>
      <SectionHeader
        isUrdu
        title="قریبی نمایاں جگہیں"
        actionLabel="View All"
        onActionPress={() => router.push(href("/(tabs)/explore"))}
      />

      <Pressable onHoverIn={pause} onHoverOut={resume} onLayout={onViewportLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_STEP}
          snapToAlignment="start"
          disableIntervalMomentum
          contentContainerStyle={{ gap: NEARBY_HIGHLIGHT_CARD_GAP }}
          onTouchStart={pause}
          onTouchEnd={resume}
          onTouchCancel={resume}
          onScrollBeginDrag={pause}
          onScrollEndDrag={resume}
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
        labelPrefix="Go to Business Highlight"
      />
    </View>
  );
}
