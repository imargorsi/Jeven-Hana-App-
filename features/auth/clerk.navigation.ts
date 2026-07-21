import type { Href } from "expo-router";
import { useRouter } from "expo-router";

type TClerkFinalizeNavigate = (params: {
  session?: { currentTask?: { key: string } | null } | null;
  decorateUrl: (url: string) => string;
}) => void;

type TRouter = ReturnType<typeof useRouter>;

export function createClerkFinalizeNavigate(
  router: TRouter,
  destination: Href = "/(tabs)",
): TClerkFinalizeNavigate {
  return ({ session, decorateUrl }) => {
    if (session?.currentTask) {
      return;
    }

    const url = decorateUrl(destination as string);

    if (url.startsWith("http")) {
      return;
    }

    router.replace(url as Href);
  };
}
