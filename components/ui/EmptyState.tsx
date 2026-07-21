import { ActivityIndicator, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { palette } from "@/constants/Colors";
import { cn } from "@/lib/cn.utils";

interface IEmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: IEmptyStateProps) {
  return (
    <View className={cn("items-center justify-center px-8 py-16", className)}>
      <Text variant="h3" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text variant="bodySmall" tone="muted" className="mt-2 text-center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-6" onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

interface IErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  onRetry,
  className,
}: IErrorStateProps) {
  return (
    <View className={cn("items-center justify-center px-8 py-16", className)}>
      <Text variant="h3" className="text-center">
        {title}
      </Text>
      <Text variant="bodySmall" tone="muted" className="mt-2 text-center">
        {description}
      </Text>
      {onRetry ? (
        <Button className="mt-6" variant="secondary" onPress={onRetry}>
          Try again
        </Button>
      ) : null}
    </View>
  );
}

interface ILoadingBlockProps {
  className?: string;
}

export function LoadingBlock({ className }: ILoadingBlockProps) {
  return (
    <View className={cn("items-center justify-center py-16", className)}>
      <ActivityIndicator color={palette.primary} />
    </View>
  );
}
