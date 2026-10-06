import React from "react";

interface EditorialContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function EditorialContainer({
  children,
  className = "",
  as: Component = "div",
}: EditorialContainerProps) {
  return (
    <Component
      className={`w-full max-w-[1320px] mx-auto px-6 sm:px-8 md:px-12 ${className}`}
    >
      {children}
    </Component>
  );
}
