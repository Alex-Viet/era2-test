import type { GenType, GenerationTask, TaskStatus } from '@/entities/generation-task';

/** Фильтр по статусу (чипы тулбара). */
export type QueueStatusFilter = 'all' | 'queued' | 'running' | 'done' | 'failed';

/** Порядок сортировки списка. */
export type QueueSortOrder = 'newest' | 'oldest';

/** Фильтр по типу генерации (бонус). */
export type QueueTypeFilter = 'all' | GenType;

export interface QueueViewParams {
  statusFilter: QueueStatusFilter;
  sortOrder: QueueSortOrder;
  searchQuery: string;
  typeFilter?: QueueTypeFilter;
}

export interface QueueStats {
  queued: number;
  running: number;
  done: number;
  failed: number;
}

export const QUEUE_STATUS_FILTERS: readonly {
  value: QueueStatusFilter;
  label: string;
}[] = [
  { value: 'all', label: 'Все' },
  { value: 'queued', label: 'В очереди' },
  { value: 'running', label: 'Идёт' },
  { value: 'done', label: 'Готово' },
  { value: 'failed', label: 'Ошибка' },
] as const;

/** Счётчики для карточек сводки (без canceled — по ТЗ 4 карточки). */
export function selectQueueStats(tasks: GenerationTask[]): QueueStats {
  const stats: QueueStats = { queued: 0, running: 0, done: 0, failed: 0 };

  for (const task of tasks) {
    switch (task.status) {
      case 'queued':
        stats.queued += 1;
        break;
      case 'running':
        stats.running += 1;
        break;
      case 'done':
        stats.done += 1;
        break;
      case 'failed':
        stats.failed += 1;
        break;
      default:
        break;
    }
  }

  return stats;
}

/** Активные задачи (`queued` + `running`) — для статус-бара. */
export function selectActiveTasks(tasks: GenerationTask[]): GenerationTask[] {
  return tasks.filter(
    (task) => task.status === 'queued' || task.status === 'running',
  );
}

/** Усреднённый прогресс активных `running`-задач (0–100). */
export function selectAverageRunningProgress(tasks: GenerationTask[]): number {
  const running = tasks.filter((task) => task.status === 'running');
  if (running.length === 0) {
    return 0;
  }

  const total = running.reduce((sum, task) => sum + task.progress, 0);
  return Math.round(total / running.length);
}

export function filterTasksByStatus(
  tasks: GenerationTask[],
  statusFilter: QueueStatusFilter,
): GenerationTask[] {
  if (statusFilter === 'all') {
    return tasks;
  }

  return tasks.filter((task) => task.status === statusFilter);
}

export function filterTasksByType(
  tasks: GenerationTask[],
  typeFilter: QueueTypeFilter = 'all',
): GenerationTask[] {
  if (typeFilter === 'all') {
    return tasks;
  }

  return tasks.filter((task) => task.type === typeFilter);
}

export function filterTasksBySearch(
  tasks: GenerationTask[],
  searchQuery: string,
): GenerationTask[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return tasks;
  }

  return tasks.filter((task) => task.prompt.toLowerCase().includes(query));
}

export function sortTasks(
  tasks: GenerationTask[],
  sortOrder: QueueSortOrder,
): GenerationTask[] {
  const sorted = [...tasks].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.createdAt - a.createdAt;
    }
    return a.createdAt - b.createdAt;
  });

  return sorted;
}

/** Список задач после фильтрации и сортировки. */
export function selectVisibleTasks(
  tasks: GenerationTask[],
  params: QueueViewParams,
): GenerationTask[] {
  const byStatus = filterTasksByStatus(tasks, params.statusFilter);
  const byType = filterTasksByType(byStatus, params.typeFilter);
  const bySearch = filterTasksBySearch(byType, params.searchQuery);
  return sortTasks(bySearch, params.sortOrder);
}

/** Проверка, что задача с указанным статусом существует (для empty state). */
export function hasTasksWithStatus(
  tasks: GenerationTask[],
  status: TaskStatus,
): boolean {
  return tasks.some((task) => task.status === status);
}
