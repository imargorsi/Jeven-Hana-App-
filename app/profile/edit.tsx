import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import { Button, Screen, TextField } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";

export default function EditProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

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
      <ScrollView
        contentContainerClassName="px-4 pb-10 pt-2"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6 items-center">
          <Avatar
            uri={localImage ?? user?.imageUrl}
            name={`${firstName} ${lastName}`}
            size="lg"
          />
          <Button size="sm" variant="secondary" className="mt-3" onPress={() => void pickImage()}>
            Change photo
          </Button>
        </View>

        <TextField
          label="First name"
          value={firstName}
          onChangeText={setFirstName}
          containerClassName="mb-4"
        />
        <TextField
          label="Last name"
          value={lastName}
          onChangeText={setLastName}
          containerClassName="mb-6"
        />

        <Button isFullWidth isLoading={isSaving} onPress={() => void save()}>
          Save changes
        </Button>
      </ScrollView>
    </Screen>
  );
}
