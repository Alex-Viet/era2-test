import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'quiet'
  | 'destructive'
  | 'link';

type ButtonSize = 'sm' | 'default' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-era-accent text-white hover:bg-era-accent-2',
  secondary: 'bg-era-bg-3 text-era-fg hover:bg-era-line',
  outline:
    'border border-era-line bg-transparent text-era-fg hover:border-era-fg-mute',
  ghost: 'bg-transparent text-era-fg-dim hover:bg-era-bg-2 hover:text-era-fg',
  quiet: 'bg-era-bg-2 text-era-fg-dim hover:text-era-fg',
  destructive: 'bg-status-failed/20 text-status-failed hover:bg-status-failed/30',
  link: 'bg-transparent text-era-accent hover:text-era-accent-2 underline-offset-4 hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  default: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export function Button({
  variant = 'default',
  size = 'default',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <div className={cn('inline-flex')}>
      <button
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium',
          'transition-colors disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
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
