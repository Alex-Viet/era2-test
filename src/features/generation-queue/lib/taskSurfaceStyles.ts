import type { TaskStatus } from '@/entities/generation-task';
import { cn } from '@/shared/lib';

export function getTaskSurfaceClass(status: TaskStatus): string {
  return cn(
    'rounded-2xl border bg-era-card px-4 py-3.5',
    status === 'running'
      ? 'border-era-accent/35'
      : 'border-era-line',
  );
}

export const STATUS_BADGE_STYLES: Record<
  TaskStatus,
  { container: string; label: string }
> = {
  queued: {
    container: 'bg-era-secondary',
    label: 'text-era-fg-mute',
  },
  running: {
    container: 'bg-[#3a1a0a]',
    label: 'text-era-accent-2',
  },
  done: {
    container: 'bg-[rgba(16,185,129,0.13)]',
    label: 'text-[#34d399]',
  },
  failed: {
    container: 'bg-[rgba(255,90,90,0.12)]',
    label: 'text-[#ff5f57]',
  },
  canceled: {
    container: 'bg-era-secondary',
    label: 'text-era-fg-low',
  },
};

export const STAT_DOT_COLORS: Record<
  'queued' | 'running' | 'done' | 'failed',
  string
> = {
  queued: 'bg-era-fg-mute',
  running: 'bg-era-accent',
  done: 'bg-[#34d399]',
  failed: 'bg-[#ff5f57]',
};
