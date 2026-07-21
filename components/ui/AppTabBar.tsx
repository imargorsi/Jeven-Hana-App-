import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { withAlpha } from "@/lib/color.utils";

type TTabIcon = {
  ios: string;
  android: string;
  web: string;
};

const TAB_META: Record<
  string,
  { label: string; icon: TTabIcon }
> = {
  index: {
    label: "Home",
    icon: { ios: "house", android: "home", web: "home" },
  },
  explore: {
    label: "Explore",
    icon: {
      ios: "magnifyingglass",
      android: "search",
      web: "search",
    },
  },
  community: {
    label: "Community",
    icon: {
      ios: "person.2",
      android: "group",
      web: "group",
    },
  },
  events: {
    label: "Events",
    icon: {
      ios: "calendar",
      android: "event",
      web: "event",
    },
  },
  profile: {
    label: "Profile",
    icon: {
      ios: "person",
      android: "person_outline",
      web: "person",
    },
  },
};

/**
 * Bottom tab bar matching `screens/home.png`:
 * outline icons, gold active state, gold underline under active label.
 */
export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const inactive = withAlpha(palette.cream, 0.55);

  return (
    <View
      style={{
        backgroundColor: palette.background,
        borderTopColor: withAlpha(palette.cream, 0.1),
        borderTopWidth: 1,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}
    >
      <View className="flex-row items-stretch px-1">
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;

          const isFocused = state.index === index;
          const color = isFocused ? palette.primary : inactive;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? meta.label}
              onPress={onPress}
              className="flex-1 items-center justify-center py-1 active:opacity-80"
            >
              <SymbolView
                name={meta.icon as never}
                size={22}
                tintColor={color}
              />
              <Text
                variant="caption"
                weight={isFocused ? "semibold" : "medium"}
                style={{ color, marginTop: 4, fontSize: 11, lineHeight: 16 }}
              >
                {meta.label}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  height: 2,
                  width: 28,
                  borderRadius: 999,
                  backgroundColor: isFocused ? palette.primary : "transparent",
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
