import { useEffect, useRef, useState } from 'react';
import {
  Download,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { Button, IconButton } from '@/shared/ui';
import { canCancelTask, canRetryTask } from '../model/queueReducer';

export interface TaskActionsProps {
  task: GenerationTask;
  onCancel: (taskId: string) => void;
  onRetry: (taskId: string) => void;
  onDownload: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  compact?: boolean;
}

export function TaskActions({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
  compact = false,
}: TaskActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const showCancel = canCancelTask(task);
  const showRetry = canRetryTask(task);
  const showDownload = task.status === 'done';

  return (
    <div
      className={cn(
        'flex items-center gap-1',
        compact ? 'justify-end' : 'shrink-0',
      )}
    >
      {showCancel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCancel(task.id)}
        >
          <span className={cn('inline-flex items-center gap-1.5')}>
            <X className={cn('size-3.5')} />
            {!compact && 'Отмена'}
          </span>
        </Button>
      )}

      {showRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRetry(task.id)}
        >
          <span className={cn('inline-flex items-center gap-1.5')}>
            <RotateCcw className={cn('size-3.5')} />
            {!compact && 'Повторить'}
          </span>
        </Button>
      )}

      {showDownload && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDownload(task.id)}
        >
          <span className={cn('inline-flex items-center gap-1.5')}>
            <Download className={cn('size-3.5')} />
            {!compact && 'Скачать'}
          </span>
        </Button>
      )}

      <div className={cn('relative')} ref={menuRef}>
        <IconButton
          size="sm"
          label="Дополнительные действия"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MoreHorizontal className={cn('size-4')} />
        </IconButton>

        {menuOpen && (
          <div
            role="menu"
            className={cn(
              'absolute right-0 top-full z-10 mt-1 min-w-[140px]',
              'rounded-lg border border-era-line bg-era-bg-2 py-1 shadow-lg',
              'motion-safe:animate-queue-item-in',
            )}
          >
            <button
              type="button"
              role="menuitem"
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                'text-status-failed transition-colors hover:bg-era-bg-3',
              )}
              onClick={() => {
                onDelete(task.id);
                setMenuOpen(false);
              }}
            >
              <Trash2 className={cn('size-3.5')} />
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
