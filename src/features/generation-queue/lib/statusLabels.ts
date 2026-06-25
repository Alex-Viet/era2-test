import type { TaskStatus } from '@/entities/generation-task';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  queued: 'В очереди',
  running: 'Идёт',
  done: 'Готово',
  failed: 'Ошибка',
  canceled: 'Отменено',
};

export function getStatusLabel(status: TaskStatus): string {
  return STATUS_LABELS[status];
}
