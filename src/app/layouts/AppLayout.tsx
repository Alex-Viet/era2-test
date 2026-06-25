import { Outlet, Link } from 'react-router-dom';
import { GenerationStatusBar } from '@/features/generation-queue';
import { cn } from '@/shared/lib';

export function AppLayout() {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-era-bg text-era-fg')}>
      <header
        className={cn(
          'flex items-center justify-between border-b border-era-line',
          'px-4 py-3 sm:px-6 sm:py-4',
        )}
      >
        <div className={cn('flex items-center gap-4 sm:gap-6')}>
          <span className={cn('text-lg font-semibold tracking-tight')}>
            ERA2
          </span>
          <nav className={cn('flex gap-3 text-sm text-era-fg-dim sm:gap-4')}>
            <Link
              to="/"
              className={cn('transition-colors hover:text-era-fg')}
            >
              Главная
            </Link>
            <Link
              to="/queue"
              className={cn('transition-colors hover:text-era-fg')}
            >
              Очередь
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={cn(
          'flex flex-1 flex-col',
          'max-[480px]:pb-[calc(4.5rem+env(safe-area-inset-bottom))]',
        )}
      >
        <Outlet />
      </main>
      <GenerationStatusBar />
    </div>
  );
}
