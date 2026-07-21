import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { BestOfCard } from "@/components/BestOfCard";
import { BusinessCard } from "@/components/BusinessCard";
import { CategoryChip } from "@/components/CategoryChip";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { EventCard } from "@/components/EventCard";
import { PlaceCard } from "@/components/PlaceCard";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
  SearchInput,
  Text,
} from "@/components/ui";
import {
  getSearchSuggestions,
  getTrendingSearches,
  searchAll,
} from "@/lib/services/search.service";
import { useSearchStore } from "@/stores/useSearchStore";
import type { TSearchTab } from "@/types/search.types";

const TABS: { key: TSearchTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "businesses", label: "Businesses" },
  { key: "places", label: "Places" },
  { key: "best-of", label: "Ka Best" },
  { key: "community", label: "Community" },
  { key: "events", label: "Events" },
];

export default function SearchScreen() {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [tab, setTab] = useState<TSearchTab>("all");
  const recent = useSearchStore((s) => s.recentSearches);
  const addRecent = useSearchStore((s) => s.addRecentSearch);
  const clearRecent = useSearchStore((s) => s.clearRecentSearches);
  const removeRecent = useSearchStore((s) => s.removeRecentSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input.trim()), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const trendingQuery = useQuery({
    queryKey: ["trending-searches"],
    queryFn: getTrendingSearches,
  });

  const suggestionsQuery = useQuery({
    queryKey: ["search-suggestions", input],
    queryFn: () => getSearchSuggestions(input),
    enabled: input.trim().length > 0 && debounced.length === 0,
  });

  const resultsQuery = useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchAll(debounced),
    enabled: debounced.length > 0,
  });

  const runSearch = (value: string) => {
    setInput(value);
    setDebounced(value.trim());
    if (value.trim()) addRecent(value.trim());
  };

  const results = resultsQuery.data;
  const totalCount = useMemo(() => {
    if (!results) return 0;
    return (
      results.businesses.length +
      results.places.length +
      results.bestOf.length +
      results.posts.length +
      results.events.length
    );
  }, [results]);

  const showIdle = debounced.length === 0;

  return (
    <Screen
      title="Search"
      showBack
      hideHeaderSearch
    >
      <View className="px-4 pt-1">
        <SearchInput
          value={input}
          onChangeText={setInput}
          autoFocus
          onSubmit={() => runSearch(input)}
          onClear={() => {
            setInput("");
            setDebounced("");
          }}
          className="mb-3"
        />
        {!showIdle ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {TABS.map((t) => (
              <CategoryChip
                key={t.key}
                label={t.label}
                isActive={tab === t.key}
                onPress={() => setTab(t.key)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      {showIdle ? (
        <ScrollView contentContainerClassName="px-4 pb-10">
          {recent.length > 0 ? (
            <View className="mb-6">
              <View className="mb-2 flex-row items-center justify-between">
                <Text variant="h3">Recent</Text>
                <Pressable onPress={clearRecent}>
                  <Text variant="label" tone="primary">
                    Clear
                  </Text>
                </Pressable>
              </View>
              {recent.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => runSearch(q)}
                  onLongPress={() => removeRecent(q)}
                  className="border-b border-cream/10 py-3"
                >
                  <Text>{q}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <Text variant="h3" className="mb-2">
            Trending
          </Text>
          {(trendingQuery.data ?? []).map((q) => (
            <Pressable
              key={q}
              onPress={() => runSearch(q)}
              className="border-b border-cream/10 py-3"
            >
              <Text>{q}</Text>
            </Pressable>
          ))}

          {(suggestionsQuery.data ?? []).length > 0 && input.length > 0 ? (
            <View className="mt-6">
              <Text variant="h3" className="mb-2">
                Suggestions
              </Text>
              {suggestionsQuery.data?.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => runSearch(q)}
                  className="border-b border-cream/10 py-3"
                >
                  <Text>{q}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </ScrollView>
      ) : resultsQuery.isLoading ? (
        <LoadingBlock />
      ) : resultsQuery.isError ? (
        <ErrorState onRetry={() => void resultsQuery.refetch()} />
      ) : totalCount === 0 ? (
        <EmptyState
          title="No results"
          description={`Nothing matched “${debounced}”.`}
        />
      ) : (
        <ScrollView contentContainerClassName="gap-3 px-4 pb-10">
          {(tab === "all" || tab === "businesses") &&
            results?.businesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          {(tab === "all" || tab === "places") &&
            results?.places.map((p) => <PlaceCard key={p.id} place={p} />)}
          {(tab === "all" || tab === "best-of") &&
            results?.bestOf.map((b) => (
              <BestOfCard key={b.id} listing={b} variant="vertical" />
            ))}
          {(tab === "all" || tab === "community") &&
            results?.posts.map((p) => (
              <CommunityPostCard key={p.id} post={p} />
            ))}
          {(tab === "all" || tab === "events") &&
            results?.events.map((e) => <EventCard key={e.id} event={e} />)}
        </ScrollView>
      )}
    </Screen>
  );
}
