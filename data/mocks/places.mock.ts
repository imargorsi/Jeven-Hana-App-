import { IMG } from "@/data/mocks/mock.utils";
import type { IPlace, IPlaceCategory } from "@/types/place.types";

const jevanLoc = {
  lat: 31.5032,
  lng: 74.3489,
  address: "Jevan Hana, Garden Town, Lahore",
};

export const placeCategories: IPlaceCategory[] = [
  { slug: "mosques", name: "Mosques", nameUrdu: "مساجد", icon: "building.columns.fill", count: 2 },
  { slug: "pharmacies", name: "Pharmacies", nameUrdu: "فارمیسی", icon: "cross.case.fill", count: 1 },
  { slug: "hospitals", name: "Hospitals & Clinics", nameUrdu: "ہسپتال", icon: "cross.fill", count: 1 },
  { slug: "parks", name: "Parks", nameUrdu: "پارکس", icon: "leaf.fill", count: 2 },
  { slug: "schools", name: "Schools", nameUrdu: "اسکول", icon: "graduationcap.fill", count: 1 },
  { slug: "banks", name: "Banks & ATMs", nameUrdu: "بینک", icon: "banknote.fill", count: 1 },
  { slug: "petrol", name: "Petrol Pumps", nameUrdu: "پٹرول پمپ", icon: "fuelpump.fill", count: 1 },
  { slug: "government", name: "Government Offices", nameUrdu: "سرکاری دفاتر", icon: "building.2.fill", count: 1 },
  { slug: "community-centres", name: "Community Centres", nameUrdu: "کمیونٹی سنٹر", icon: "person.3.fill", count: 1 },
];

export const places: IPlace[] = [
  {
    id: "place-1",
    name: "Masjid-e-Noor",
    nameUrdu: "مسجد نور",
    categorySlug: "mosques",
    description: "Central mosque for Jevan Hana residents — Jummah and daily prayers.",
    imageUrls: [IMG.mosque],
    phone: "+92421234567",
    location: { ...jevanLoc, address: "Central Square, Jevan Hana" },
    isNearby: true,
    tags: ["Jummah"],
  },
  {
    id: "place-2",
    name: "Hana Family Park",
    nameUrdu: "ہانا فیملی پارک",
    categorySlug: "parks",
    description: "Evening walks, kids play area, and weekend gatherings.",
    imageUrls: [IMG.park],
    location: { ...jevanLoc, address: "Block C, Jevan Hana" },
    isNearby: true,
    tags: ["Family", "Walks"],
  },
  {
    id: "place-3",
    name: "Garden Town Clinic",
    categorySlug: "hospitals",
    description: "General OPD and basic emergency care nearby.",
    imageUrls: [IMG.community],
    phone: "+92427654321",
    location: { ...jevanLoc, address: "Main Road, Garden Town" },
    isNearby: true,
    hours: [
      { day: "Mon–Sat", open: "09:00", close: "21:00" },
      { day: "Sun", open: "10:00", close: "14:00" },
    ],
  },
  {
    id: "place-4",
    name: "Jevan Hana Community Hall",
    categorySlug: "community-centres",
    description: "Town meetings, wedding halls, and neighbourhood events.",
    imageUrls: [IMG.event],
    phone: "+92421112233",
    location: { ...jevanLoc, address: "Community Block, Jevan Hana" },
    isNearby: true,
  },
  {
    id: "place-5",
    name: "Little Stars School",
    categorySlug: "schools",
    description: "Primary school serving Garden Town families.",
    imageUrls: [IMG.community],
    phone: "+92424445566",
    location: { ...jevanLoc, address: "School Lane, Jevan Hana" },
  },
  {
    id: "place-6",
    name: "HBL ATM — JH Market",
    categorySlug: "banks",
    description: "24/7 ATM outside Hana Mart.",
    imageUrls: [IMG.grocery],
    location: { ...jevanLoc, address: "JH Market" },
    isNearby: true,
  },
];
