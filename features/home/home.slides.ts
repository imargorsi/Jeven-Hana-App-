import { IMG } from "@/data/mocks/mock.utils";
import type { TAppImage } from "@/types/common.types";

export interface IHomeHeroSlide {
  id: string;
  image: TAppImage;
  badgeLabel: string;
  titleUrdu: string;
  subtitleUrdu: string;
  ctaLabel: string;
  href: string;
}

/** Three hero slides — Urdu copy aligned to the hub welcome mock. */
export const HOME_HERO_SLIDES: IHomeHeroSlide[] = [
  {
    id: "slide-1",
    image: IMG.street,
    badgeLabel: "Local Hub",
    titleUrdu: "خوش آمدید!",
    subtitleUrdu: "اپنے محلے کی دکانیں، مقامات\nاور تقریبات ایک جگہ پر",
    ctaLabel: "Explore Your Hub",
    href: "/(tabs)/explore",
  },
  {
    id: "slide-2",
    image: IMG.community,
    badgeLabel: "Local Hub",
    titleUrdu: "ہماری کمیونٹی",
    subtitleUrdu: "پڑوسیوں سے جُڑیں، خبریں شیئر کریں\nاور محلے کو مضبوط بنائیں",
    ctaLabel: "Explore Your Hub",
    href: "/(tabs)/community",
  },
  {
    id: "slide-3",
    image: IMG.restaurant,
    badgeLabel: "Local Hub",
    titleUrdu: "جیون حنا، گارڈن ٹاؤن",
    subtitleUrdu: "مقامی پسندیدہ جگہیں دریافت کریں\nاور بہترین تجربے تلاش کریں",
    ctaLabel: "Explore Your Hub",
    href: "/businesses",
  },
];
