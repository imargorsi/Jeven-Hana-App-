import { View } from "react-native";

import {
  Button,
  KeyboardAwareScrollView,
  Screen,
  Text,
  TextField,
} from "@/components/ui";
import { palette } from "@/constants/Colors";
import { APP_CONTACT } from "@/constants/Contact";
import { useDeleteAccount } from "@/features/auth/useDeleteAccount.hook";
import { withAlpha } from "@/lib/color.utils";

export default function DeleteAccountScreen() {
  const {
    confirmText,
    setConfirmText,
    confirmPhrase,
    canSubmit,
    isDeleting,
    requestDelete,
  } = useDeleteAccount();

  return (
    <Screen withAppHeader={false}>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-14 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h3" weight="bold" className="mb-2">
          Delete Account
        </Text>
        <Text variant="bodySmall" tone="muted" className="mb-6 leading-6">
          This permanently removes your Jevan Hana account and the content you
          created (listings, posts, events, and reviews). Saved items on this
          device are cleared too. This cannot be undone.
        </Text>

        <View
          className="mb-5 rounded-card border px-3 py-3"
          style={{
            borderColor: withAlpha(palette.error, 0.35),
            backgroundColor: withAlpha(palette.error, 0.12),
          }}
        >
          <Text variant="label" weight="semibold" tone="error" className="mb-1.5">
            Warning
          </Text>
          <Text variant="caption" tone="muted" className="leading-5">
            After deletion you will be signed out immediately. You can create a
            new account later, but previous content will not come back.
          </Text>
        </View>

        <Text
          isUrdu
          variant="bodySmall"
          tone="muted"
          className="mb-6 text-right leading-6"
        >
          اکاؤنٹ حذف کرنے سے آپ کا ڈیٹا مستقل طور پر ختم ہو جائے گا۔ براہِ کرم
          صرف تب آگے بڑھیں جب آپ واقعی یقینی ہوں۔
        </Text>

        <TextField
          label={`Type ${confirmPhrase} To Confirm`}
          value={confirmText}
          onChangeText={setConfirmText}
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!isDeleting}
          placeholder={confirmPhrase}
          accessibilityLabel={`Type ${confirmPhrase} to confirm`}
        />

        <Button
          isFullWidth
          size="lg"
          className="mt-8 bg-error"
          isDisabled={!canSubmit}
          isLoading={isDeleting}
          onPress={requestDelete}
          accessibilityLabel="Delete Account Forever"
        >
          <Text variant="button" weight="semibold" tone="cream">
            Delete Account Forever
          </Text>
        </Button>

        <Text variant="caption" tone="muted" className="mt-4 text-center">
          Need help instead? Email {APP_CONTACT.email} or WhatsApp{" "}
          {APP_CONTACT.whatsappDisplay}.
        </Text>
      </KeyboardAwareScrollView>
    </Screen>
  );
}
