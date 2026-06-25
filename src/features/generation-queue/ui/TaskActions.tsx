import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDownToLine,
  MoreHorizontal,
  RotateCw,
  Trash2,
  X,
} from 'lucide-react';
import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { canCancelTask, canRetryTask } from '../model/queueReducer';

export interface TaskActionsProps {
  task: GenerationTask;
  onCancel: (taskId: string) => void;
  onRetry: (taskId: string) => void;
  onDownload: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  compact?: boolean;
}

function ActionIconButton({
  label,
  onClick,
  accent = false,
  children,
}: {
  label: string;
  onClick: () => void;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn('inline-flex')}>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className={cn(
          'flex size-8 items-center justify-center rounded-lg border border-era-line',
          'bg-era-secondary transition-colors',
          accent
            ? 'text-era-accent-2 hover:text-era-accent-hi'
            : 'text-era-fg-mute hover:text-era-fg',
        )}
      >
        {children}
      </button>
    </div>
  );
}

const accentIconClass = cn('size-3.5 stroke-[1.75]');

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
    <div className={cn('flex items-center gap-1.5', compact && 'justify-end')}>
      {showCancel && (
        <ActionIconButton label="Отмена" onClick={() => onCancel(task.id)}>
          <X className={cn(accentIconClass)} />
        </ActionIconButton>
      )}

      {showRetry && (
        <ActionIconButton
          label="Повторить"
          accent
          onClick={() => onRetry(task.id)}
        >
          <RotateCw className={cn(accentIconClass)} />
        </ActionIconButton>
      )}

      {showDownload && (
        <ActionIconButton
          label="Скачать"
          accent
          onClick={() => onDownload(task.id)}
        >
          <ArrowDownToLine className={cn(accentIconClass)} />
        </ActionIconButton>
      )}

      <div className={cn('relative')} ref={menuRef}>
        <ActionIconButton
          label="Дополнительные действия"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MoreHorizontal className={cn(accentIconClass)} />
        </ActionIconButton>

        {menuOpen && (
          <div
            role="menu"
            className={cn(
              'absolute right-0 top-full z-10 mt-1 min-w-[140px]',
              'rounded-lg border border-era-line bg-era-card py-1 shadow-lg',
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
