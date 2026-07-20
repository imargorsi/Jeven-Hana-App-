import type { SymbolViewProps } from "expo-symbols";

export interface IOnboardingFeature {
  id: string;
  labelUrduLine1: string;
  labelUrduLine2: string;
  symbol: NonNullable<SymbolViewProps["name"]>;
}
