import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { CarouselDots } from "@/components/ui/CarouselDots";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import {
  HOME_HERO_SLIDES,
  type IHomeHeroSlide,
} from "@/features/home/home.slides";
import { cn } from "@/lib/cn.utils";
import { href } from "@/lib/navigation.utils";

/** Matches Home screen content `px-4`. */
const SCREEN_GUTTER = 16;
const SLIDE_HEIGHT = 200;

interface IHomeHeroSliderProps {
  className?: string;
}

export function HomeHeroSlider({ className }: IHomeHeroSliderProps) {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(false);

  const slideWidth = windowWidth - SCREEN_GUTTER * 2;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateActiveIndex = useCallback((index: number) => {
    if (!isMountedRef.current) return;
    const next = Math.max(0, Math.min(index, HOME_HERO_SLIDES.length - 1));
    setActiveIndex((current) => (current === next ? current : next));
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      scrollRef.current?.scrollTo({
        x: index * slideWidth,
        animated: true,
      });
      updateActiveIndex(index);
    },
    [slideWidth, updateActiveIndex],
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / slideWidth,
      );
      updateActiveIndex(index);
    },
    [slideWidth, updateActiveIndex],
  );

  return (
    <View className={cn(className)}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={{ height: SLIDE_HEIGHT }}
      >
        {HOME_HERO_SLIDES.map((slide) => (
          <HeroSlide
            key={slide.id}
            slide={slide}
            width={slideWidth}
            onCtaPress={() => router.push(href(slide.href))}
          />
        ))}
      </ScrollView>

      <CarouselDots
        count={HOME_HERO_SLIDES.length}
        activeIndex={activeIndex}
        onDotPress={goToIndex}
        labelPrefix="Go to hero slide"
      />
    </View>
  );
}

interface IHeroSlideProps {
  slide: IHomeHeroSlide;
  width: number;
  onCtaPress: () => void;
}

function HeroSlide({ slide, width, onCtaPress }: IHeroSlideProps) {
  return (
    <View
      style={{ width, height: SLIDE_HEIGHT }}
      className="overflow-hidden rounded-card border border-cream/10"
    >
      <Image
        source={toImageSource(slide.image)}
        style={{ width, height: SLIDE_HEIGHT }}
        contentFit="cover"
        transition={200}
      />
      <View className="absolute inset-0 bg-background/50" />
      <View className="absolute inset-0 justify-between p-3.5">
        <View className="items-end pt-0.5">
          <Text
            isUrdu
            variant="h1"
            weight="bold"
            className="text-right"
            numberOfLines={2}
          >
            {slide.titleUrdu}
          </Text>
          <Text
            isUrdu
            variant="bodySmall"
            tone="muted"
            className="mt-1.5 text-right"
            numberOfLines={2}
          >
            {slide.subtitleUrdu}
          </Text>
        </View>

        <View className="items-end">
          <Button
            size="sm"
            onPress={onCtaPress}
            className="flex-row items-center gap-2 self-end px-3.5"
          >
            <Text variant="button" tone="background">
              {slide.ctaLabel}
            </Text>
            <SymbolView
              name={{
                ios: "arrow.right",
                android: "arrow_forward",
                web: "arrow_forward",
              }}
              size={15}
              tintColor={palette.background}
            />
          </Button>
        </View>
      </View>
    </View>
  );
}
