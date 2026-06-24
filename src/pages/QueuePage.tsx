import { cn } from '@/shared/lib';

export function QueuePage() {
  return (
    <div className={cn('flex flex-1 flex-col px-6 py-10')}>
      <h1 className={cn('text-2xl font-semibold tracking-tight')}>
        Очередь генераций
      </h1>
      <p className={cn('mt-2 text-era-fg-dim')}>
        Виджет очереди будет добавлен на следующих этапах.
      </p>
    </div>
  );
}
