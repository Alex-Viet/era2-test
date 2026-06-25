import { cn } from '@/shared/lib';
import { Chip } from '@/shared/ui';
import {
  formatCredits,
  formatDurationSeconds,
  formatEtaSeconds,
  formatQueuePosition,
  ProgressBar,
  QUEUE_STATUS_FILTERS,
  StatusBadge,
  useQueue,
} from '@/features/generation-queue';

export function QueuePage() {
  const {
    initStatus,
    stats,
    visibleTasks,
    statusFilter,
    sortOrder,
    searchInput,
    setStatusFilter,
    setSortOrder,
    setSearchInput,
  } = useQueue();

  return (
    <div className={cn('flex flex-1 flex-col gap-6 px-6 py-10')}>
      <div>
        <h1 className={cn('text-2xl font-semibold tracking-tight')}>
          Очередь генераций
        </h1>
        <p className={cn('mt-2 text-era-fg-dim')}>
          {initStatus === 'loading' && 'Загрузка очереди…'}
          {initStatus === 'ready' && 'Этап 5 · UI-примитивы и форматтеры'}
          {initStatus === 'error' && 'Ошибка загрузки'}
        </p>
      </div>

      {initStatus === 'ready' && (
        <>
          <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4')}>
            {(
              [
                ['queued', stats.queued, 'В очереди'],
                ['running', stats.running, 'Идёт'],
                ['done', stats.done, 'Готово'],
                ['failed', stats.failed, 'Ошибка'],
              ] as const
            ).map(([key, count, label]) => (
              <div
                key={key}
                className={cn(
                  'rounded-lg border border-era-line bg-era-bg-2 px-4 py-3',
                )}
              >
                <div className={cn('text-xs text-era-fg-mute')}>{label}</div>
                <div className={cn('mt-1 font-mono text-xl font-medium')}>
                  {count}
                </div>
              </div>
            ))}
          </div>

          <div className={cn('flex flex-col gap-3')}>
            <div className={cn('flex flex-wrap gap-2')}>
              {QUEUE_STATUS_FILTERS.map((chip) => (
                <Chip
                  key={chip.value}
                  selected={statusFilter === chip.value}
                  onClick={() => setStatusFilter(chip.value)}
                >
                  {chip.label}
                </Chip>
              ))}
            </div>

            <div className={cn('flex flex-wrap gap-3')}>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Поиск по промпту…"
                className={cn(
                  'min-w-[220px] flex-1 rounded-lg border border-era-line',
                  'bg-era-bg-1 px-3 py-2 text-sm outline-none focus:border-era-accent',
                )}
              />
              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as 'newest' | 'oldest')
                }
                className={cn(
                  'rounded-lg border border-era-line bg-era-bg-1 px-3 py-2 text-sm',
                )}
              >
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
              </select>
            </div>
          </div>

          <ul className={cn('space-y-3')}>
            {visibleTasks.length === 0 ? (
              <li className={cn('text-sm text-era-fg-mute')}>
                Нет задач по фильтру
              </li>
            ) : (
              visibleTasks.map((task) => (
                <li
                  key={task.id}
                  className={cn(
                    'rounded-xl border border-era-line bg-era-bg-1 p-4',
                  )}
                >
                  <div className={cn('flex flex-wrap items-center gap-2')}>
                    <StatusBadge status={task.status} />
                    <span className={cn('font-mono text-xs text-era-fg-mute')}>
                      {task.model}
                    </span>
                    <span className={cn('text-xs text-era-fg-dim')}>
                      {formatCredits(task.credits)}
                    </span>
                    {formatEtaSeconds(task.etaSeconds) && (
                      <span className={cn('text-xs text-era-fg-dim')}>
                        {formatEtaSeconds(task.etaSeconds)}
                      </span>
                    )}
                    {formatDurationSeconds(task.durationSeconds) && (
                      <span className={cn('text-xs text-era-fg-dim')}>
                        {formatDurationSeconds(task.durationSeconds)}
                      </span>
                    )}
                    {formatQueuePosition(task.queuePosition) && (
                      <span className={cn('text-xs text-era-fg-dim')}>
                        {formatQueuePosition(task.queuePosition)}
                      </span>
                    )}
                  </div>
                  <p className={cn('mt-2 line-clamp-2 text-sm text-era-fg')}>
                    {task.prompt}
                  </p>
                  {task.status === 'running' && (
                    <div className={cn('mt-3')}>
                      <ProgressBar value={task.progress} />
                    </div>
                  )}
                  {task.status === 'failed' && task.error && (
                    <p className={cn('mt-2 text-sm text-status-failed')}>
                      {task.error}
                    </p>
                  )}
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
