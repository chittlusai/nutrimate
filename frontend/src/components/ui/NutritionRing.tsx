"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NutritionRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  unit: string;
  icon?: React.ReactNode;
  className?: string;
}

export function NutritionRing({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  color,
  label,
  unit,
  icon,
  className,
}: NutritionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const defaultColors = {
    calories: "hsl(25, 100%, 60%)",
    protein: "hsl(190, 100%, 55%)",
    carbs: "hsl(260, 100%, 65%)",
    fats: "hsl(320, 100%, 65%)",
    fiber: "hsl(145, 70%, 55%)",
  };

  const ringColor = color || defaultColors[label.toLowerCase() as keyof typeof defaultColors] || "hsl(260, 100%, 65%)";
  const isOverLimit = percentage > 100;

  return (
    <motion.div
      className={cn("relative flex flex-col items-center", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isOverLimit ? "hsl(var(--destructive))" : ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 6px ${isOverLimit ? "hsl(var(--destructive))" : ringColor})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && (
            <div
              className="mb-1"
              style={{ color: isOverLimit ? "hsl(var(--destructive))" : ringColor }}
            >
              {icon}
            </div>
          )}
          <span className="text-2xl font-bold text-foreground">
            {Math.round(value)}
          </span>
          <span className="text-xs text-foreground-muted">{unit}</span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-foreground-muted">
          of {Math.round(max)}{unit}
        </p>
      </div>

      {/* Percentage badge */}
      <motion.div
        className={cn(
          "absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-semibold",
          isOverLimit
            ? "bg-destructive/20 text-destructive"
            : percentage >= 80
            ? "bg-warning/20 text-warning"
            : "bg-primary/20 text-primary"
        )}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Math.round(percentage)}%
      </motion.div>
    </motion.div>
  );
}
