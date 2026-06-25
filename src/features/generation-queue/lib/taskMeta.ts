import type { GenerationTask } from '@/entities/generation-task';
import {
  formatCredits,
  formatDoneDuration,
  formatEtaSeconds,
  formatQueuePosition,
} from './formatEta';

/** Мета-строка справа от пилюли модели (как в макете Figma). */
export function formatTaskMetaSuffix(task: GenerationTask): string {
  if (task.status === 'failed') {
    return task.error ?? 'Ошибка генерации';
  }

  if (task.status === 'canceled') {
    return 'отменено пользователем';
  }

  const parts: string[] = [];

  if (task.status === 'queued') {
    const position = formatQueuePosition(task.queuePosition);
    if (position) {
      parts.push(position);
    }
  }

  if (task.status === 'running') {
    const eta = formatEtaSeconds(task.etaSeconds);
    if (eta) {
      parts.push(eta);
    }
  }

  if (task.status === 'done') {
    const duration = formatDoneDuration(task.durationSeconds);
    if (duration) {
      parts.push(duration);
    }
  }

  parts.push(formatCredits(task.credits));

  return parts.join(' · ');
}
