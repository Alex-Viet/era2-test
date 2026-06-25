import type { TaskStatus } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { getStatusLabel } from '../lib/statusLabels';

const STATUS_STYLES: Record<TaskStatus, string> = {
  queued: 'bg-era-bg-3 text-status-queued border-era-line',
  running: 'bg-era-accent-soft text-status-running border-era-accent/30',
  done: 'bg-status-done-soft text-status-done border-status-done/30',
  failed: 'bg-status-failed-soft text-status-failed border-status-failed/30',
  canceled: 'bg-era-bg-2 text-status-canceled border-era-line',
};

export interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <div className={cn('inline-flex')}>
      <span
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5',
          'text-xs font-medium',
          STATUS_STYLES[status],
          className,
        )}
      >
        {getStatusLabel(status)}
      </span>
    </div>
  );
}
