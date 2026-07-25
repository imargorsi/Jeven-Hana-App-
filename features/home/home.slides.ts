import { IMG } from "@/data/mocks/mock.utils";
import type { TAppImage } from "@/types/common.types";

export interface IHomeHeroSlide {
  id: string;
  image: TAppImage;
  badgeLabel: string;
  titleUrdu: string;
  subtitleUrdu: string;
}

/** Three hero slides — Urdu titles use explicit line breaks for readable layout. */
export const HOME_HERO_SLIDES: IHomeHeroSlide[] = [
  {
    id: "slide-1",
    image: IMG.street,
    badgeLabel: "Local Hub",
    titleUrdu: "آپ کا محلہ،\nاب ایک جگہ",
    subtitleUrdu:
      "اپنے علاقے کی ہر اہم چیز آسانی سے دریافت کریں\nقریبی جگہیں، لوگ اور روزمرہ کی سرگرمیاں",
  },
  {
    id: "slide-2",
    image: IMG.community,
    badgeLabel: "Local Hub",
    titleUrdu: "اپنا کاروبار سب\nتک پہنچائیں",
    subtitleUrdu:
      "اپنی دکان یا سروس کو لسٹ کریں\nاور اپنے محلے کے لوگوں تک آسانی سے پہنچیں",
  },
  {
    id: "slide-3",
    image: IMG.restaurant,
    badgeLabel: "Local Hub",
    titleUrdu: "اپنے لوگوں کے\nساتھ جڑیں",
    subtitleUrdu:
      "پڑوسیوں سے جُڑیں، خبریں شیئر کریں\nاور اپنے محلے کو مضبوط بنائیں",
  },
];
