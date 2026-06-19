import { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Variant = "up" | "down" | "left" | "right" | "zoom" | "blur" | "rotate" | "flip";

/**
 * Animates its children into view when scrolled to. The `variant` controls the
 * motion so different sections can feel distinct, and `delay` lets callers
 * stagger a list of items.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const { ref, inView } = useInView();
  return (
    <Tag
      ref={ref as any}
      data-shown={inView ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("sr", `sr-${variant}`, className)}
    >
      {children}
    </Tag>
  );
}
