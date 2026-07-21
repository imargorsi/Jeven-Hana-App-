import { Image } from "expo-image";
import { useState } from "react";
import { ScrollView, Pressable, useWindowDimensions, View } from "react-native";

import { cn } from "@/lib/cn.utils";

interface IImageGalleryProps {
  urls: string[];
  className?: string;
  height?: number;
}

export function ImageGallery({
  urls,
  className,
  height = 220,
}: IImageGalleryProps) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const images = urls.length > 0 ? urls : [];

  if (images.length === 0) {
    return <View className={cn("bg-surface", className)} style={{ height }} />;
  }

  return (
    <View className={className}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(next);
        }}
      >
        {images.map((uri) => (
          <Image
            key={uri}
            source={{ uri }}
            style={{ width, height }}
            contentFit="cover"
          />
        ))}
      </ScrollView>
      {images.length > 1 ? (
        <View className="absolute bottom-3 w-full flex-row justify-center gap-1.5">
          {images.map((uri, i) => (
            <Pressable key={uri} onPress={() => setIndex(i)}>
              <View
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i === index ? "bg-primary" : "bg-cream/40",
                )}
              />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
