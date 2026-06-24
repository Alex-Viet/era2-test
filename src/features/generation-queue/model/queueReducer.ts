import type { GenerationTask, TaskStatus } from '@/entities/generation-task';

/** Состояние очереди генераций. */
export interface QueueState {
  tasks: GenerationTask[];
}

/** Допустимые переходы конечного автомата по статусам. */
const STATUS_TRANSITIONS: Record<TaskStatus, readonly TaskStatus[]> = {
  queued: ['running', 'canceled'],
  running: ['done', 'failed', 'canceled'],
  done: [],
  failed: [],
  canceled: [],
} as const;

export type QueueAction =
  | { type: 'QUEUE/INIT'; payload: { tasks: GenerationTask[] } }
  | { type: 'QUEUE/START'; payload: { taskId: string; now: number } }
  | {
      type: 'QUEUE/UPDATE_PROGRESS';
      payload: {
        taskId: string;
        progress: number;
        etaSeconds?: number;
        now: number;
      };
    }
  | { type: 'QUEUE/COMPLETE'; payload: { taskId: string; now: number } }
  | {
      type: 'QUEUE/FAIL';
      payload: { taskId: string; error: string; now: number };
    }
  | { type: 'QUEUE/CANCEL'; payload: { taskId: string; now: number } }
  | { type: 'QUEUE/RETRY'; payload: { taskId: string; now: number } }
  | { type: 'QUEUE/DELETE'; payload: { taskId: string } }
  | { type: 'QUEUE/CLEAR_DONE' };

export const initialQueueState: QueueState = {
  tasks: [],
};

/** Проверяет, допустим ли переход между статусами. */
export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function canCancelTask(task: GenerationTask): boolean {
  return task.status === 'queued' || task.status === 'running';
}

export function canRetryTask(task: GenerationTask): boolean {
  return task.status === 'failed' || task.status === 'canceled';
}

export function canDeleteTask(): boolean {
  return true;
}

function clampProgress(progress: number): number {
  return Math.min(100, Math.max(0, Math.round(progress)));
}

function withUpdatedTimestamp(
  task: GenerationTask,
  now: number,
  patch: Partial<GenerationTask>,
): GenerationTask {
  return { ...task, ...patch, updatedAt: now };
}

/** Применяет функцию-обновитель к задаче по идентификатору. */
function patchTask(
  tasks: GenerationTask[],
  taskId: string,
  updater: (task: GenerationTask) => GenerationTask | null,
): GenerationTask[] {
  let changed = false;

  const next = tasks.flatMap((task) => {
    if (task.id !== taskId) {
      return [task];
    }

    const updated = updater(task);
    if (updated === null) {
      changed = true;
      return [];
    }

    if (updated !== task) {
      changed = true;
    }

    return [updated];
  });

  return changed ? next : tasks;
}

/** Убирает позицию в очереди из задачи. */
function stripQueuePosition(task: GenerationTask): GenerationTask {
  if (task.queuePosition === undefined) {
    return task;
  }

  const copy = { ...task };
  delete copy.queuePosition;
  return copy;
}

/** Пересчитывает позиции в очереди для задач со статусом `queued` (FIFO по createdAt). */
export function recalculateQueuePositions(
  tasks: GenerationTask[],
): GenerationTask[] {
  const queuedIds = tasks
    .filter((task) => task.status === 'queued')
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((task) => task.id);

  const positionById = new Map(
    queuedIds.map((id, index) => [id, index + 1] as const),
  );

  let changed = false;

  const next = tasks.map((task) => {
    if (task.status !== 'queued') {
      if (task.queuePosition !== undefined) {
        changed = true;
        return stripQueuePosition(task);
      }
      return task;
    }

    const nextPosition = positionById.get(task.id);
    if (task.queuePosition === nextPosition) {
      return task;
    }

    changed = true;
    return { ...task, queuePosition: nextPosition };
  });

  return changed ? next : tasks;
}

function finalizeTasks(tasks: GenerationTask[]): GenerationTask[] {
  return recalculateQueuePositions(tasks);
}

