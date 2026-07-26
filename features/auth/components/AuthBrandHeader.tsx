import { Image, View } from "react-native";

export function AuthBrandHeader() {
  return (
    <View className="items-center">
      <Image
        source={require("@/assets/images/logo.png")}
        style={{ width: 128, height: 128 }}
        resizeMode="contain"
        accessibilityLabel="Jevan Hana"
      />
    </View>
  );
}
