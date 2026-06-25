import type { TaskStatus } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { getStatusLabel } from '../lib/statusLabels';
import { STATUS_BADGE_STYLES } from '../lib/taskSurfaceStyles';

export interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = STATUS_BADGE_STYLES[status];

  return (
    <div className={cn('inline-flex')}>
      <span
        className={cn(
          'inline-flex items-center rounded-lg px-2.5 py-1.5',
          'text-xs font-medium',
          styles.container,
          styles.label,
          className,
        )}
      >
        {getStatusLabel(status)}
      </span>
    </div>
  );
}
