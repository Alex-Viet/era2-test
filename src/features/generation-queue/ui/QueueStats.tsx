import { cn } from '@/shared/lib';
import type { QueueStats as QueueStatsData } from '../model/selectors';

export interface QueueStatsProps {
  stats: QueueStatsData;
}

const STAT_ITEMS = [
  {
    key: 'queued',
    label: 'В очереди',
    accent: 'text-status-queued',
    border: 'border-era-line',
  },
  {
    key: 'running',
    label: 'Идёт',
    accent: 'text-status-running',
    border: 'border-era-accent/30',
  },
  {
    key: 'done',
    label: 'Готово',
    accent: 'text-status-done',
    border: 'border-status-done/30',
  },
  {
    key: 'failed',
    label: 'Ошибка',
    accent: 'text-status-failed',
    border: 'border-status-failed/30',
  },
] as const;

export function QueueStats({ stats }: QueueStatsProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 lg:grid-cols-4',
      )}
    >
      {STAT_ITEMS.map((item) => (
        <div
          key={item.key}
          className={cn(
            'rounded-xl border bg-era-bg-2 px-4 py-3',
            item.border,
          )}
        >
          <div className={cn('text-xs text-era-fg-mute')}>{item.label}</div>
          <div
            className={cn(
              'mt-1 font-mono text-2xl font-semibold tabular-nums',
              item.accent,
            )}
          >
            {stats[item.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
