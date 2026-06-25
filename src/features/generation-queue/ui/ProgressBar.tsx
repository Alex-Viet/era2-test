import { cn } from '@/shared/lib';
import { formatProgress } from '../lib/formatEta';

type ProgressBarSize = 'sm' | 'default';

export interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: ProgressBarSize;
  className?: string;
}

const trackSizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  default: 'h-2',
};

export function ProgressBar({
  value,
  showLabel = true,
  size = 'default',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn('flex min-w-0 items-center gap-2', className)}>
      <div
        className={cn(
          'min-w-0 flex-1 overflow-hidden rounded-full bg-era-bg-3',
          trackSizeClasses[size],
        )}
      >
        <div
          className={cn(
            'min-w-0 flex-1 overflow-hidden rounded-full bg-era-bg-3',
            trackSizeClasses[size],
          )}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn(
              'h-full rounded-full bg-era-accent transition-[width] duration-300 ease-out',
            )}
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
      {showLabel && (
        <span className={cn('shrink-0 font-mono text-xs text-era-fg-dim')}>
          {formatProgress(clamped)}
        </span>
      )}
    </div>
  );
}
