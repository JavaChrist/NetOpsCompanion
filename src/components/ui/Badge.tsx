import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'level' | 'tool' | 'category';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        variant === 'default' && 'bg-surface-600 text-slate-300 border-surface-500',
        className
      )}
    >
      {children}
    </span>
  );
}
