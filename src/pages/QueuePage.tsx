import { cn } from '@/shared/lib';
import { Chip } from '@/shared/ui';
import {
  QUEUE_STATUS_FILTERS,
  TaskCard,
  TaskRow,
  useQueue,
} from '@/features/generation-queue';

function handleDownloadStub(taskId: string) {
  console.info('[ERA2] Download stub:', taskId);
}

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
    cancelTask,
    retryTask,
    deleteTask,
  } = useQueue();

  const taskActions = {
    onCancel: cancelTask,
    onRetry: retryTask,
    onDownload: handleDownloadStub,
    onDelete: deleteTask,
  };

  return (
    <div className={cn('flex flex-1 flex-col gap-6 px-6 py-10')}>
      <div>
        <h1 className={cn('text-2xl font-semibold tracking-tight')}>
          Очередь генераций
        </h1>
        <p className={cn('mt-2 text-era-fg-dim')}>
          {initStatus === 'loading' && 'Загрузка очереди…'}
          {initStatus === 'ready' && 'Этап 6 · TaskRow / TaskCard / TaskActions'}
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
                <li key={task.id} className={cn('list-none')}>
                  <TaskRow task={task} {...taskActions} />
                  <TaskCard task={task} {...taskActions} />
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
