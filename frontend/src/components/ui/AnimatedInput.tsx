"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {label && (
          <motion.label
            className={cn(
              "absolute left-4 z-10 pointer-events-none transition-all duration-200",
              "text-sm font-medium",
              isFocused || hasValue
                ? "-top-2 text-xs text-primary bg-card px-1"
                : "top-1/2 -translate-y-1/2 text-foreground-muted"
            )}
            initial={false}
            animate={{
              y: isFocused || hasValue ? 0 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full bg-secondary/50 backdrop-blur-sm border-2 rounded-xl",
              "text-foreground placeholder:text-foreground-muted/50",
              "transition-all duration-200 focus-ring",
              icon ? "pl-12 pr-4" : "px-4",
              isPassword ? "pr-12" : "",
              isFocused
                ? "border-primary/50 shadow-glow-sm bg-secondary"
                : "border-white/10 hover:border-white/20",
              error && "border-destructive/50 focus:border-destructive",
              "h-14",
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(e.target.value.length > 0);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 mt-2 text-sm text-destructive"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";
