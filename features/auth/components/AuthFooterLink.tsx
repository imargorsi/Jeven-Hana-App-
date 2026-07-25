import { Link, type Href } from "expo-router";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn.utils";

interface IAuthFooterLinkProps {
  prompt: string;
  linkLabel: string;
  href: Href;
  isUrdu?: boolean;
}

export function AuthFooterLink({
  prompt,
  linkLabel,
  href,
  isUrdu = false,
}: IAuthFooterLinkProps) {
  return (
    <Text
      variant="body"
      isUrdu={isUrdu}
      className={cn(isUrdu ? "text-right" : "text-center")}
    >
      <Text variant="body" tone="muted" isUrdu={isUrdu}>
        {prompt}{" "}
      </Text>
      <Link href={href}>
        <Text variant="body" tone="primary" weight="semibold" isUrdu={isUrdu}>
          {linkLabel}
        </Text>
      </Link>
    </Text>
  );
}
