"use client";

import React from "react";
import Link from "next/link";
import StatusLabel, { StatusVariant } from "./StatusLabel";
import InlineAction from "./InlineAction";

interface TechnicalRowProps {
  index?: string | number;
  title: string;
  subtitle?: string;
  tags?: string[];
  status?: {
    label: string;
    variant: StatusVariant;
  };
  actionLabel?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function TechnicalRow({
  index,
  title,
  subtitle,
  tags = [],
  status,
  actionLabel,
  href,
  onClick,
  className = "",
}: TechnicalRowProps) {
  const content = (
    <div
      className={`group py-4 sm:py-5 border-b border-[#D9DAD6] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#F2F2EF] px-2 -mx-2 ${className}`}
    >
      {/* Left: Index + Info */}
      <div className="flex items-start gap-4 sm:gap-6 min-w-0 flex-1">
        {index !== undefined && (
          <span className="font-mono text-xs text-[#5F625F] pt-0.5 tracking-wider shrink-0 w-8 sm:w-10">
            {typeof index === "number" ? String(index).padStart(3, "0") : index}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-[#111111] tracking-tight group-hover:text-black">
            {title}
          </h3>

          {subtitle && (
            <p className="text-xs sm:text-sm text-[#5F625F] mt-0.5 line-clamp-1">
              {subtitle}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px] text-[#5F625F] uppercase tracking-wider">
              {tags.map((tag, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-[#D9DAD6]">/</span>}
                  <span>{tag}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Status + Action */}
      <div className="flex items-center gap-6 shrink-0 self-end md:self-center">
        {status && (
          <StatusLabel label={status.label} variant={status.variant} />
        )}

        {actionLabel && (
          <InlineAction
            label={actionLabel}
            href={href}
            onClick={onClick}
            variant="text"
            size="sm"
          />
        )}
      </div>
    </div>
  );

  if (href && !actionLabel) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
