import { useAuth, useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Alert, Pressable, View } from "react-native";

import {
  Button,
  KeyboardAwareScrollView,
  Screen,
  Text,
  TextField,
} from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { palette } from "@/constants/Colors";
import { getClerkErrorMessage } from "@/features/auth/auth.utils";
import { toClerkProfileImageDataUrl } from "@/features/auth/clerkProfileImage.utils";
import {
  joinFullName,
  splitFullName,
} from "@/features/auth/fullName.utils";
import { useInvalidateMe } from "@/features/auth/useMe.hook";
import { isApiConfigured } from "@/lib/api.client";
import { fetchMe } from "@/lib/services/auth.service";

export default function EditProfileScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const invalidateMe = useInvalidateMe();
  const router = useRouter();
  const [fullName, setFullName] = useState(
    joinFullName(user?.firstName, user?.lastName),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [pendingImageDataUrl, setPendingImageDataUrl] = useState<string | null>(
    null,
  );

  const displayName = fullName.trim() || "Neighbour";
  const avatarUri =
    localImageUri ?? (user?.hasImage ? user.imageUrl : undefined);
  const username = user?.username ? `@${user.username}` : null;
  const email = user?.primaryEmailAddress?.emailAddress;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Needed",
        "Allow photo access to change your photo.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const dataUrl = toClerkProfileImageDataUrl(asset);
    if (!dataUrl) {
      Alert.alert(
        "Could Not Read Photo",
        "Please try another image from your library.",
      );
      return;
    }

    setLocalImageUri(asset.uri);
    setPendingImageDataUrl(dataUrl);
  };

  const save = async () => {
    if (!user) return;
    const trimmed = fullName.trim();
    if (!trimmed) {
      Alert.alert("Missing Name", "Please enter your full name.");
      return;
    }

    setIsSaving(true);
    try {
      const { firstName, lastName } = splitFullName(trimmed);
      await user.update({
        firstName,
        lastName: lastName || "",
      });

      if (pendingImageDataUrl) {
        await user.setProfileImage({ file: pendingImageDataUrl });
        setPendingImageDataUrl(null);
        setLocalImageUri(null);
      }

      await user.reload();

      if (isApiConfigured()) {
        try {
          await fetchMe(getToken);
          invalidateMe();
        } catch {
          // Clerk profile is saved; session sync retries on next app open.
        }
      }

      Alert.alert("Saved", "Your profile was updated.");
      router.back();
    } catch (error) {
      Alert.alert("Could Not Save", getClerkErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen withSafeArea={false}>
      <KeyboardAwareScrollView contentContainerClassName="px-4 pb-10 pt-2">
        <View className="mb-7 items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change Photo"
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
            accessibilityLabel="Change Photo"
            onPress={() => void pickImage()}
            className="mt-3 active:opacity-70"
          >
            <Text variant="caption" weight="semibold" tone="primary">
              Change Photo
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
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
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
          Save Changes
        </Button>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
