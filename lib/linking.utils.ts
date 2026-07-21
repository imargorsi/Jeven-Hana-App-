import { Linking, Platform, Share } from "react-native";

export async function openPhone(phone: string) {
  const url = `tel:${phone.replace(/\s/g, "")}`;
  await Linking.openURL(url);
}

export async function openWhatsApp(phone: string, message?: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const text = message ? `&text=${encodeURIComponent(message)}` : "";
  const url = `https://wa.me/${digits}?${text}`;
  await Linking.openURL(url);
}

export async function openDirections(lat: number, lng: number, label?: string) {
  const encoded = encodeURIComponent(label ?? "Destination");
  const url = Platform.select({
    ios: `maps:0,0?q=${encoded}@${lat},${lng}`,
    android: `geo:${lat},${lng}?q=${lat},${lng}(${encoded})`,
    default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  });
  if (url) await Linking.openURL(url);
}

export async function shareContent(message: string, url?: string) {
  await Share.share({
    message: url ? `${message}\n${url}` : message,
  });
}
