import React from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  titleId?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
  titleId,
}) => {
  const isCenterAligned = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isCenterAligned ? "items-center text-center" : "text-start",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface-highlight/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted shadow-inner">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          {eyebrow}
        </span>
      ) : null}

      <h2
        id={titleId}
        className={cn(
          "text-3xl font-bold text-text-strong md:text-4xl",
          "animate-fadeInDown",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-lg text-text-muted",
            "animate-fadeInDown [animation-delay:200ms]",
            isCenterAligned ? "mx-auto" : "",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeader;
