import React from "react";

interface EditorialDividerProps {
  className?: string;
  spacing?: "sm" | "md" | "lg" | "none";
}

export default function EditorialDivider({
  className = "",
  spacing = "md",
}: EditorialDividerProps) {
  const spacingClasses = {
    none: "",
    sm: "my-4",
    md: "my-8",
    lg: "my-12",
  };

  return (
    <hr
      className={`border-0 border-t border-[#D9DAD6] w-full ${spacingClasses[spacing]} ${className}`}
    />
  );
}
