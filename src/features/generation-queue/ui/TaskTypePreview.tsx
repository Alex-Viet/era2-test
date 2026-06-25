import { ImageIcon } from 'lucide-react';
import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { GEN_TYPE_ICONS, GEN_TYPE_LABELS } from '../lib/genTypeConfig';

export interface TaskTypePreviewProps {
  task: GenerationTask;
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: { box: 'size-10', icon: 'size-4' },
  md: { box: 'size-11', icon: 'size-5' },
} as const;

export function TaskTypePreview({ task, size = 'md' }: TaskTypePreviewProps) {
  const Icon = GEN_TYPE_ICONS[task.type];
  const isMediaPreview = task.type === 'image' || task.type === 'video';
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden',
        'rounded-lg border border-era-line bg-era-bg-2',
        sizes.box,
      )}
    >
      {isMediaPreview ? (
        <div
          className={cn(
            'flex size-full items-center justify-center bg-era-bg-3 text-era-fg-mute',
          )}
        >
          <ImageIcon className={cn(sizes.icon)} aria-hidden />
        </div>
      ) : (
        <Icon className={cn(sizes.icon, 'text-era-fg-dim')} aria-hidden />
      )}
      <span className={cn('sr-only')}>{GEN_TYPE_LABELS[task.type]}</span>
    </div>
  );
}
