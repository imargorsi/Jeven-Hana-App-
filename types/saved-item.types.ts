export type TSavedItemType = "business" | "place" | "event" | "best-of";

export interface ISavedItemRef {
  type: TSavedItemType;
  id: string;
  savedAt: string;
}
