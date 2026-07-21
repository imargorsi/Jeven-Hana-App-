/** Simulated network delay for mock services. */
export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function paginate<T>(
  items: T[],
  cursor: string | null | undefined,
  limit = 20,
): { items: T[]; nextCursor: string | null; total: number } {
  const start = cursor ? Number(cursor) : 0;
  const slice = items.slice(start, start + limit);
  const next = start + limit < items.length ? String(start + limit) : null;
  return { items: slice, nextCursor: next, total: items.length };
}

/** Placeholder images — replace with CDN/local assets later. */
export const IMG = {
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
  restaurant:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  park: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800&q=80",
  mosque:
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80",
  grocery:
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
  event:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  chai: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80",
  barber:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
  community:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
};
