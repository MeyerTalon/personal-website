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
        'rounded-xl border border-surface-200 bg-white p-6',
        'dark:border-surface-700 dark:bg-surface-800',
        'transition-all duration-300',
        hover && 'hover:shadow-lg hover:border-surface-300 dark:hover:border-surface-600 hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}
