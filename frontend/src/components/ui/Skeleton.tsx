"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "circle" | "image";
  lines?: number;
}

export function Skeleton({ className, variant = "default", lines = 1 }: SkeletonProps) {
  const variants = {
    default: "rounded-lg",
    card: "rounded-xl h-32",
    text: "rounded h-4 w-full",
    circle: "rounded-full aspect-square",
    image: "rounded-xl aspect-video",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-white/10 animate-pulse",
              variants.text,
              i === lines - 1 && "w-3/4"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white/10 animate-pulse shimmer",
        variants[variant],
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card p-6 space-y-4", className)}>
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" className="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
    </div>
  );
}

export function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-6 space-y-3">
          <Skeleton variant="text" className="w-20" />
          <Skeleton variant="text" className="w-16 h-8" />
          <Skeleton variant="text" className="w-full" />
        </div>
      ))}
    </div>
  );
}
