import type { IOnboardingFeature } from "@/features/onboarding/onboarding.types";

export const ONBOARDING_TITLE_URDU = {
  line1: "ہم سب مل کر",
  line2: "جیون ہانہ کو بہتر بنائیں",
} as const;

export const ONBOARDING_FEATURES: IOnboardingFeature[] = [
  {
    id: "connect",
    labelUrduLine1: "اپنے پنڈ سے",
    labelUrduLine2: "جڑے رہیں",
    symbol: {
      ios: "person.3",
      android: "groups",
      web: "groups",
    },
  },
  {
    id: "community",
    labelUrduLine1: "پنڈ کے تمام معاملات",
    labelUrduLine2: "ایک جگہ",
    symbol: {
      ios: "person.2.wave.2",
      android: "diversity_3",
      web: "diversity_3",
    },
  },
  {
    id: "news",
    labelUrduLine1: "پنڈ جیون ہانہ کی",
    labelUrduLine2: "ہر خبر",
    symbol: {
      ios: "newspaper",
      android: "newspaper",
      web: "feed",
    },
  },
];
