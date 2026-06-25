import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

type IconButtonSize = 'sm' | 'default';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
  label: string;
  children: ReactNode;
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'size-8',
  default: 'size-10',
};

export function IconButton({
  size = 'default',
  label,
  className,
  children,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <div className={cn('inline-flex')}>
      <button
        type={type}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          'text-era-fg-dim transition-colors hover:bg-era-bg-3 hover:text-era-fg',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
