import React from "react";
import MetadataLine from "./MetadataLine";

interface EvidenceBlockProps {
  category?: string;
  title: string;
  metadata?: (string | { label: string; value: React.ReactNode })[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function EvidenceBlock({
  category = "EVIDENCE RECORD",
  title,
  metadata,
  children,
  footer,
  className = "",
}: EvidenceBlockProps) {
  return (
    <div
      className={`border border-[#D9DAD6] bg-[#FFFFFF] p-6 sm:p-8 transition-colors ${className}`}
    >
      {/* Evidence Header */}
      <div className="border-b border-[#D9DAD6] pb-4 mb-5">
        <span className="font-mono text-[10px] sm:text-xs text-[#5F625F] uppercase tracking-widest block mb-1">
          {category}
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
          {title}
        </h3>
        {metadata && metadata.length > 0 && (
          <div className="mt-3">
            <MetadataLine items={metadata} />
          </div>
        )}
      </div>

      {/* Evidence Body */}
      <div className="text-sm sm:text-base text-[#111111] leading-relaxed space-y-4">
        {children}
      </div>

      {/* Optional Footer */}
      {footer && (
        <div className="mt-6 pt-4 border-t border-[#D9DAD6] flex items-center justify-between text-xs font-mono text-[#5F625F]">
          {footer}
        </div>
      )}
    </div>
  );
}
