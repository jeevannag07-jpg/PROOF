import React from "react";

interface MetadataItem {
  label?: string;
  value: React.ReactNode;
}

interface MetadataLineProps {
  items: (string | MetadataItem)[];
  separator?: string;
  className?: string;
}

export default function MetadataLine({
  items,
  separator = "//",
  className = "",
}: MetadataLineProps) {
  return (
    <div
      className={`font-mono text-xs uppercase tracking-wider text-[#5F625F] flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}
    >
      {items.map((item, idx) => {
        const isString = typeof item === "string";
        const label = !isString ? item.label : undefined;
        const value = isString ? item : item.value;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-[#D9DAD6] select-none">{separator}</span>}
            <span className="inline-flex items-center gap-1.5">
              {label && <span className="text-[#5F625F] font-normal">{label}:</span>}
              <span className="text-[#111111] font-medium">{value}</span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
