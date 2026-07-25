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

import { CarouselDots } from "@/components/ui/CarouselDots";
import { palette } from "@/constants/Colors";
import {
  HERO_SLIDE_HEIGHT,
  HomeHeroSlideCard,
} from "@/features/home/components/HomeHeroSlideCard";
import { HOME_HERO_SLIDES } from "@/features/home/home.slides";
import { useAutoScrollCarousel } from "@/features/home/useAutoScrollCarousel.hook";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";

const AUTO_INTERVAL_MS = 5000;

/** Same elevation language as EventCard. */
const CARD_SHADOW = {
  shadowColor: palette.background,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.45,
  shadowRadius: 18,
  elevation: 8,
} as const;

interface IHomeHeroSliderProps {
  className?: string;
}

export function HomeHeroSlider({ className }: IHomeHeroSliderProps) {
  const router = useRouter();
  const [slideWidth, setSlideWidth] = useState(0);

  const getOffsetForIndex = useCallback(
    (index: number) => index * slideWidth,
    [slideWidth],
  );

  const {
    scrollRef,
    activeIndex,
    pause,
    resume,
    goToIndex,
    setIndexFromOffset,
  } = useAutoScrollCarousel({
    itemCount: slideWidth > 0 ? HOME_HERO_SLIDES.length : 0,
    intervalMs: AUTO_INTERVAL_MS,
    getOffsetForIndex,
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setSlideWidth((current) => (current === nextWidth ? current : nextWidth));
  }, []);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (slideWidth <= 0) return;
      setIndexFromOffset(event.nativeEvent.contentOffset.x, slideWidth);
      resume();
    },
    [resume, setIndexFromOffset, slideWidth],
  );

  return (
    <View className={cn(className)}>
      <View
        onLayout={onLayout}
        className="overflow-hidden rounded-card bg-background"
        style={[
          CARD_SHADOW,
          {
            height: HERO_SLIDE_HEIGHT,
            borderWidth: 1.5,
            borderColor: palette.primary,
          },
        ]}
      >
        {slideWidth > 0 ? (
          <Pressable onHoverIn={pause} onHoverOut={resume}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              bounces={false}
              overScrollMode="never"
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={slideWidth}
              snapToAlignment="start"
              disableIntervalMomentum
              onScrollBeginDrag={pause}
              onScrollEndDrag={resume}
              onTouchStart={pause}
              onTouchEnd={resume}
              onTouchCancel={resume}
              onMomentumScrollEnd={onMomentumScrollEnd}
              style={{ width: slideWidth, height: HERO_SLIDE_HEIGHT }}
            >
              {HOME_HERO_SLIDES.map((slide) => (
                <HomeHeroSlideCard
                  key={slide.id}
                  slide={slide}
                  width={slideWidth}
                  onCtaPress={() => router.push(href(slide.href))}
                />
              ))}
            </ScrollView>
          </Pressable>
        ) : null}
      </View>

      <CarouselDots
        count={HOME_HERO_SLIDES.length}
        activeIndex={activeIndex}
        onDotPress={(index) => {
          pause();
          goToIndex(index);
          resume();
        }}
        variant="round"
        labelPrefix="Go to Hero Slide"
      />
    </View>
  );
}
