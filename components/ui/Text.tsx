import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { fonts, type TFontWeight } from "@/constants/Fonts";
import { cn } from "@/lib/cn.utils";

export type TTextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodySmall"
  | "caption"
  | "label"
  | "button";

export type TTextTone =
  | "cream"
  | "primary"
  | "muted"
  | "success"
  | "background"
  | "error";

export interface ITextProps extends RNTextProps {
  variant?: TTextVariant;
  tone?: TTextTone;
  /** Use Noto Naskh Arabic for Urdu / RTL script snippets. */
  isUrdu?: boolean;
  weight?: TFontWeight;
  className?: string;
  children: React.ReactNode;
}

const variantClassName: Record<TTextVariant, string> = {
  display: "text-4xl leading-tight",
  h1: "text-3xl leading-tight",
  h2: "text-2xl leading-snug",
  h3: "text-xl leading-snug",
  body: "text-base leading-relaxed",
  bodySmall: "text-sm leading-relaxed",
  caption: "text-xs leading-normal",
  label: "text-sm leading-none tracking-wide",
  button: "text-base leading-none",
};

const defaultWeight: Record<TTextVariant, TFontWeight> = {
  display: "bold",
  h1: "bold",
  h2: "semibold",
  h3: "semibold",
  body: "regular",
  bodySmall: "regular",
  caption: "regular",
  label: "medium",
  button: "semibold",
};

const toneClassName: Record<TTextTone, string> = {
  cream: "text-cream",
  primary: "text-primary",
  muted: "text-cream/60",
  success: "text-success",
  background: "text-background",
  error: "text-error",
};

function resolveFontFamily(isUrdu: boolean, weight: TFontWeight): string {
  return isUrdu ? fonts.urdu[weight] : fonts.english[weight];
}

export function Text({
  variant = "body",
  tone = "cream",
  isUrdu = false,
  weight,
  className,
  style,
  children,
  ...rest
}: ITextProps) {
  const resolvedWeight = weight ?? defaultWeight[variant];

  return (
    <RNText
      className={cn(
        variantClassName[variant],
        toneClassName[tone],
        isUrdu && "text-right leading-relaxed",
        className,
      )}
      style={[
        {
          fontFamily: resolveFontFamily(isUrdu, resolvedWeight),
          writingDirection: isUrdu ? "rtl" : "ltr",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
