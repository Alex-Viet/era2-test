import { Link, Outlet } from 'react-router-dom';
import { GenerationStatusBar } from '@/features/generation-queue';
import { cn } from '@/shared/lib';

export function AppLayout() {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-era-bg text-era-fg')}>
      <header
        className={cn(
          'flex h-16 shrink-0 items-center justify-between border-b border-era-line',
          'px-4 sm:px-6',
        )}
      >
        <Link to="/" className={cn('flex items-center gap-2.5')}>
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-lg',
              'bg-gradient-to-br from-era-accent to-[#ff7a3d] text-lg font-bold text-white',
            )}
          >
            E
          </div>
          <span className={cn('text-xl font-semibold tracking-[-0.4px] text-era-fg')}>
            era2
          </span>
          <span className={cn('font-mono text-[13px] text-era-fg-mute')}>.ai</span>
        </Link>

        <div className={cn('flex items-center gap-2')}>
          <div
            className={cn(
              'hidden h-9 w-40 items-center rounded-full border border-era-line',
              'bg-era-secondary px-3 text-sm text-era-fg-mute lg:flex',
            )}
          >
            Поиск моделей
          </div>
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-full border border-era-line',
              'bg-era-secondary text-sm text-era-fg-mute lg:hidden',
            )}
            aria-hidden
          >
            ⌕
          </div>
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-full border border-era-line',
              'bg-era-secondary text-sm text-era-fg-mute',
            )}
            aria-hidden
          >
            ☾
          </div>
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-full',
              'bg-gradient-to-br from-[#8c4d99] to-[#4d3380] text-sm font-medium text-white',
            )}
            aria-hidden
          >
            А
          </div>
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