export function queueReducer(
  state: QueueState,
  action: QueueAction,
): QueueState {
  switch (action.type) {
    case 'QUEUE/INIT':
      return {
        tasks: finalizeTasks(action.payload.tasks.map((task) => ({ ...task }))),
      };

    case 'QUEUE/START':
      return {
        tasks: finalizeTasks(
          patchTask(state.tasks, action.payload.taskId, (task) => {
            if (!canTransition(task.status, 'running')) {
              return task;
            }

            return withUpdatedTimestamp(task, action.payload.now, {
              status: 'running',
              startedAt: action.payload.now,
              progress: task.status === 'queued' ? 0 : task.progress,
              error: undefined,
              finishedAt: undefined,
              durationSeconds: undefined,
              queuePosition: undefined,
            });
          }),
        ),
      };

    case 'QUEUE/UPDATE_PROGRESS':
      return {
        tasks: patchTask(state.tasks, action.payload.taskId, (task) => {
          if (task.status !== 'running') {
            return task;
          }

          return withUpdatedTimestamp(task, action.payload.now, {
            progress: clampProgress(action.payload.progress),
            ...(action.payload.etaSeconds !== undefined
              ? { etaSeconds: action.payload.etaSeconds }
              : {}),
          });
        }),
      };

    case 'QUEUE/COMPLETE':
      return {
        tasks: finalizeTasks(
          patchTask(state.tasks, action.payload.taskId, (task) => {
            if (!canTransition(task.status, 'done')) {
              return task;
            }

            const durationSeconds =
              task.startedAt !== undefined
                ? Math.max(
                    1,
                    Math.round(
                      (action.payload.now - task.startedAt) / 1000,
                    ),
                  )
                : undefined;

            return withUpdatedTimestamp(task, action.payload.now, {
              status: 'done',
              progress: 100,
              error: undefined,
              etaSeconds: undefined,
              queuePosition: undefined,
              finishedAt: action.payload.now,
              durationSeconds,
            });
          }),
        ),
      };

    case 'QUEUE/FAIL':
      return {
        tasks: finalizeTasks(
          patchTask(state.tasks, action.payload.taskId, (task) => {
            if (!canTransition(task.status, 'failed')) {
              return task;
            }

            return withUpdatedTimestamp(task, action.payload.now, {
              status: 'failed',
              error: action.payload.error,
              etaSeconds: undefined,
              queuePosition: undefined,
              finishedAt: action.payload.now,
            });
          }),
        ),
      };

    case 'QUEUE/CANCEL':
      return {
        tasks: finalizeTasks(
          patchTask(state.tasks, action.payload.taskId, (task) => {
            if (!canTransition(task.status, 'canceled')) {
              return task;
            }

            return withUpdatedTimestamp(task, action.payload.now, {
              status: 'canceled',
              error: undefined,
              etaSeconds: undefined,
              queuePosition: undefined,
              finishedAt: action.payload.now,
            });
          }),
        ),
      };

    case 'QUEUE/RETRY':
      return {
        tasks: finalizeTasks(
          patchTask(state.tasks, action.payload.taskId, (task) => {
            if (!canRetryTask(task)) {
              return task;
            }

            return withUpdatedTimestamp(task, action.payload.now, {
              status: 'queued',
              progress: 0,
              error: undefined,
              startedAt: undefined,
              finishedAt: undefined,
              durationSeconds: undefined,
              etaSeconds: undefined,
            });
          }),
        ),
      };

    case 'QUEUE/DELETE':
      return {
        tasks: finalizeTasks(
          patchTask(state.tasks, action.payload.taskId, () => null),
        ),
      };

    case 'QUEUE/CLEAR_DONE':
      return {
        tasks: finalizeTasks(
          state.tasks.filter((task) => task.status !== 'done'),
        ),
      };

    default:
      return state;
  }
}

/** Фабрики action — удобны для движка и UI. */
export const queueActions = {
  init(tasks: GenerationTask[]): QueueAction {
    return { type: 'QUEUE/INIT', payload: { tasks } };
  },

  start(taskId: string, now = Date.now()): QueueAction {
    return { type: 'QUEUE/START', payload: { taskId, now } };
  },

  updateProgress(
    taskId: string,
    progress: number,
    etaSeconds?: number,
    now = Date.now(),
  ): QueueAction {
    return {
      type: 'QUEUE/UPDATE_PROGRESS',
      payload: { taskId, progress, etaSeconds, now },
    };
  },

  complete(taskId: string, now = Date.now()): QueueAction {
    return { type: 'QUEUE/COMPLETE', payload: { taskId, now } };
  },

  fail(taskId: string, error: string, now = Date.now()): QueueAction {
    return { type: 'QUEUE/FAIL', payload: { taskId, error, now } };
  },

  cancel(taskId: string, now = Date.now()): QueueAction {
    return { type: 'QUEUE/CANCEL', payload: { taskId, now } };
  },

  retry(taskId: string, now = Date.now()): QueueAction {
    return { type: 'QUEUE/RETRY', payload: { taskId, now } };
  },

  delete(taskId: string): QueueAction {
    return { type: 'QUEUE/DELETE', payload: { taskId } };
  },

  clearDone(): QueueAction {
    return { type: 'QUEUE/CLEAR_DONE' };
  },
} as const;

export const QUEUE_FAIL_MESSAGES = [
  'Недостаточно кредитов',
  'Превышено время ожидания',
  'Модель временно недоступна',
] as const;
