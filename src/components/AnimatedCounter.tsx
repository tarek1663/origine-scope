"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
  blur?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  delay = 0,
  suffix = "%",
  className = "",
  style,
  blur = false,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const timer = requestAnimationFrame(function run(now) {
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        requestAnimationFrame(run);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(easeOut * value));
      if (t < 1) requestAnimationFrame(run);
    });
    return () => cancelAnimationFrame(timer);
  }, [value, duration, delay]);

  return (
    <span
      className={className}
      style={{
        ...style,
        filter: blur ? "blur(4px)" : undefined,
      }}
    >
      {display}{suffix}
    </span>
  );
}
