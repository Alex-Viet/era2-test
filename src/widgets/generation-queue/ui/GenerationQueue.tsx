import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  QueueStats,
  QueueToolbar,
  TaskCard,
  TaskRow,
  useQueue,
} from '@/features/generation-queue';

function handleDownloadStub(taskId: string) {
  console.info('[ERA2] Download stub:', taskId);
}

export function GenerationQueue() {
  const {
    state,
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
    clearDone,
    reload,
  } = useQueue();

  const taskActions = {
    onCancel: cancelTask,
    onRetry: retryTask,
    onDownload: handleDownloadStub,
    onDelete: deleteTask,
  };

  const isQueueEmpty = state.tasks.length === 0;
  const isFilterEmpty = !isQueueEmpty && visibleTasks.length === 0;
  const hasDoneTasks = stats.done > 0;

  const handleClearDone = () => {
    if (!hasDoneTasks) {
      return;
    }

    const confirmed = window.confirm(
      `Удалить ${stats.done} завершённых задач из очереди?`,
    );

    if (confirmed) {
      clearDone();
    }
  };

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6',
        'px-4 py-6 max-[480px]:pb-8',
        'sm:px-6 sm:py-8',
        'lg:py-10',
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        )}
      >
        <div>
          <h1 className={cn('text-2xl font-semibold tracking-tight')}>
            Очередь генераций
          </h1>
          <p className={cn('mt-2 text-era-fg-dim')}>
            Задачи генерации в реальном времени — статусы, прогресс и управление
          </p>
        </div>

        {initStatus === 'ready' && hasDoneTasks && (
          <div className={cn('shrink-0')}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearDone}
            >
              Очистить готовые
            </Button>
          </div>
        )}
      </div>

      {initStatus === 'loading' && <LoadingState />}

      {initStatus === 'error' && <ErrorState onRetry={reload} />}

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

          {isQueueEmpty && <EmptyState variant="no-tasks" />}

          {isFilterEmpty && <EmptyState variant="no-results" />}

          {!isQueueEmpty && !isFilterEmpty && (
            <ul className={cn('space-y-3')}>
              {visibleTasks.map((task, index) => (
                <li
                  key={task.id}
                  className={cn(
                    'list-none motion-safe:animate-queue-item-in',
                  )}
                  style={
                    index < 8
                      ? { animationDelay: `${Math.min(index * 40, 280)}ms` }
                      : undefined
                  }
                >
                  <TaskRow task={task} {...taskActions} />
                  <TaskCard task={task} {...taskActions} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
