import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface IHomeTownStripProps {
  className?: string;
}

/** Single-town context strip for the Home hub (MVP: Jevan Hana only). */
export function HomeTownStrip({ className }: IHomeTownStripProps) {
  return (
    <View
      className={cn(
        "mb-4 flex-row items-center gap-1.5 rounded-chip bg-surface px-3 py-2",
        className,
      )}
    >
      <SymbolView
        name={{
          ios: "mappin.and.ellipse",
          android: "location_on",
          web: "location_on",
        }}
        size={14}
        tintColor={palette.primary}
      />
      <Text variant="caption" weight="medium" className="shrink" numberOfLines={1}>
        Jevan Hana · Garden Town, Lahore
      </Text>
    </View>
  );
}
