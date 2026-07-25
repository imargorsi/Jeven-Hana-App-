import { SymbolView } from "expo-symbols";
import { Pressable, View } from "react-native";

import { Button, KeyboardAwareScrollView, Text, TextField } from "@/components/ui";
import { palette } from "@/constants/Colors";
import { DateTimePickerField } from "@/features/events/components/DateTimePickerField";
import {
  dateToDatePart,
  dateToTimePart,
  type IEventFormValues,
  partsToPickerDate,
} from "@/features/events/eventForm.utils";

interface IEventFormProps {
  values: IEventFormValues;
  onChange: (patch: Partial<IEventFormValues>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function EventForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel,
}: IEventFormProps) {
  const hasEnd = Boolean(values.endsDate.trim() || values.endsTime.trim());

  const addEnd = () => {
    const start = partsToPickerDate(values.startsDate, values.startsTime);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    onChange({
      endsDate: dateToDatePart(end),
      endsTime: dateToTimePart(end),
    });
  };

  const clearEnd = () => {
    onChange({ endsDate: "", endsTime: "" });
  };

  return (
    <KeyboardAwareScrollView contentContainerClassName="gap-4 px-4 pb-10 pt-2">
      <Text variant="caption" tone="muted">
        Title and location can be English, Urdu, or both. Events go live
        immediately.
      </Text>

      <TextField
        label="Title"
        value={values.title}
        onChangeText={(title) => onChange({ title })}
        placeholder="e.g. Monthly Mehfil Milaad"
        autoCapitalize="sentences"
        returnKeyType="next"
      />

      <TextField
        label="Location"
        value={values.location}
        onChangeText={(location) => onChange({ location })}
        placeholder="e.g. Jamia Masjid, Jevan Hana"
        autoCapitalize="sentences"
        returnKeyType="next"
      />

      <View className="gap-2">
        <Text
          variant="label"
          tone="cream"
          weight="medium"
          className="opacity-70"
        >
          Starts
        </Text>
        <View className="flex-row gap-3">
          <DateTimePickerField
            mode="date"
            value={values.startsDate}
            companionValue={values.startsTime}
            placeholder="Pick a Date"
            accessibilityLabel="Start Date"
            onChange={(startsDate) => onChange({ startsDate })}
            containerClassName="flex-1"
          />
          <DateTimePickerField
            mode="time"
            value={values.startsTime}
            companionValue={values.startsDate}
            placeholder="Time"
            accessibilityLabel="Start Time"
            onChange={(startsTime) => onChange({ startsTime })}
            containerClassName="w-[42%]"
          />
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text
            variant="label"
            tone="cream"
            weight="medium"
            className="opacity-70"
          >
            Ends (Optional)
          </Text>
          {hasEnd ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear End Time"
              onPress={clearEnd}
              hitSlop={8}
            >
              <Text variant="caption" tone="primary" weight="semibold">
                Clear
              </Text>
            </Pressable>
          ) : null}
        </View>

        {hasEnd ? (
          <View className="flex-row gap-3">
            <DateTimePickerField
              mode="date"
              value={values.endsDate}
              companionValue={values.endsTime || values.startsTime}
              placeholder="Pick a Date"
              accessibilityLabel="End Date"
              onChange={(endsDate) => onChange({ endsDate })}
              containerClassName="flex-1"
            />
            <DateTimePickerField
              mode="time"
              value={values.endsTime}
              companionValue={values.endsDate || values.startsDate}
              placeholder="Time"
              accessibilityLabel="End Time"
              onChange={(endsTime) => onChange({ endsTime })}
              containerClassName="w-[42%]"
            />
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add End Date and Time"
            onPress={addEnd}
            className="min-h-14 flex-row items-center justify-center gap-2 rounded-button border border-dashed border-cream/20 bg-surface/60 px-4 active:opacity-90"
          >
            <SymbolView
              name={{
                ios: "plus.circle",
                android: "add_circle_outline",
                web: "add_circle_outline",
              }}
              size={18}
              tintColor={palette.primary}
            />
            <Text variant="bodySmall" weight="semibold" tone="primary">
              Add End Date & Time
            </Text>
          </Pressable>
        )}
      </View>

      <TextField
        label="Description (Optional)"
        value={values.description}
        onChangeText={(description) => onChange({ description })}
        placeholder="Short note for neighbours"
        autoCapitalize="sentences"
        multiline
        className="min-h-24"
        textAlignVertical="top"
      />

      <Button
        variant="primary"
        size="lg"
        isFullWidth
        isLoading={isSubmitting}
        onPress={onSubmit}
        className="mt-2"
      >
        {submitLabel}
      </Button>
    </KeyboardAwareScrollView>
  );
}
