import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../utils/cn';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in-up' | 'fade-in' | 'slide-in-left' | 'slide-in-right';
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const animationClass = {
    'fade-in-up': 'animate-fade-in-up',
    'fade-in': 'animate-fade-in',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
  }[animation];

  return (
    <div
      ref={ref}
      className={cn(
        isVisible ? animationClass : 'scroll-hidden',
        className
      )}
      style={isVisible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
