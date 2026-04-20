"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function GradientButton({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  ...props
}: GradientButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus-ring";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    primary: cn(
      "bg-gradient-to-r from-primary to-accent-cyan text-white",
      "shadow-glow-sm hover:shadow-glow",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent-cyan before:to-primary before:opacity-0 before:transition-opacity before:duration-300",
      "hover:before:opacity-100",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:before:opacity-0"
    ),
    secondary: cn(
      "bg-secondary text-foreground",
      "hover:bg-secondary/80 hover:shadow-glass",
      "border border-white/10"
    ),
    outline: cn(
      "bg-transparent border-2 border-primary/50 text-primary",
      "hover:bg-primary/10 hover:border-primary",
      "backdrop-blur-sm"
    ),
    ghost: cn(
      "bg-transparent text-foreground-muted",
      "hover:bg-white/5 hover:text-foreground"
    ),
  };

  return (
    <motion.button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variants[variant],
        "overflow-hidden",
        className
      )}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === "left" && icon}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </span>
    </motion.button>
  );
}
