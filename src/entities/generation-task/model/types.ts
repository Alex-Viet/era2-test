/** Тип генерации: текст, изображение, видео или аудио. */
export type GenType = 'text' | 'image' | 'video' | 'audio';

/** Статус задачи в очереди. */
export type TaskStatus =
  | 'queued'
  | 'running'
  | 'done'
  | 'failed'
  | 'canceled';

/** Задача генерации — основная доменная сущность ERA2. */
export interface GenerationTask {
  /** Уникальный идентификатор задачи. */
  id: string;
  /** Тип контента, который генерируется. */
  type: GenType;
  /** Пользовательский промпт. */
  prompt: string;
  /** Название модели (отображается в пилюле). */
  model: string;
  /** Текущий статус в очереди. */
  status: TaskStatus;
  /** Прогресс выполнения, 0–100. Актуален для `running`; у `done` = 100. */
  progress: number;
  /** Текст ошибки — только для статуса `failed`. */
  error?: string;
  /** Стоимость задачи в кредитах. */
  credits: number;
  /** Оценка оставшегося времени в секундах (`queued` / `running`). */
  etaSeconds?: number;
  /** Фактическая длительность генерации в секундах (`done`). */
  durationSeconds?: number;
  /** Позиция в очереди, 1-based (`queued`). */
  queuePosition?: number;
  /** Unix-ms: момент создания задачи (FIFO-сортировка). */
  createdAt: number;
  /** Unix-ms: последнее изменение задачи. */
  updatedAt: number;
  /** Unix-ms: момент перехода в `running`. */
  startedAt?: number;
  /** Unix-ms: момент завершения (`done` / `failed` / `canceled`). */
  finishedAt?: number;
}

export const GEN_TYPES: readonly GenType[] = [
  'text',
  'image',
  'video',
  'audio',
] as const;

export const TASK_STATUSES: readonly TaskStatus[] = [
  'queued',
  'running',
  'done',
  'failed',
  'canceled',
] as const;

export const ACTIVE_TASK_STATUSES: readonly TaskStatus[] = [
  'queued',
  'running',
] as const;

export const TERMINAL_TASK_STATUSES: readonly TaskStatus[] = [
  'done',
  'failed',
  'canceled',
] as const;
