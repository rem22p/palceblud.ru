import { useEffect, useRef } from "react";

interface AnimatedColorProps {
  value: string | number;
  color: string;
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedColor({
  value,
  color,
  duration = 500,
  style,
  className,
  children
}: AnimatedColorProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const startColorRef = useRef<{r: number, g: number, b: number} | null>(null);

  useEffect(() => {
    const element = spanRef.current;
    if (!element) return;

    // Отменяем предыдущую анимацию
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Получаем текущий цвет
    const computedStyle = getComputedStyle(element);
    const currentColor = computedStyle.color;

    // Парсим RGB цвета
    const startRgb = parseColor(currentColor);
    const endRgb = parseColor(color);

    console.log("AnimatedColor:", { currentColor, targetColor: color, startRgb, endRgb });

    if (!startRgb || !endRgb) {
      element.style.color = color;
      return;
    }

    startColorRef.current = startRgb;
    startTimeRef.current = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: cubic-bezier(0.4, 0, 0.2, 1)
      const eased = 1 - Math.pow(1 - progress, 3);

      const r = Math.round(startRgb!.r + (endRgb!.r - startRgb!.r) * eased);
      const g = Math.round(startRgb!.g + (endRgb!.g - startRgb!.g) * eased);
      const b = Math.round(startRgb!.b + (endRgb!.b - startRgb!.b) * eased);

      element!.style.color = `rgb(${r}, ${g}, ${b})`;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [color, duration]);

  return (
    <span
      ref={spanRef}
      style={{ ...style, color }}
      className={className}
    >
      {children ?? value}
    </span>
  );
}

function parseColor(colorStr: string): { r: number; g: number; b: number } | null {
  // Пробуем rgb()
  let match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  
  // Пробуем rgba()
  match = colorStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  
  // Пробуем hex
  match = colorStr.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (match) {
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16)
    };
  }
  
  console.warn("Не удалось распарсить цвет:", colorStr);
  return null;
}
