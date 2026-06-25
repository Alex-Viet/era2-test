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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const deleteItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    deleteItemRef.current?.focus();

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !menuRef.current) {
        return;
      }

      const focusables = menuRef.current.querySelectorAll<HTMLElement>(
        'button[role="menuitem"]',
      );
      const items = Array.from(focusables);
      if (items.length === 0) {
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
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
        <div className={cn('inline-flex')}>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Дополнительные действия"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            title="Дополнительные действия"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg border border-era-line',
              'bg-era-secondary text-era-fg-mute transition-colors hover:text-era-fg',
            )}
          >
            <MoreHorizontal className={cn(accentIconClass)} />
          </button>
        </div>

        {menuOpen && (
          <div
            role="menu"
            aria-label="Действия с задачей"
            className={cn(
              'absolute right-0 top-full z-10 mt-1 min-w-[140px]',
              'rounded-lg border border-era-line bg-era-card py-1 shadow-lg',
              'motion-safe:animate-queue-item-in',
            )}
          >
            <button
              ref={deleteItemRef}
              type="button"
              role="menuitem"
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                'text-status-failed transition-colors hover:bg-era-bg-3',
                'focus-visible:bg-era-bg-3 focus-visible:outline-none',
              )}
              onClick={() => {
                onDelete(task.id);
                setMenuOpen(false);
              }}
            >
              <Trash2 className={cn('size-3.5')} aria-hidden />
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
