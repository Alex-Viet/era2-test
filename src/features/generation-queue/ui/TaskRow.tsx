import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { truncatePrompt } from '../lib/genTypeConfig';
import { formatTaskMetaSuffix } from '../lib/taskMeta';
import { getTaskSurfaceClass } from '../lib/taskSurfaceStyles';
import { formatProgress } from '../lib/formatEta';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import { TaskActions, type TaskActionsProps } from './TaskActions';
import { TaskTypePreview } from './TaskTypePreview';

export interface TaskRowProps extends Omit<TaskActionsProps, 'compact'> {
  task: GenerationTask;
}

export function TaskRow({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
}: TaskRowProps) {
  const metaSuffix = formatTaskMetaSuffix(task);
  const isRunning = task.status === 'running';

  return (
    <div
      className={cn(
        getTaskSurfaceClass(task.status),
        'hidden items-center gap-3 min-[481px]:flex min-[481px]:gap-4',
        'transition-[border-color,background-color] duration-200',
        'hover:border-era-fg-mute/25',
      )}
    >
      <TaskTypePreview task={task} />

      <div className={cn('min-w-0 flex-1')}>
        <p
          className={cn(
            'truncate text-[15px] font-medium leading-snug text-era-fg',
          )}
          title={task.prompt}
        >
          {truncatePrompt(task.prompt)}
        </p>

        <div className={cn('mt-1.5 flex flex-wrap items-center gap-2')}>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full bg-era-secondary',
              'px-2 py-0.5 font-mono text-xs text-era-fg-dim',
            )}
          >
            <span
              className={cn('size-1.5 shrink-0 rounded-full bg-era-accent-2')}
              aria-hidden
            />
            {task.model}
          </span>
          {metaSuffix && (
            <>
              <span className={cn('text-xs text-era-fg-low')}>·</span>
              <span className={cn('text-xs text-era-fg-mute')}>{metaSuffix}</span>
            </>
          )}
        </div>

        {isRunning && (
          <div className={cn('mt-1.5')}>
            <ProgressBar value={task.progress} size="xs" showLabel={false} />
          </div>
        )}

        {task.status === 'failed' && task.error && (
          <p className={cn('sr-only')}>{task.error}</p>
        )}
      </div>

      <div className={cn('flex shrink-0 items-center gap-3')}>
        {isRunning && (
          <span className={cn('font-mono text-[13px] font-medium text-era-accent-2')}>
            {formatProgress(task.progress)}
          </span>
        )}
        <StatusBadge status={task.status} />
        <TaskActions
          task={task}
          onCancel={onCancel}
          onRetry={onRetry}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
