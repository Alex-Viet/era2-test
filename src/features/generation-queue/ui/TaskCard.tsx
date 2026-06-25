import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { truncatePrompt } from '../lib/genTypeConfig';
import { getTaskMetaItems } from '../lib/taskMeta';
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
  const metaItems = getTaskMetaItems(task);

  return (
    <article
      className={cn(
        'block rounded-xl border border-era-line bg-era-bg-1 p-4 lg:hidden',
        'transition-[border-color,background-color] duration-200',
        'hover:border-era-fg-mute/25 hover:bg-era-bg-2/60',
      )}
    >
      <div className={cn('flex items-start gap-3')}>
        <TaskTypePreview task={task} size="sm" />

        <div className={cn('min-w-0 flex-1')}>
          <div className={cn('flex items-start justify-between gap-2')}>
            <p
              className={cn('line-clamp-2 text-sm font-medium text-era-fg')}
              title={task.prompt}
            >
              {truncatePrompt(task.prompt, 80)}
            </p>
            <StatusBadge status={task.status} />
          </div>

          <div className={cn('mt-2 flex flex-wrap items-center gap-2')}>
            <span
              className={cn(
                'inline-flex rounded-full border border-era-line bg-era-bg-2',
                'px-2 py-0.5 font-mono text-xs text-era-fg-dim',
              )}
            >
              {task.model}
            </span>
            {metaItems.map((item) => (
              <span key={item} className={cn('text-xs text-era-fg-mute')}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {task.status === 'running' && (
        <div className={cn('mt-3')}>
          <ProgressBar value={task.progress} />
        </div>
      )}

      {task.status === 'failed' && task.error && (
        <p className={cn('mt-2 text-sm text-status-failed')}>{task.error}</p>
      )}

      <div className={cn('mt-3 border-t border-era-line pt-3')}>
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
