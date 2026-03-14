"use client";

import type { ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
}

/** Wrapper that always shows content (Intersection Observer animation disabled to avoid invisibility bugs). */
export function FadeInSection({ children, className = "" }: FadeInSectionProps) {
  return (
    <div className={`opacity-100 translate-y-0 ${className}`}>
      {children}
    </div>
  );
}
