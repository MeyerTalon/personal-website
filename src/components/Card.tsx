import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300',
        hover && 'hover:border-white/10 hover:bg-white/[0.04]',
        className
      )}
    >
      {children}
    </div>
  );
}
