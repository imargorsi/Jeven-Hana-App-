import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { CarouselDots } from "@/components/ui/CarouselDots";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { toImageSource } from "@/data/mocks/mock.utils";
import {
  HOME_HERO_SLIDES,
  type IHomeHeroSlide,
} from "@/features/home/home.slides";
import { cn } from "@/lib/cn.utils";
import { withAlpha } from "@/lib/color.utils";
import { href } from "@/lib/navigation.utils";

const SLIDE_HEIGHT = 168;

interface IHomeHeroSliderProps {
  className?: string;
}

export function HomeHeroSlider({ className }: IHomeHeroSliderProps) {
  const router = useRouter();
  const [slideWidth, setSlideWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setSlideWidth((current) => (current === nextWidth ? current : nextWidth));
  }, []);

  const updateActiveIndex = useCallback((index: number) => {
    if (!isMountedRef.current) return;
    const next = Math.max(0, Math.min(index, HOME_HERO_SLIDES.length - 1));
    setActiveIndex((current) => (current === next ? current : next));
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      if (slideWidth <= 0) return;
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
      if (slideWidth <= 0) return;
      const index = Math.round(
        event.nativeEvent.contentOffset.x / slideWidth,
      );
      updateActiveIndex(index);
    },
    [slideWidth, updateActiveIndex],
  );

  return (
    <View className={cn(className)}>
      <View
        onLayout={onLayout}
        className="overflow-hidden rounded-card border border-cream/10 bg-surface"
        style={{ height: SLIDE_HEIGHT }}
      >
        {slideWidth > 0 ? (
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
            onMomentumScrollEnd={onMomentumScrollEnd}
            style={{ width: slideWidth, height: SLIDE_HEIGHT }}
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
        ) : null}
      </View>

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
    <View style={{ width, height: SLIDE_HEIGHT }} className="overflow-hidden">
      <Image
        source={toImageSource(slide.image)}
        style={{ width, height: SLIDE_HEIGHT }}
        contentFit="cover"
        transition={250}
      />

      <LinearGradient
        colors={[
          withAlpha(palette.background, 0.2),
          withAlpha(palette.background, 0.45),
          withAlpha(palette.background, 0.92),
        ]}
        locations={[0, 0.4, 1]}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />

      <View className="absolute inset-0 justify-end px-4 pb-4 pt-3">
        <View className="items-end">
          <Text
            isUrdu
            variant="h3"
            weight="bold"
            className="text-right"
            numberOfLines={1}
          >
            {slide.titleUrdu}
          </Text>
          <Text
            isUrdu
            variant="caption"
            className="mt-1 max-w-[88%] text-right text-cream/70"
            numberOfLines={2}
          >
            {slide.subtitleUrdu}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={slide.ctaLabel}
            onPress={onCtaPress}
            className="mt-3 overflow-hidden rounded-full active:opacity-90"
          >
            <LinearGradient
              colors={[palette.primarySoft, palette.primary, palette.primaryDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 10,
                paddingLeft: 16,
                paddingRight: 10,
              }}
            >
              <Text variant="caption" weight="bold" tone="background">
                {slide.ctaLabel}
              </Text>
              <View
                className="h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: withAlpha(palette.background, 0.2) }}
              >
                <SymbolView
                  name={{
                    ios: "arrow.right",
                    android: "arrow_forward",
                    web: "arrow_forward",
                  }}
                  size={12}
                  tintColor={palette.background}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
