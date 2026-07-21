import { Link, type Href } from "expo-router";

import { Text } from "@/components/ui/Text";

interface IAuthFooterLinkProps {
  prompt: string;
  linkLabel: string;
  href: Href;
}

export function AuthFooterLink({
  prompt,
  linkLabel,
  href,
}: IAuthFooterLinkProps) {
  return (
    <Text variant="body" className="text-center">
      <Text variant="body" tone="muted">
        {prompt}{" "}
      </Text>
      <Link href={href}>
        <Text variant="body" tone="primary" weight="semibold">
          {linkLabel}
        </Text>
      </Link>
    </Text>
  );
}
