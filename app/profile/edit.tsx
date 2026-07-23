import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Button, Screen, Text, TextField } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { palette } from "@/constants/Colors";
import { IMG } from "@/data/mocks/mock.utils";

export default function EditProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const displayName = `${firstName} ${lastName}`.trim() || "Neighbour";
  const avatarUri =
    localImage ?? (user?.hasImage ? user.imageUrl : IMG.avatar);
  const username = user?.username ? `@${user.username}` : null;
  const email = user?.primaryEmailAddress?.emailAddress;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to change your photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled) {
      setLocalImage(result.assets[0]?.uri ?? null);
    }
  };

  const save = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.update({ firstName, lastName });
      if (localImage) {
        const blob = await fetch(localImage).then((r) => r.blob());
        await user.setProfileImage({ file: blob as unknown as File });
      }
      Alert.alert("Saved", "Your profile was updated.");
      router.back();
    } catch {
      Alert.alert("Could not save", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen withSafeArea={false}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-7 items-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change photo"
              onPress={() => void pickImage()}
              className="relative active:opacity-90"
            >
              <View
                className="rounded-full p-0.5"
                style={{
                  borderWidth: 2.5,
                  borderColor: palette.primary,
                  backgroundColor: palette.surface,
                }}
              >
                <Avatar uri={avatarUri} name={displayName} size="xl" />
              </View>
              <View
                className="absolute bottom-0.5 right-0.5 h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: palette.primary,
                  borderWidth: 2,
                  borderColor: palette.background,
                }}
              >
                <SymbolView
                  name={{
                    ios: "camera.fill",
                    android: "photo_camera",
                    web: "photo_camera",
                  }}
                  size={14}
                  tintColor={palette.background}
                />
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change photo"
              onPress={() => void pickImage()}
              className="mt-3 active:opacity-70"
            >
              <Text variant="caption" weight="semibold" tone="primary">
                Change photo
              </Text>
            </Pressable>

            {username ? (
              <Text
                variant="bodySmall"
                weight="semibold"
                tone="primary"
                className="mt-2.5"
              >
                {username}
              </Text>
            ) : null}
            {email ? (
              <Text
                variant="caption"
                tone="muted"
                className="mt-0.5 text-center"
                numberOfLines={1}
              >
                {email}
              </Text>
            ) : null}
          </View>

          <TextField
            label="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            containerClassName="mb-4"
          />
          <TextField
            label="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => void save()}
            containerClassName="mb-7"
          />

          <Button
            isFullWidth
            size="lg"
            isLoading={isSaving}
            onPress={() => void save()}
          >
            Save changes
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
