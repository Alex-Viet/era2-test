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
    <div className={cn('flex flex-1 flex-col px-4 min-[481px]:px-8 lg:px-10')}>
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-6',
          'py-6 max-[480px]:pb-8 lg:py-10',
        )}
      >
      <div
        className={cn(
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        )}
      >
        <div>
          <h1
            className={cn(
              'text-[30px] font-bold tracking-[-0.6px] text-era-fg',
            )}
          >
            Очередь генераций
          </h1>
          <p className={cn('mt-1 text-[15px] text-era-fg-mute')}>
            Все ваши задачи в реальном времени
          </p>
        </div>

        {initStatus === 'ready' && hasDoneTasks && (
          <div className={cn('shrink-0')}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn('rounded-full px-4 text-era-fg-dim')}
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
            <ul className={cn('space-y-2.5')}>
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
    </div>
  );
}
