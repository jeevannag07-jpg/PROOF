import React from "react";
import EditorialDivider from "./EditorialDivider";

interface EditorialSectionProps {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function EditorialSection({
  number,
  title,
  description,
  children,
  action,
  className = "",
}: EditorialSectionProps) {
  return (
    <section className={`py-10 md:py-16 ${className}`}>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#5F625F] block mb-2">
              {number}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] uppercase">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm md:text-base text-[#5F625F] max-w-2xl font-normal leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="self-start md:self-end">{action}</div>}
        </div>
      </div>

      {/* Editorial Divider */}
      <EditorialDivider spacing="none" className="mb-8" />

      {/* Section Content */}
      <div>{children}</div>
    </section>
  );
}
