export type TSavedItemType = "business" | "place" | "event";

export interface ISavedItemRef {
  type: TSavedItemType;
  id: string;
  savedAt: string;
}
