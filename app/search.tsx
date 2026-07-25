import { useAuth } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { BusinessCard } from "@/components/BusinessCard";
import { CommunityUpdateCard } from "@/components/CommunityUpdateCard";
import { EventCard } from "@/components/EventCard";
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  Screen,
  SearchInput,
  Text,
} from "@/components/ui";
import { StackBackButton } from "@/components/ui/StackBackButton";
import { isClerkConfigured } from "@/features/auth/auth.config";
import { useCommunityPosts } from "@/features/community/useCommunityPosts.hook";
import { SearchChipCloud } from "@/features/search/components/SearchChipCloud";
import {
  SearchFilterRow,
  TAB_LABEL,
} from "@/features/search/components/SearchFilterRow";
import {
  getSearchSuggestions,
  getTrendingSearches,
  searchAll,
} from "@/lib/services/search.service";
import { useSearchStore } from "@/stores/useSearchStore";
import type { TSearchTab } from "@/types/search.types";

type TGetToken = () => Promise<string | null>;

export default function SearchScreen() {
  if (!isClerkConfigured) {
    return <SearchScreenInner getToken={async () => null} />;
  }

  return <SearchScreenWithClerk />;
}

function SearchScreenWithClerk() {
  const { getToken } = useAuth();
  return <SearchScreenInner getToken={getToken} />;
}

function SearchScreenInner({ getToken }: { getToken: TGetToken }) {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [tab, setTab] = useState<TSearchTab>("all");
  const recent = useSearchStore((s) => s.recentSearches);
  const addRecent = useSearchStore((s) => s.addRecentSearch);
  const clearRecent = useSearchStore((s) => s.clearRecentSearches);
  const removeRecent = useSearchStore((s) => s.removeRecentSearch);
  const { likePost } = useCommunityPosts();

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input.trim()), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const trendingQuery = useQuery({
    queryKey: ["trending-searches"],
    queryFn: () => getTrendingSearches(getToken),
    staleTime: 60_000,
  });

  const suggestions = useMemo(() => {
    if (input.trim().length === 0 || debounced.length > 0) return [];
    return getSearchSuggestions(input, trendingQuery.data ?? []);
  }, [input, debounced, trendingQuery.data]);

  const resultsQuery = useQuery({
    queryKey: ["search", debounced, tab],
    queryFn: () => searchAll(debounced, getToken, tab),
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
      results.businesses.length + results.posts.length + results.events.length
    );
  }, [results]);

  const visibleCount = useMemo(() => {
    if (!results) return 0;
    if (tab === "all") return totalCount;
    if (tab === "businesses") return results.businesses.length;
    if (tab === "community") return results.posts.length;
    return results.events.length;
  }, [results, tab, totalCount]);

  const showIdle = debounced.length === 0;

  return (
    <Screen withAppHeader={false}>
      <View className="px-4 pb-3 pt-1">
        <View className="mb-1 flex-row items-center gap-2.5">
          <StackBackButton className="ml-0 mr-0" />
          <View className="min-w-0 flex-1">
            <SearchInput
              value={input}
              onChangeText={setInput}
              autoFocus
              placeholder="کسی جگہ، کاروبار یا پوسٹ کو تلاش کریں…"
              isUrdu
              onSubmit={() => runSearch(input)}
              onClear={() => {
                setInput("");
                setDebounced("");
                setTab("all");
              }}
              className="rounded-full border-cream/10 bg-surface"
            />
          </View>
        </View>

        {!showIdle ? (
          <View className="mt-3.5">
            <SearchFilterRow selected={tab} onSelect={setTab} />
            {!resultsQuery.isLoading && !resultsQuery.isError ? (
              <Text variant="caption" tone="muted" className="mt-2.5">
                {visibleCount} {visibleCount === 1 ? "result" : "results"}
                {tab !== "all" ? ` · ${TAB_LABEL[tab]}` : ""}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {showIdle ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-4 pb-10 pt-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SearchChipCloud
            title="Recent"
            items={recent}
            variant="recent"
            onSelect={runSearch}
            onClear={clearRecent}
            onLongPressItem={removeRecent}
          />

          <SearchChipCloud
            title="Trending in Jevan Hana"
            items={trendingQuery.data ?? []}
            variant="trending"
            onSelect={runSearch}
          />

          {suggestions.length > 0 && input.length > 0 ? (
            <SearchChipCloud
              title="Suggestions"
              items={suggestions}
              variant="suggestion"
              onSelect={runSearch}
            />
          ) : null}

          {recent.length === 0 && (trendingQuery.data?.length ?? 0) === 0 ? (
            <View className="rounded-card border border-dashed border-cream/15 bg-surface/50 px-4 py-10">
              <Text
                variant="bodySmall"
                weight="medium"
                className="text-center"
              >
                Search Jevan Hana
              </Text>
              <Text
                variant="caption"
                tone="muted"
                className="mt-1.5 text-center"
              >
                Find businesses, events, and community updates.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      ) : resultsQuery.isLoading ? (
        <LoadingBlock className="py-16" />
      ) : resultsQuery.isError ? (
        <ErrorState onRetry={() => void resultsQuery.refetch()} />
      ) : visibleCount === 0 ? (
        <EmptyState
          title="No Results"
          description={`Nothing matched “${debounced}”. Try another word or filter.`}
        />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3.5 px-4 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {(tab === "all" || tab === "businesses") &&
            results?.businesses.map((b) => (
              <BusinessCard key={b.id} business={b} variant="compact" />
            ))}
          {(tab === "all" || tab === "community") &&
            results?.posts.map((p) => (
              <CommunityUpdateCard key={p.id} post={p} onLike={likePost} />
            ))}
          {(tab === "all" || tab === "events") &&
            results?.events.map((e) => <EventCard key={e.id} event={e} />)}
        </ScrollView>
      )}
    </Screen>
  );
}
