import type { GenerationTask } from '@/entities/generation-task';
import {
  formatCredits,
  formatDurationSeconds,
  formatEtaSeconds,
  formatQueuePosition,
} from './formatEta';

/** Собирает мета-строки для пилюли модели (ETA / длительность / кредиты / очередь). */
export function getTaskMetaItems(task: GenerationTask): string[] {
  const items = [formatCredits(task.credits)];

  const eta = formatEtaSeconds(task.etaSeconds);
  if (eta) {
    items.push(eta);
  }

  const duration = formatDurationSeconds(task.durationSeconds);
  if (duration) {
    items.push(duration);
  }

  const position = formatQueuePosition(task.queuePosition);
  if (position) {
    items.push(position);
  }

  return items;
}
