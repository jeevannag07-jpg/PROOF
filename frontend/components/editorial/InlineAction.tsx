"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InlineActionProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "text" | "solid" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function InlineAction({
  label,
  href,
  onClick,
  variant = "text",
  size = "md",
  className = "",
}: InlineActionProps) {
  const sizeClasses = {
    sm: "text-xs tracking-wider",
    md: "text-xs sm:text-sm tracking-widest",
  };

  const variantClasses = {
    text: "text-[#111111] hover:text-[#5F625F] group inline-flex items-center gap-1.5 font-mono uppercase font-semibold transition-colors",
    solid:
      "bg-[#111111] text-[#FFFFFF] hover:bg-[#333333] px-4 py-2 font-mono uppercase font-semibold inline-flex items-center gap-2 transition-colors",
    outline:
      "border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FFFFFF] px-4 py-2 font-mono uppercase font-semibold inline-flex items-center gap-2 transition-colors",
  };

  const content = (
    <>
      <span>{label}</span>
      <ArrowRight
        className={`w-3.5 h-3.5 transition-transform duration-150 ${
          variant === "text" ? "group-hover:translate-x-1" : ""
        }`}
      />
    </>
  );

  const combinedClasses = `${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
}
