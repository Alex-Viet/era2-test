import { useLayoutEffect, useRef, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { getStatusLabel } from '../lib/statusLabels';
import { TaskCard } from './TaskCard';
import { TaskRow } from './TaskRow';
import type { TaskActionsProps } from './TaskActions';

export const VIRTUALIZE_THRESHOLD = 15;

const ROW_ESTIMATE_PX = 104;

export interface TaskVirtualListProps extends Omit<TaskActionsProps, 'task'> {
  tasks: GenerationTask[];
}

export function TaskVirtualList({
  tasks,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
}: TaskVirtualListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    if (listRef.current) {
      setScrollMargin(listRef.current.offsetTop);
    }
  }, [tasks.length]);

  const virtualizer = useWindowVirtualizer({
    count: tasks.length,
    estimateSize: () => ROW_ESTIMATE_PX,
    overscan: 4,
    scrollMargin,
  });

  const taskActions = { onCancel, onRetry, onDownload, onDelete };

  return (
    <ul
      ref={listRef}
      className={cn('relative w-full')}
      style={{ height: `${virtualizer.getTotalSize()}px` }}
      role="list"
      aria-label="Список задач генерации"
    >
      {virtualizer.getVirtualItems().map((virtualItem) => {
        const task = tasks[virtualItem.index];
        if (!task) {
          return null;
        }

        const statusLabel = getStatusLabel(task.status);

        return (
          <li
            key={task.id}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            className={cn(
              'absolute left-0 top-0 w-full list-none pb-2.5',
              'transition-opacity duration-150 motion-reduce:transition-none',
            )}
            style={{
              transform: `translateY(${virtualItem.start - scrollMargin}px)`,
            }}
            role="listitem"
            aria-label={`${task.prompt}, ${statusLabel}`}
          >
            <TaskRow task={task} {...taskActions} />
            <TaskCard task={task} {...taskActions} />
          </li>
        );
      })}
    </ul>
  );
}

export function TaskStaticList({
  tasks,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
}: TaskVirtualListProps) {
  const taskActions = { onCancel, onRetry, onDownload, onDelete };

  return (
    <ul
      className={cn('space-y-2.5')}
      role="list"
      aria-label="Список задач генерации"
    >
      {tasks.map((task, index) => {
        const statusLabel = getStatusLabel(task.status);

        return (
          <li
            key={task.id}
            className={cn(
              'list-none motion-safe:animate-queue-item-in',
              'transition-opacity duration-150 motion-reduce:transition-none',
            )}
            style={
              index < 8
                ? { animationDelay: `${Math.min(index * 40, 280)}ms` }
                : undefined
            }
            role="listitem"
            aria-label={`${task.prompt}, ${statusLabel}`}
          >
            <TaskRow task={task} {...taskActions} />
            <TaskCard task={task} {...taskActions} />
          </li>
        );
      })}
    </ul>
  );
}

/** Выбирает статический или виртуальный список в зависимости от размера. */
export function TaskList(props: TaskVirtualListProps) {
  if (props.tasks.length >= VIRTUALIZE_THRESHOLD) {
    return <TaskVirtualList {...props} />;
  }

  return <TaskStaticList {...props} />;
}
