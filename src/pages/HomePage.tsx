import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib';

export function HomePage() {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6 sm:py-16',
      )}
    >
      <div className={cn('max-w-lg text-center')}>
        <h1 className={cn('text-3xl font-semibold tracking-tight')}>
          ERA2 — агрегатор нейросетей
        </h1>
        <p className={cn('mt-3 text-era-fg-dim')}>
          Заглушка главной страницы. При активных генерациях внизу появится
          глобальный статус-бар — перейдите в очередь и запустите задачи.
        </p>
      </div>
      <div>
        <Link
          to="/queue"
          className={cn(
            'inline-flex items-center rounded-lg bg-era-accent px-5 py-2.5',
            'text-sm font-medium text-white transition-colors hover:bg-era-accent-2',
          )}
        >
          Открыть очередь →
        </Link>
      </div>
    </div>
  );
}
