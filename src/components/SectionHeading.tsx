import { cn } from '../utils/cn';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2 className="font-mono text-xs font-medium tracking-widest text-accent">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-white/50 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
