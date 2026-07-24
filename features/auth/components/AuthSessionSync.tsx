import { useMe } from "@/features/auth/useMe.hook";

/**
 * Mount inside ClerkProvider. When signed in, hits GET /api/v1/auth/me
 * so Neon Users stays in sync (role, name, imageUrl).
 */
export function AuthSessionSync() {
  useMe();
  return null;
}
