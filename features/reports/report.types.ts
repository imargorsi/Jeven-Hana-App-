/** Reportable UGC target types (API + mobile). */
export type TReportTargetType = "post" | "business" | "event";

export type TReportReason =
  | "spam"
  | "harassment"
  | "misinformation"
  | "inappropriate"
  | "illegal"
  | "other";

export interface IReportReasonOption {
  value: TReportReason;
  label: string;
}

/** English labels — Title Case for action sheet buttons. */
export const REPORT_REASON_OPTIONS: IReportReasonOption[] = [
  { value: "spam", label: "Spam Or Scam" },
  { value: "harassment", label: "Harassment Or Hate" },
  { value: "misinformation", label: "False Or Misleading" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "illegal", label: "Illegal Or Unsafe" },
  { value: "other", label: "Other" },
];
