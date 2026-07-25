import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";

import { Button, Text } from "@/components/ui";
import { palette } from "@/constants/Colors";
import {
  dateToDatePart,
  dateToTimePart,
  partsToPickerDate,
} from "@/features/events/eventForm.utils";
import { cn } from "@/lib/cn.utils";
import {
  formatHourMinute12h,
  formatShortDate,
} from "@/lib/formatter.utils";

type TPickerMode = "date" | "time";

interface IDateTimePickerFieldProps {
  label?: string;
  mode: TPickerMode;
  /** YYYY-MM-DD when mode=date, HH:mm when mode=time */
  value: string;
  /** Companion part so the picker Date is complete (time for date mode, date for time mode). */
  companionValue?: string;
  placeholder: string;
  onChange: (next: string) => void;
  containerClassName?: string;
  accessibilityLabel?: string;
}

function displayValue(mode: TPickerMode, value: string): string {
  if (!value.trim()) return "";
  if (mode === "time") return formatHourMinute12h(value);
  const date = partsToPickerDate(value, "12:00");
  return formatShortDate(date.toISOString());
}

/**
 * Pressable field matching TextField chrome; opens native date/time picker (12h AM/PM).
 */
export function DateTimePickerField({
  label,
  mode,
  value,
  companionValue = "",
  placeholder,
  onChange,
  containerClassName,
  accessibilityLabel,
}: IDateTimePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(() =>
    partsToPickerDate(
      mode === "date" ? value : companionValue,
      mode === "time" ? value : companionValue || "18:00",
    ),
  );

  const open = () => {
    setDraft(
      partsToPickerDate(
        mode === "date" ? value || companionValue : companionValue,
        mode === "time" ? value || "18:00" : companionValue || "18:00",
      ),
    );
    setIsOpen(true);
  };

  const commit = (next: Date) => {
    setDraft(next);
    onChange(mode === "date" ? dateToDatePart(next) : dateToTimePart(next));
  };

  const onAndroidChange = (event: DateTimePickerEvent, selected?: Date) => {
    setIsOpen(false);
    if (event.type === "set" && selected) {
      commit(selected);
    }
  };

  const shown = displayValue(mode, value);
  const iconName =
    mode === "date"
      ? ({
          ios: "calendar" as const,
          android: "calendar_today" as const,
          web: "calendar_today" as const,
        })
      : ({
          ios: "clock" as const,
          android: "schedule" as const,
          web: "schedule" as const,
        });

  return (
    <View className={cn("min-w-0 gap-2", containerClassName ?? "w-full")}>
      {label ? (
        <Text
          variant="label"
          tone="cream"
          weight="medium"
          className="opacity-70"
        >
          {label}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ?? `${label ?? mode}, ${shown || placeholder}`
        }
        onPress={open}
        className="min-h-14 w-full flex-row items-center rounded-button border border-cream/15 bg-surface px-3 active:opacity-90"
      >
        <View className="mr-2 shrink-0">
          <SymbolView name={iconName} size={18} tintColor={palette.primary} />
        </View>
        <Text
          variant="body"
          tone={shown ? "cream" : "muted"}
          className="min-w-0 flex-1"
          numberOfLines={1}
        >
          {shown || placeholder}
        </Text>
      </Pressable>

      {isOpen && Platform.OS === "android" ? (
        <DateTimePicker
          value={draft}
          mode={mode}
          display="default"
          is24Hour={false}
          onChange={onAndroidChange}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          visible={isOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            className="flex-1 justify-end bg-background/70"
            onPress={() => setIsOpen(false)}
          >
            <Pressable
              className="rounded-t-3xl border border-cream/10 bg-surface px-4 pb-8 pt-3"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="mb-2 flex-row items-center justify-between">
                <Text variant="label" tone="muted">
                  {label ?? (mode === "date" ? "Date" : "Time")}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsOpen(false)}
                  hitSlop={8}
                >
                  <Text variant="label" tone="primary" weight="semibold">
                    Done
                  </Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={draft}
                mode={mode}
                display="spinner"
                is24Hour={false}
                themeVariant="dark"
                onChange={(_event, selected) => {
                  if (selected) commit(selected);
                }}
                style={{ alignSelf: "center" }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}

      {isOpen && Platform.OS === "web" ? (
        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <View className="flex-1 items-center justify-center bg-background/70 px-6">
            <View className="w-full max-w-sm rounded-card border border-cream/10 bg-surface p-4">
              <Text variant="label" tone="muted" className="mb-3">
                {label}
              </Text>
              <DateTimePicker
                value={draft}
                mode={mode}
                display="default"
                is24Hour={false}
                onChange={(_event, selected) => {
                  if (selected) commit(selected);
                }}
              />
              <Button
                variant="primary"
                size="md"
                isFullWidth
                className="mt-4"
                onPress={() => setIsOpen(false)}
              >
                Done
              </Button>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
