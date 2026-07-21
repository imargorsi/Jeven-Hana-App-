import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FlatList, ScrollView } from "react-native";

import { CategoryChip } from "@/components/CategoryChip";
import { EventCard } from "@/components/EventCard";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
} from "@/components/ui";
import {
  getEventCategories,
  getEvents,
} from "@/lib/services/events.service";
import type { TEventCategorySlug } from "@/types/event.types";

type TEventsTab = "upcoming" | "past" | "featured";

export default function EventsTabScreen() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TEventsTab>("upcoming");
  const [category, setCategory] = useState<TEventCategorySlug | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["event-categories"],
    queryFn: getEventCategories,
  });

  const listQuery = useQuery({
    queryKey: ["events", tab, category, selectedDate],
    queryFn: () =>
      getEvents({
        upcomingOnly: tab === "upcoming",
        pastOnly: tab === "past",
        featuredOnly: tab === "featured",
        categorySlug: category === "all" ? undefined : category,
        date: selectedDate ?? undefined,
        limit: 40,
      }),
  });

  const dateChips = useMemo(() => {
    const days: { label: string; value: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const value = d.toISOString().slice(0, 10);
      const label =
        i === 0
          ? "Today"
          : d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
      days.push({ label, value });
    }
    return days;
  }, []);

  return (
    <Screen title="Events" subtitle="تقریبات">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2 px-4"
      >
        {(
          [
            ["upcoming", "Upcoming"],
            ["featured", "Featured"],
            ["past", "Past"],
          ] as const
        ).map(([key, label]) => (
          <CategoryChip
            key={key}
            label={label}
            isActive={tab === key}
            onPress={() => {
              setTab(key);
              setSelectedDate(null);
            }}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2 px-4"
      >
        <CategoryChip
          label="All categories"
          isActive={category === "all"}
          onPress={() => setCategory("all")}
        />
        {(categoriesQuery.data ?? []).map((cat) => (
          <CategoryChip
            key={cat.slug}
            label={cat.name}
            isActive={category === cat.slug}
            onPress={() => setCategory(cat.slug)}
          />
        ))}
      </ScrollView>

      {tab === "upcoming" ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3 px-4"
        >
          <CategoryChip
            label="Any date"
            isActive={!selectedDate}
            onPress={() => setSelectedDate(null)}
          />
          {dateChips.map((day) => (
            <CategoryChip
              key={day.value}
              label={day.label}
              isActive={selectedDate === day.value}
              onPress={() => setSelectedDate(day.value)}
            />
          ))}
        </ScrollView>
      ) : null}

      {listQuery.isLoading ? (
        <LoadingBlock />
      ) : listQuery.isError ? (
        <ErrorState onRetry={() => void listQuery.refetch()} />
      ) : (
        <FlatList
          data={listQuery.data?.items ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 px-4 pb-10"
          renderItem={({ item }) => <EventCard event={item} />}
          ListEmptyComponent={
            <EmptyState
              title="No events"
              description="Check back soon for neighbourhood gatherings."
            />
          }
          onRefresh={() => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
          }}
          refreshing={listQuery.isRefetching}
        />
      )}
    </Screen>
  );
}
