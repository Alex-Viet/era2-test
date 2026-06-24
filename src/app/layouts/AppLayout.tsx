import { Outlet, Link } from 'react-router-dom';
import { cn } from '@/shared/lib';

export function AppLayout() {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-era-bg text-era-fg')}>
      <header
        className={cn(
          'flex items-center justify-between border-b border-era-line px-6 py-4',
        )}
      >
        <div className={cn('flex items-center gap-6')}>
          <span className={cn('text-lg font-semibold tracking-tight')}>
            ERA2
          </span>
          <nav className={cn('flex gap-4 text-sm text-era-fg-dim')}>
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
      <main className={cn('flex flex-1 flex-col')}>
        <Outlet />
      </main>
    </div>
  );
}
