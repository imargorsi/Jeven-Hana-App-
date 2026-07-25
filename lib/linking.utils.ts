import * as ExpoLinking from "expo-linking";
import { Linking, Platform, Share } from "react-native";

export async function openPhone(phone: string) {
  const url = `tel:${phone.replace(/\s/g, "")}`;
  await Linking.openURL(url);
}

export async function openEmail(email: string, subject?: string) {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  await Linking.openURL(`mailto:${email}${query}`);
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

/** Deep link into this app (`scheme` from app.config → e.g. `jevan-hana://…`). */
export function createAppUrl(path: string): string {
  const normalized = path.replace(/^\//, "");
  return ExpoLinking.createURL(normalized);
}

/**
 * Share an in-app deep link via the system sheet (Copy / WhatsApp / etc.).
 * Android ignores `url` — the link must live in `message` so recipients get the app link.
 */
export async function shareAppLink(path: string, title?: string) {
  const url = createAppUrl(path);

  try {
    if (Platform.OS === "ios") {
      await Share.share({
        url,
        ...(title ? { message: title } : {}),
      });
    } else {
      await Share.share({
        message: url,
        ...(title ? { title } : {}),
      });
    }
  } catch {
    // User dismissed the sheet or share is unavailable.
  }
}
