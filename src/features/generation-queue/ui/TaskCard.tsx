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

export interface TaskCardProps extends Omit<TaskActionsProps, 'compact'> {
  task: GenerationTask;
}

export function TaskCard({
  task,
  onCancel,
  onRetry,
  onDownload,
  onDelete,
}: TaskCardProps) {
  const metaSuffix = formatTaskMetaSuffix(task);
  const isRunning = task.status === 'running';

  return (
    <article
      className={cn(
        getTaskSurfaceClass(task.status),
        'block p-3.5 max-[480px]:block min-[481px]:hidden',
        'transition-[border-color,background-color] duration-200',
      )}
    >
      <div className={cn('flex items-start gap-3')}>
        <TaskTypePreview task={task} size="sm" />

        <div className={cn('min-w-0 flex-1')}>
          <p
            className={cn('line-clamp-2 text-[15px] font-medium leading-snug text-era-fg')}
            title={task.prompt}
          >
            {truncatePrompt(task.prompt, 80)}
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
              <span className={cn('text-xs text-era-fg-mute')}>{metaSuffix}</span>
            )}
          </div>
        </div>
      </div>

      {isRunning && (
        <div className={cn('mt-3')}>
          <ProgressBar value={task.progress} size="xs" showLabel={false} />
        </div>
      )}

      <div className={cn('mt-3 flex items-center justify-between gap-3')}>
        <div className={cn('flex items-center gap-2')}>
          <StatusBadge status={task.status} />
          {isRunning && (
            <span className={cn('font-mono text-[13px] text-era-accent-2')}>
              {formatProgress(task.progress)}
            </span>
          )}
        </div>
        <TaskActions
          task={task}
          onCancel={onCancel}
          onRetry={onRetry}
          onDownload={onDownload}
          onDelete={onDelete}
          compact
        />
      </div>
    </article>
  );
}
