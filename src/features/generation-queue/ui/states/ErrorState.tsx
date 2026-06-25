import { AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

export interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-status-failed/30',
        'bg-status-failed-soft px-6 py-12 text-center',
      )}
    >
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-full',
          'bg-status-failed/15 text-status-failed',
        )}
      >
        <AlertCircle className={cn('size-6')} aria-hidden />
      </div>
      <h2 className={cn('mt-4 text-lg font-semibold text-era-fg')}>
        Не удалось загрузить очередь
      </h2>
      <p className={cn('mt-2 max-w-md text-sm text-era-fg-dim')}>
        Произошла ошибка при инициализации данных. Проверьте подключение и
        попробуйте снова.
      </p>
      <div className={cn('mt-6')}>
        <Button type="button" onClick={onRetry}>
          Повторить
        </Button>
      </div>
    </div>
  );
}
