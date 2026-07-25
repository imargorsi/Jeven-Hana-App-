import type { TAppImage } from "@/types/common.types";

export interface IHomeHeroSlide {
  id: string;
  image: TAppImage;
  badgeLabel: string;
  titleUrdu: string;
  subtitleUrdu: string;
}

const SLIDER_BASE =
  "https://pub-c0aa45939b354151b6669becf933b4d8.r2.dev/Slider";

/** Three hero slides — Urdu titles use explicit line breaks for readable layout. */
export const HOME_HERO_SLIDES: IHomeHeroSlide[] = [
  {
    id: "slide-1",
    image: `${SLIDER_BASE}/1.jpg`,
    badgeLabel: "Chota Chowk",
    titleUrdu: "آپ کا محلہ،\nاب ایک جگہ",
    subtitleUrdu:
      "اپنے علاقے کی ہر اہم چیز آسانی سے دریافت کریں\nقریبی جگہیں، لوگ اور روزمرہ کی سرگرمیاں",
  },
  {
    id: "slide-2",
    image: `${SLIDER_BASE}/2.jpg`,
    badgeLabel: "Bara Chowk",
    titleUrdu: "اپنا کاروبار سب\nتک پہنچائیں",
    subtitleUrdu:
      "اپنی دکان یا سروس کو لسٹ کریں\nاور اپنے محلے کے لوگوں تک آسانی سے پہنچیں",
  },
  {
    id: "slide-3",
    image: `${SLIDER_BASE}/3.jpg`,
    badgeLabel: "Barkat Market",
    titleUrdu: "اپنے لوگوں کے\nساتھ جڑیں",
    subtitleUrdu:
      "پڑوسیوں سے جُڑیں، خبریں شیئر کریں\nاور اپنے محلے کو مضبوط بنائیں",
  },
];
