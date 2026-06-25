import { cn } from '@/shared/lib';
import {
  QueueStats,
  QueueToolbar,
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
    typeFilter,
    searchInput,
    setStatusFilter,
    setSortOrder,
    setTypeFilter,
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
          {initStatus === 'ready' && 'Этап 7 · QueueStats / QueueToolbar'}
          {initStatus === 'error' && 'Ошибка загрузки'}
        </p>
      </div>

      {initStatus === 'ready' && (
        <>
          <QueueStats stats={stats} />

          <QueueToolbar
            statusFilter={statusFilter}
            sortOrder={sortOrder}
            searchInput={searchInput}
            typeFilter={typeFilter}
            onStatusFilterChange={setStatusFilter}
            onSortOrderChange={setSortOrder}
            onSearchInputChange={setSearchInput}
            onTypeFilterChange={setTypeFilter}
          />

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
