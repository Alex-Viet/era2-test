import { cn } from '@/shared/lib';
import { useQueue } from '@/features/generation-queue';

export function QueuePage() {
  const { state, initStatus } = useQueue();

  return (
    <div className={cn('flex flex-1 flex-col px-6 py-10')}>
      <h1 className={cn('text-2xl font-semibold tracking-tight')}>
        Очередь генераций
      </h1>
      <p className={cn('mt-2 text-era-fg-dim')}>
        {initStatus === 'loading' && 'Загрузка очереди…'}
        {initStatus === 'ready' &&
          `Движок активен · задач: ${state.tasks.length}`}
        {initStatus === 'error' && 'Ошибка загрузки (см. reload на этапе UI)'}
      </p>
      {initStatus === 'ready' && (
        <ul className={cn('mt-6 space-y-2 font-mono text-sm text-era-fg-dim')}>
          {state.tasks.map((task) => (
            <li key={task.id}>
              {task.id} · {task.status} · {task.progress}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
