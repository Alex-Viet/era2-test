import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: ReactNode;
}

export function Chip({
  selected = false,
  className,
  children,
  type = 'button',
  ...props
}: ChipProps) {
  return (
    <div className={cn('inline-flex shrink-0')}>
      <button
        type={type}
        className={cn(
          'h-[34px] rounded-full px-3.5 text-[13px] font-medium transition-colors',
          selected
            ? 'bg-era-accent text-white'
            : 'border border-era-line bg-era-secondary text-era-fg-dim hover:text-era-fg',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
