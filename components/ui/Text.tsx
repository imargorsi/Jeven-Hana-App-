import { Platform, Text as RNText, type TextProps as RNTextProps } from "react-native";

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

/** Font sizes bumped slightly for readability on phone screens. */
const variantFontSize: Record<TTextVariant, number> = {
  display: 40,
  h1: 32,
  h2: 26,
  h3: 22,
  body: 17,
  bodySmall: 15,
  caption: 13,
  label: 15,
  button: 17,
};

/**
 * Generous line heights so Noto Sans descenders (g, p, y) never clip.
 * Buttons need extra room — they sit in fixed-height Pressables.
 */
const variantLineHeightRatio: Record<TTextVariant, number> = {
  display: 1.35,
  h1: 1.35,
  h2: 1.4,
  h3: 1.4,
  body: 1.55,
  bodySmall: 1.55,
  caption: 1.5,
  label: 1.45,
  button: 1.55,
};

const variantClassName: Record<TTextVariant, string> = {
  display: "text-cream",
  h1: "text-cream",
  h2: "text-cream",
  h3: "text-cream",
  body: "text-cream",
  bodySmall: "text-cream",
  caption: "text-cream",
  label: "tracking-wide",
  button: "text-cream",
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
  const fontSize = variantFontSize[variant];
  const ratio = isUrdu
    ? Math.max(variantLineHeightRatio[variant], 1.55)
    : variantLineHeightRatio[variant];
  const lineHeight = Math.ceil(fontSize * ratio);

  return (
    <RNText
      className={cn(
        variantClassName[variant],
        toneClassName[tone],
        isUrdu && "text-right",
        className,
      )}
      style={[
        {
          fontFamily: resolveFontFamily(isUrdu, resolvedWeight),
          fontSize,
          lineHeight,
          writingDirection: isUrdu ? "rtl" : "ltr",
          ...(Platform.OS === "android"
            ? { includeFontPadding: true, textAlignVertical: "center" as const }
            : null),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
