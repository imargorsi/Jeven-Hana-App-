import { Image, View } from "react-native";

export function AuthBrandHeader() {
  return (
    <View className="items-center">
      <Image
        source={require("@/assets/images/app-icon.png")}
        className="h-32 w-32"
        resizeMode="contain"
        accessibilityLabel="Jevan Hana"
      />
    </View>
  );
}
