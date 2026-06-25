import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { GEN_TYPE_ICONS, GEN_TYPE_LABELS } from '../lib/genTypeConfig';

export interface TaskTypePreviewProps {
  task: GenerationTask;
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: { box: 'size-12', icon: 'size-5' },
  md: { box: 'size-14', icon: 'size-5' },
} as const;

export function TaskTypePreview({ task, size = 'md' }: TaskTypePreviewProps) {
  const Icon = GEN_TYPE_ICONS[task.type];
  const sizes = sizeClasses[size];
  const isTextOrAudio = task.type === 'text' || task.type === 'audio';

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-xl',
        isTextOrAudio
          ? 'bg-[#3a1a0a]'
          : 'bg-gradient-to-br from-[#3b1a0a] to-[#1a1614]',
        sizes.box,
      )}
    >
      <Icon className={cn(sizes.icon, 'text-era-accent-2')} aria-hidden />
      <span className={cn('sr-only')}>{GEN_TYPE_LABELS[task.type]}</span>
    </div>
  );
}
