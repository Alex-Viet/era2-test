import { cn } from '@/shared/lib';
import type { QueueStats as QueueStatsData } from '../model/selectors';
import { STAT_DOT_COLORS } from '../lib/taskSurfaceStyles';

export interface QueueStatsProps {
  stats: QueueStatsData;
}

const STAT_ITEMS = [
  { key: 'queued' as const, label: 'В очереди' },
  { key: 'running' as const, label: 'Идёт' },
  { key: 'done' as const, label: 'Готово' },
  { key: 'failed' as const, label: 'Ошибка' },
];

export function QueueStats({ stats }: QueueStatsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 min-[481px]:grid-cols-4')}>
      {STAT_ITEMS.map((item) => (
        <div
          key={item.key}
          className={cn(
            'flex flex-col gap-2 rounded-2xl border border-era-line bg-era-card',
            'px-[18px] py-4',
          )}
        >
          <div className={cn('flex items-center gap-2')}>
            <span
              className={cn('size-2 shrink-0 rounded-full', STAT_DOT_COLORS[item.key])}
              aria-hidden
            />
            <div className={cn('text-[13px] text-era-fg-mute')}>{item.label}</div>
          </div>
          <div
            className={cn(
              'font-mono text-[28px] font-bold tabular-nums leading-none text-era-fg',
            )}
          >
            {stats[item.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
