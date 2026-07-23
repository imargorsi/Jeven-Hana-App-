import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";
import {
  openDirections,
  openPhone,
  openWhatsApp,
} from "@/lib/linking.utils";

interface IContactActionsProps {
  phone?: string;
  whatsapp?: string;
  lat?: number;
  lng?: number;
  label?: string;
  onShare?: () => void;
  className?: string;
}

interface IActionTileProps {
  label: string;
  onPress: () => void;
  icon: {
    ios: string;
    android: string;
    web: string;
  };
  tint: string;
}

function ActionTile({ label, onPress, icon, tint }: IActionTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="min-h-[72px] flex-1 items-center justify-center rounded-2xl border border-cream/10 bg-surface px-1 py-2.5 active:opacity-80"
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-background/55">
        <SymbolView name={icon} size={18} tintColor={tint} />
      </View>
      <Text variant="caption" weight="medium" className="mt-1.5 text-center">
        {label}
      </Text>
    </Pressable>
  );
}

export function ContactActions({
  phone,
  whatsapp,
  lat,
  lng,
  label,
  onShare,
  className,
}: IContactActionsProps) {
  const hasDirections = typeof lat === "number" && typeof lng === "number";

  return (
    <View className={cn("flex-row gap-2.5", className)}>
      {phone ? (
        <ActionTile
          label="Call"
          tint={palette.primary}
          icon={{
            ios: "phone.fill",
            android: "call",
            web: "call",
          }}
          onPress={() => void openPhone(phone)}
        />
      ) : null}
      {whatsapp ? (
        <ActionTile
          label="WhatsApp"
          tint={palette.success}
          icon={{
            ios: "message.fill",
            android: "chat",
            web: "chat",
          }}
          onPress={() => void openWhatsApp(whatsapp)}
        />
      ) : null}
      {hasDirections ? (
        <ActionTile
          label="Directions"
          tint={palette.primary}
          icon={{
            ios: "location.fill",
            android: "directions",
            web: "directions",
          }}
          onPress={() => void openDirections(lat, lng, label)}
        />
      ) : null}
      {onShare ? (
        <ActionTile
          label="Share"
          tint={palette.cream}
          icon={{
            ios: "square.and.arrow.up",
            android: "share",
            web: "share",
          }}
          onPress={onShare}
        />
      ) : null}
    </View>
  );
}
