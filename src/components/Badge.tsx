import { cn } from '../utils/cn';

interface BadgeProps {
  children: string;
  variant?: 'default' | 'primary' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
        variant === 'default' &&
          'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300',
        variant === 'primary' &&
          'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
        variant === 'outline' &&
          'border border-surface-300 text-surface-600 dark:border-surface-600 dark:text-surface-400',
        className
      )}
    >
      {children}
    </span>
  );
}
