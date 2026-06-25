import type { GenerationTask } from '@/entities/generation-task';
import { GEN_TYPES, TASK_STATUSES } from '@/entities/generation-task';
import { recalculateQueuePositions } from '../model/queueReducer';

const STORAGE_KEY = 'era2:generation-queue:v1';

/** Единая точка доступа к localStorage (null вне браузера или при блокировке). */
function getStorage(): Storage | null {
  if (typeof globalThis.localStorage === 'undefined') {
    return null;
  }

  return globalThis.localStorage;
}

function readStorageItem(key: string): string | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageItem(key: string, value: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    // QuotaExceeded, private mode и т.п.
  }
}

function removeStorageItem(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isGenerationTask(value: unknown): value is GenerationTask {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.prompt === 'string' &&
    typeof value.model === 'string' &&
    typeof value.status === 'string' &&
    TASK_STATUSES.includes(value.status as GenerationTask['status']) &&
    typeof value.type === 'string' &&
    GEN_TYPES.includes(value.type as GenerationTask['type']) &&
    typeof value.progress === 'number' &&
    typeof value.credits === 'number' &&
    typeof value.createdAt === 'number' &&
    typeof value.updatedAt === 'number'
  );
}

/**
 * После перезагрузки `running` → `queued`: движок заново возьмёт задачи в слоты.
 * Прогресс сбрасывается, чтобы не было «зависших» процентов без таймера.
 */
export function normalizeTasksForRestore(
  tasks: GenerationTask[],
): GenerationTask[] {
  const now = Date.now();

  const normalized = tasks.map((task) => {
    if (task.status !== 'running') {
      return { ...task };
    }

    return {
      ...task,
      status: 'queued' as const,
      progress: 0,
      startedAt: undefined,
      etaSeconds: undefined,
      updatedAt: now,
    };
  });

  return recalculateQueuePositions(normalized);
}

export function loadPersistedTasks(): GenerationTask[] | null {
  const raw = readStorageItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    if (!parsed.every(isGenerationTask)) {
      return null;
    }

    return normalizeTasksForRestore(parsed);
  } catch {
    return null;
  }
}

export function savePersistedTasks(tasks: GenerationTask[]): void {
  writeStorageItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function clearPersistedTasks(): void {
  removeStorageItem(STORAGE_KEY);
}

export { STORAGE_KEY as QUEUE_STORAGE_KEY };
