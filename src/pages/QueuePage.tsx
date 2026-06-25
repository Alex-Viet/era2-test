import { cn } from "@/shared/lib";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  QueueStats,
  QueueToolbar,
  TaskCard,
  TaskRow,
  useQueue,
} from "@/features/generation-queue";

function handleDownloadStub(taskId: string) {
  console.info("[ERA2] Download stub:", taskId);
}

export function QueuePage() {
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

  return (
    <div className={cn("flex flex-1 flex-col gap-6 px-6 py-10")}>
      <div>
        <h1 className={cn("text-2xl font-semibold tracking-tight")}>
          Очередь генераций
        </h1>
        <p className={cn("mt-2 text-era-fg-dim")}>
          Все ваши задачи в реальном времени
        </p>
      </div>

      {initStatus === "loading" && <LoadingState />}

      {initStatus === "error" && <ErrorState onRetry={reload} />}

      {initStatus === "ready" && (
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
            <ul className={cn("space-y-3")}>
              {visibleTasks.map((task) => (
                <li key={task.id} className={cn("list-none")}>
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
