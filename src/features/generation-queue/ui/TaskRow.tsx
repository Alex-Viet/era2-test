import type { GenerationTask } from '@/entities/generation-task';
import { cn } from '@/shared/lib';
import { truncatePrompt } from '../lib/genTypeConfig';
import { getTaskMetaItems } from '../lib/taskMeta';
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
  const metaItems = getTaskMetaItems(task);

  return (
    <div
      className={cn(
        'hidden min-[481px]:grid grid-cols-[auto_1fr_auto_auto] items-center gap-4',
        'rounded-xl border border-era-line bg-era-bg-1 px-4 py-3',
      )}
    >
      <TaskTypePreview task={task} />

      <div className={cn('min-w-0')}>
        <p
          className={cn('truncate text-sm font-medium text-era-fg')}
          title={task.prompt}
        >
          {truncatePrompt(task.prompt)}
        </p>

        <div className={cn('mt-1.5 flex flex-wrap items-center gap-2')}>
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

        {task.status === 'running' && (
          <div className={cn('mt-3 max-w-md')}>
            <ProgressBar value={task.progress} />
          </div>
        )}

        {task.status === 'failed' && task.error && (
          <p className={cn('mt-2 text-sm text-status-failed')}>{task.error}</p>
        )}
      </div>

      <StatusBadge status={task.status} />

      <TaskActions
        task={task}
        onCancel={onCancel}
        onRetry={onRetry}
        onDownload={onDownload}
        onDelete={onDelete}
      />
    </div>
  );
}
