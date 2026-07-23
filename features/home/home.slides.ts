import { DUMMY, IMG } from "@/data/mocks/mock.utils";
import type { TAppImage } from "@/types/common.types";

export interface IHomeHeroSlide {
  id: string;
  image: TAppImage;
  titleUrdu: string;
  subtitleUrdu: string;
  ctaLabel: string;
  href: string;
}

/** Three hero slides — Urdu copy for the town hub welcome band. */
export const HOME_HERO_SLIDES: IHomeHeroSlide[] = [
  {
    id: "slide-1",
    image: DUMMY.b,
    titleUrdu: "خوش آمدید!",
    subtitleUrdu: "اپنے محلے کی دکانوں، مقامات\nاور تقریبات ایک جگہ پر",
    ctaLabel: "Explore Your Hub",
    href: "/(tabs)/explore",
  },
  {
    id: "slide-2",
    image: IMG.community,
    titleUrdu: "ہماری کمیونٹی",
    subtitleUrdu: "پڑوسیوں سے جُڑیں، خبریں شیئر کریں\nاور محلے کو مضبوط بنائیں",
    ctaLabel: "Explore Your Hub",
    href: "/(tabs)/community",
  },
  {
    id: "slide-3",
    image: DUMMY.a,
    titleUrdu: "جیون حنا، گارڈن ٹاؤن",
    subtitleUrdu: "مقامی پسندیدہ جگہیں دریافت کریں\nاور بہترین تجربے تلاش کریں",
    ctaLabel: "Explore Your Hub",
    href: "/businesses",
  },
];
