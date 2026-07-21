import { View } from "react-native";

import { Button } from "@/components/ui/Button";
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
  className?: string;
}

export function ContactActions({
  phone,
  whatsapp,
  lat,
  lng,
  label,
  className,
}: IContactActionsProps) {
  return (
    <View className={cn("flex-row flex-wrap gap-2", className)}>
      {phone ? (
        <Button
          size="sm"
          variant="secondary"
          className="flex-1"
          onPress={() => void openPhone(phone)}
        >
          Call
        </Button>
      ) : null}
      {whatsapp ? (
        <Button
          size="sm"
          variant="success"
          className="flex-1"
          onPress={() => void openWhatsApp(whatsapp)}
        >
          WhatsApp
        </Button>
      ) : null}
      {typeof lat === "number" && typeof lng === "number" ? (
        <Button
          size="sm"
          className="flex-1"
          onPress={() => void openDirections(lat, lng, label)}
        >
          Directions
        </Button>
      ) : null}
    </View>
  );
}
