"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  gradient = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-card/60 backdrop-blur-glass",
        "border border-white/10",
        "shadow-glass",
        hover && "transition-all duration-300 hover:shadow-glass-lg hover:border-white/20 hover:-translate-y-0.5",
        glow && "shadow-glow",
        gradient && "gradient-border",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-cyan/10" />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
