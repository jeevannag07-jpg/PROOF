import React from "react";

export type StatusVariant =
  | "verified"
  | "in-progress"
  | "submitted"
  | "under-review"
  | "capability"
  | "xp"
  | "error"
  | "neutral";

interface StatusLabelProps {
  label: string;
  variant?: StatusVariant;
  showDot?: boolean;
  className?: string;
}

export default function StatusLabel({
  label,
  variant = "neutral",
  showDot = true,
  className = "",
}: StatusLabelProps) {
  const variantStyles: Record<StatusVariant, { text: string; dot: string; border: string; bg: string }> = {
    verified: {
      text: "text-[#087F5B]",
      dot: "bg-[#087F5B]",
      border: "border-[#087F5B]/30",
      bg: "bg-[#087F5B]/5",
    },
    "in-progress": {
      text: "text-[#087EA4]",
      dot: "bg-[#087EA4]",
      border: "border-[#087EA4]/30",
      bg: "bg-[#087EA4]/5",
    },
    capability: {
      text: "text-[#087EA4]",
      dot: "bg-[#087EA4]",
      border: "border-[#087EA4]/30",
      bg: "bg-[#087EA4]/5",
    },
    "under-review": {
      text: "text-[#A16207]",
      dot: "bg-[#A16207]",
      border: "border-[#A16207]/30",
      bg: "bg-[#A16207]/5",
    },
    submitted: {
      text: "text-[#A16207]",
      dot: "bg-[#A16207]",
      border: "border-[#A16207]/30",
      bg: "bg-[#A16207]/5",
    },
    xp: {
      text: "text-[#A16207]",
      dot: "bg-[#A16207]",
      border: "border-[#A16207]/30",
      bg: "bg-[#A16207]/5",
    },
    error: {
      text: "text-[#B42318]",
      dot: "bg-[#B42318]",
      border: "border-[#B42318]/30",
      bg: "bg-[#B42318]/5",
    },
    neutral: {
      text: "text-[#5F625F]",
      dot: "bg-[#5F625F]",
      border: "border-[#D9DAD6]",
      bg: "bg-[#F7F7F5]",
    },
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wider ${style.text} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
      <span>{label}</span>
    </span>
  );
}
