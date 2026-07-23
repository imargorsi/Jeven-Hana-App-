import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
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
import { getAdminCommunityHighlights } from "@/lib/services/community.service";

const AUTO_INTERVAL_MS = 7000;
const SLIDE_COUNT = 3;

interface IHomeCommunityUpdatesProps {
  className?: string;
}

export function HomeCommunityUpdates({ className }: IHomeCommunityUpdatesProps) {
  const router = useRouter();
  const [pageWidth, setPageWidth] = useState(0);

  const postsQuery = useQuery({
    queryKey: ["home-community-updates"],
    queryFn: () => getAdminCommunityHighlights(SLIDE_COUNT),
  });

  const posts = postsQuery.data ?? [];
  const canScroll = pageWidth > 0 && posts.length > 0;

  const getOffsetForIndex = useCallback(
    (index: number) => index * pageWidth,
    [pageWidth],
  );

  const {
    scrollRef,
    activeIndex,
    pause,
    resume,
    goToIndex,
    setIndexFromOffset,
  } = useAutoScrollCarousel({
    itemCount: canScroll ? posts.length : 0,
    intervalMs: AUTO_INTERVAL_MS,
    getOffsetForIndex,
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setPageWidth((current) => (current === nextWidth ? current : nextWidth));
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;
      setIndexFromOffset(event.nativeEvent.contentOffset.x, pageWidth);
      resume();
    },
    [pageWidth, resume, setIndexFromOffset],
  );

  if (postsQuery.isLoading) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader title="Community Updates" />
        <LoadingBlock className="py-10" />
      </View>
    );
  }

  if (postsQuery.isError) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader title="Community Updates" />
        <ErrorState
          className="px-2 py-8"
          onRetry={() => void postsQuery.refetch()}
        />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className={cn("mb-6", className)}>
        <SectionHeader
          title="Community Updates"
          actionLabel="View All"
          onActionPress={() => router.push(href("/(tabs)/community"))}
        />
        <HomeSectionEmpty message="No community updates yet." />
      </View>
    );
  }

  return (
    <View className={cn("mb-6", className)}>
      <SectionHeader
        title="Community Updates"
        actionLabel="View All"
        onActionPress={() => router.push(href("/(tabs)/community"))}
      />

      <Pressable
        onHoverIn={pause}
        onHoverOut={resume}
        onLayout={onLayout}
        className="overflow-hidden"
      >
        {pageWidth > 0 ? (
          <ScrollView
            ref={scrollRef}
            horizontal
            nestedScrollEnabled
            bounces={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={pageWidth}
            snapToAlignment="start"
            disableIntervalMomentum
            style={{ width: pageWidth }}
            onScrollBeginDrag={pause}
            onScrollEndDrag={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
            onMomentumScrollEnd={onMomentumScrollEnd}
          >
            {posts.map((post) => (
              <View
                key={post.id}
                style={{ width: pageWidth }}
                className="overflow-hidden"
              >
                <CommunityUpdateCard post={post} width={pageWidth} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <LoadingBlock className="py-10" />
        )}
      </Pressable>

      <CarouselDots
        count={posts.length}
        activeIndex={activeIndex}
        onDotPress={(index) => {
          pause();
          goToIndex(index);
          resume();
        }}
        labelPrefix="Go to community update"
      />
    </View>
  );
}
