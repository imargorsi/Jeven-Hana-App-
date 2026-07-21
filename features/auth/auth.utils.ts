import { Alert } from "react-native";

export function notifyClerkMissing() {
  Alert.alert(
    "Clerk not configured",
    "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY (or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from Clerk CLI) to your .env or .env.local file. Do not put CLERK_SECRET_KEY in the mobile app.",
  );
}

export function getClerkFieldError(
  errors: { fields?: object } | undefined,
  field: string,
): string | undefined {
  const fields = errors?.fields as
    | Record<string, { message?: string } | undefined>
    | undefined;

  return fields?.[field]?.message;
}

export function getClerkErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    Array.isArray((error as { errors: { message?: string }[] }).errors)
  ) {
    return (
      (error as { errors: { message?: string }[] }).errors[0]?.message ??
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
