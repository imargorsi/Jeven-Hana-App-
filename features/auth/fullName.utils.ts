/**
 * Clerk stores firstName + lastName; the app uses a single Full Name field.
 */
export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }
  const space = trimmed.indexOf(" ");
  if (space === -1) {
    return { firstName: trimmed, lastName: "" };
  }
  return {
    firstName: trimmed.slice(0, space),
    lastName: trimmed.slice(space + 1).trim(),
  };
}

export function joinFullName(
  firstName?: string | null,
  lastName?: string | null,
): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}
