import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Magic UI-level animated counter with spring physics.
 * Numbers glide smoothly to target value.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  className,
  style,
}: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 20, mass: 0.3 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className={className} style={style}>
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
}
