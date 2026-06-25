import { Inbox } from 'lucide-react';
import { cn } from '@/shared/lib';

export type EmptyStateVariant = 'no-tasks' | 'no-results';

export interface EmptyStateProps {
  variant: EmptyStateVariant;
}

const EMPTY_COPY: Record<
  EmptyStateVariant,
  { title: string; description: string }
> = {
  'no-tasks': {
    title: 'Очередь пуста',
    description:
      'Здесь появятся задачи генерации, когда вы отправите запрос к нейросети.',
  },
  'no-results': {
    title: 'Ничего не найдено',
    description:
      'По текущим фильтрам или поисковому запросу задач нет. Попробуйте изменить условия.',
  },
};

export function EmptyState({ variant }: EmptyStateProps) {
  const copy = EMPTY_COPY[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed',
        'border-era-line bg-era-bg-1 px-6 py-12 text-center',
      )}
    >
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-full',
          'bg-era-bg-2 text-era-fg-mute',
        )}
      >
        <Inbox className={cn('size-6')} aria-hidden />
      </div>
      <h2 className={cn('mt-4 text-lg font-semibold text-era-fg')}>
        {copy.title}
      </h2>
      <p className={cn('mt-2 max-w-md text-sm text-era-fg-dim')}>
        {copy.description}
      </p>
    </div>
  );
}
