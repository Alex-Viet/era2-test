import { RotateCcw, X } from 'lucide-react';
import { cn } from '@/shared/lib';

export interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'fixed z-50 flex items-center gap-3 rounded-xl border border-era-line',
        'bg-era-card px-4 py-3 shadow-lg',
        'left-1/2 -translate-x-1/2',
        'bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] max-[480px]:bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))]',
        'max-w-[min(100vw-2rem,28rem)]',
        'motion-safe:animate-queue-item-in',
      )}
    >
      <p className={cn('min-w-0 flex-1 text-sm text-era-fg')}>{message}</p>

      <div className={cn('flex shrink-0 items-center gap-1')}>
        <div className={cn('inline-flex')}>
          <button
            type="button"
            onClick={onUndo}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5',
              'text-sm font-medium text-era-accent-2 transition-colors',
              'hover:text-era-accent-hi',
            )}
          >
            <RotateCcw className={cn('size-3.5')} aria-hidden />
            Отменить
          </button>
        </div>

        <div className={cn('inline-flex')}>
          <button
            type="button"
            aria-label="Закрыть уведомление"
            onClick={onDismiss}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg',
              'text-era-fg-mute transition-colors hover:text-era-fg',
            )}
          >
            <X className={cn('size-4')} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
