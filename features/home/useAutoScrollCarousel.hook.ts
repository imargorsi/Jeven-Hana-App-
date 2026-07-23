import { useCallback, useEffect, useRef, useState } from "react";
import type { ScrollView } from "react-native";

interface IUseAutoScrollCarouselOptions {
  itemCount: number;
  intervalMs: number;
  /** Pixel offset for a given index (e.g. index * cardStep). */
  getOffsetForIndex: (index: number) => number;
}

/**
 * Auto-advancing horizontal carousel with pause on hover / touch / drag.
 */
export function useAutoScrollCarousel({
  itemCount,
  intervalMs,
  getOffsetForIndex,
}: IUseAutoScrollCarouselOptions) {
  const scrollRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    clearResumeTimer();
    setIsPaused(true);
  }, [clearResumeTimer]);

  const resume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsPaused(false);
      }
    }, 600);
  }, [clearResumeTimer]);

  const goToIndex = useCallback(
    (index: number, animated = true) => {
      if (!isMountedRef.current || itemCount === 0) return;
      const next = ((index % itemCount) + itemCount) % itemCount;
      scrollRef.current?.scrollTo({
        x: getOffsetForIndex(next),
        animated,
      });
      setActiveIndex((current) => (current === next ? current : next));
    },
    [getOffsetForIndex, itemCount],
  );

  const setIndexFromOffset = useCallback(
    (offsetX: number, step: number) => {
      if (!isMountedRef.current || itemCount === 0 || step <= 0) return;
      const next = Math.max(
        0,
        Math.min(Math.round(offsetX / step), itemCount - 1),
      );
      setActiveIndex((current) => (current === next ? current : next));
    },
    [itemCount],
  );

  useEffect(() => {
    if (itemCount < 2 || isPaused) return;

    const timer = setInterval(() => {
      if (!isMountedRef.current) return;
      setActiveIndex((current) => {
        const next = (current + 1) % itemCount;
        scrollRef.current?.scrollTo({
          x: getOffsetForIndex(next),
          animated: true,
        });
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [getOffsetForIndex, intervalMs, isPaused, itemCount]);

  return {
    scrollRef,
    activeIndex,
    isPaused,
    pause,
    resume,
    goToIndex,
    setIndexFromOffset,
  };
}
