import { cn } from '@/shared/lib';
import {
  QUEUE_STATUS_FILTERS,
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
          {initStatus === 'ready' && 'Движок активен · данные в localStorage'}
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
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setStatusFilter(chip.value)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm transition-colors',
                    statusFilter === chip.value
                      ? 'bg-era-accent text-white'
                      : 'bg-era-bg-2 text-era-fg-dim hover:text-era-fg',
                  )}
                >
                  {chip.label}
                </button>
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

          <ul className={cn('space-y-2 font-mono text-sm text-era-fg-dim')}>
            {visibleTasks.length === 0 ? (
              <li className={cn('text-era-fg-mute')}>Нет задач по фильтру</li>
            ) : (
              visibleTasks.map((task) => (
                <li
                  key={task.id}
                  className={cn('rounded-lg border border-era-line px-3 py-2')}
                >
                  {task.id} · {task.status} · {task.progress}% ·{' '}
                  {task.prompt.slice(0, 48)}
                  {task.prompt.length > 48 ? '…' : ''}
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
