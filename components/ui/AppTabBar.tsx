import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { withAlpha } from "@/lib/color.utils";

type TSymbolName = NonNullable<ComponentProps<typeof SymbolView>["name"]>;

const TAB_META: Record<
  string,
  {
    label: string;
    icon: TSymbolName;
    iconActive: TSymbolName;
  }
> = {
  index: {
    label: "Home",
    icon: { ios: "house", android: "home", web: "home" },
    iconActive: { ios: "house.fill", android: "home", web: "home" },
  },
  explore: {
    label: "Explore",
    icon: {
      ios: "magnifyingglass",
      android: "search",
      web: "search",
    },
    iconActive: {
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
    iconActive: {
      ios: "person.2.fill",
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
    iconActive: {
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
    iconActive: {
      ios: "person.fill",
      android: "person",
      web: "person",
    },
  },
};

/**
 * Premium bottom tab bar — surface bar, gold active icons with soft circle outline.
 */
export function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const inactive = withAlpha(palette.cream, 0.45);

  return (
    <View
      style={{
        backgroundColor: palette.surface,
        borderTopColor: withAlpha(palette.cream, 0.08),
        borderTopWidth: 1,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 10,
      }}
    >
      <View className="flex-row items-stretch px-2">
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
              accessibilityLabel={
                options.tabBarAccessibilityLabel ?? meta.label
              }
              onPress={onPress}
              className="flex-1 items-center justify-center active:opacity-80"
              style={{ minHeight: 56 }}
            >
              <View className="items-center">
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 40,
                    height: 40,
                    borderWidth: isFocused ? 1.5 : 0,
                    borderColor: isFocused
                      ? withAlpha(palette.primary, 0.55)
                      : "transparent",
                    backgroundColor: isFocused
                      ? withAlpha(palette.primary, 0.08)
                      : "transparent",
                  }}
                >
                  <SymbolView
                    name={isFocused ? meta.iconActive : meta.icon}
                    size={20}
                    tintColor={color}
                  />
                </View>

                <Text
                  variant="caption"
                  weight={isFocused ? "semibold" : "medium"}
                  style={{
                    color,
                    marginTop: 4,
                    fontSize: 11,
                    lineHeight: 14,
                  }}
                >
                  {meta.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
