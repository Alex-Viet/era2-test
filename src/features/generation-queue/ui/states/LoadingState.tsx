import { cn } from '@/shared/lib';

export function LoadingState() {
  return (
    <div className={cn('flex flex-col gap-6')} aria-busy="true" aria-live="polite">
      <p className={cn('sr-only')}>Загрузка очереди генераций</p>

      <div
        className={cn(
          'grid grid-cols-2 gap-3',
          'max-[480px]:grid-cols-2 lg:grid-cols-4',
        )}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'rounded-xl border border-era-line bg-era-bg-2 px-4 py-3',
              'animate-pulse',
            )}
          >
            <div className={cn('h-3 w-16 rounded bg-era-bg-3')} />
            <div className={cn('mt-3 h-7 w-10 rounded bg-era-bg-3')} />
          </div>
        ))}
      </div>

      <div className={cn('flex flex-col gap-3')}>
        <div className={cn('flex gap-2')}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-8 w-24 shrink-0 rounded-full bg-era-bg-2 animate-pulse',
              )}
            />
          ))}
        </div>
        <div className={cn('flex flex-col gap-3 sm:flex-row')}>
          <div
            className={cn(
              'h-10 flex-1 rounded-lg bg-era-bg-2 animate-pulse',
            )}
          />
          <div
            className={cn(
              'h-10 w-full rounded-lg bg-era-bg-2 animate-pulse sm:w-44',
            )}
          />
        </div>
      </div>

      <div className={cn('space-y-3')}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'rounded-xl border border-era-line bg-era-bg-1 p-4',
              'animate-pulse',
            )}
          >
            <div className={cn('flex gap-4')}>
              <div className={cn('size-11 rounded-lg bg-era-bg-3')} />
              <div className={cn('flex-1 space-y-2')}>
                <div className={cn('h-4 w-3/4 rounded bg-era-bg-3')} />
                <div className={cn('h-3 w-1/2 rounded bg-era-bg-3')} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
