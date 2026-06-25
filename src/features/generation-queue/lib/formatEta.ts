/**
 * Форматирование ETA (оставшееся время).
 * @example formatEtaSeconds(90) → "~1 мин 30 сек"
 */
export function formatEtaSeconds(seconds: number | undefined): string | null {
  if (seconds === undefined || seconds <= 0) {
    return null;
  }

  if (seconds < 60) {
    return `~${seconds} сек`;
  }

  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (restSeconds === 0) {
    return `~${minutes} мин`;
  }

  return `~${minutes} мин ${restSeconds} сек`;
}

/**
 * Форматирование фактической длительности (`done`).
 * @example formatDurationSeconds(22) → "22 сек"
 */
export function formatDurationSeconds(
  seconds: number | undefined,
): string | null {
  if (seconds === undefined || seconds <= 0) {
    return null;
  }

  if (seconds < 60) {
    return `${seconds} сек`;
  }

  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (restSeconds === 0) {
    return `${minutes} мин`;
  }

  return `${minutes} мин ${restSeconds} сек`;
}

/** Форматирование стоимости в кредитах. */
export function formatCredits(credits: number): string {
  return `${credits} кр.`;
}

/** Позиция в очереди (1-based). */
export function formatQueuePosition(position: number | undefined): string | null {
  if (position === undefined || position <= 0) {
    return null;
  }

  return `#${position} в очереди`;
}

/** Процент прогресса для отображения. */
export function formatProgress(progress: number): string {
  return `${Math.min(100, Math.max(0, Math.round(progress)))}%`;
}
