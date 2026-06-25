import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib';
import { IconButton } from '@/shared/ui';
import { GEN_TYPE_LABELS } from '../lib/genTypeConfig';
import { formatProgress } from '../lib/formatEta';
import {
  selectActiveTasks,
  selectAverageActiveProgress,
  selectStatusBarPreviewTasks,
} from '../model/selectors';
import { useQueue } from '../model/useQueue';
import { ProgressBar } from './ProgressBar';

export function GenerationStatusBar() {
  const { state, initStatus } = useQueue();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const activeTasks = useMemo(
    () => selectActiveTasks(state.tasks),
    [state.tasks],
  );

  const activeCount = activeTasks.length;
  const averageProgress = useMemo(
    () => selectAverageActiveProgress(state.tasks),
    [state.tasks],
  );

  const previewTasks = useMemo(
    () => selectStatusBarPreviewTasks(state.tasks),
    [state.tasks],
  );

  const isVisible =
    initStatus === 'ready' &&
    activeCount > 0 &&
    location.pathname !== '/queue';

  const openQueue = () => {
    navigate('/queue');
  };

  if (!isVisible) {
    return null;
  }

  const isSingle = activeCount === 1;
  const singleTask = isSingle ? activeTasks[0] : null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-50',
        'max-[480px]:inset-x-0 bottom-0',
        'min-[481px]:right-6 bottom-6 w-[min(calc(100vw-3rem),360px)]',
        'transition-[opacity,transform] duration-300 ease-out',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto overflow-hidden border border-era-line bg-era-bg-2 shadow-xl',
          'max-[480px]:rounded-t-2xl max-[480px]:border-b-0',
          'min-[481px]:rounded-2xl',
          'pb-[max(0.75rem,env(safe-area-inset-bottom))] max-[480px]:px-4 max-[480px]:pt-3',
          'min-[481px]:p-4',
        )}
      >
        {isSingle && singleTask && (
          <button
            type="button"
            onClick={openQueue}
            className={cn(
              'flex w-full items-center gap-3 text-left transition-opacity hover:opacity-90',
            )}
          >
            <Loader2
              className={cn('size-5 shrink-0 animate-spin text-era-accent')}
              aria-hidden
            />
            <div className={cn('min-w-0 flex-1')}>
              <p className={cn('truncate text-sm font-medium text-era-fg')}>
                {GEN_TYPE_LABELS[singleTask.type]} · {singleTask.model}
              </p>
              <div className={cn('mt-2')}>
                <ProgressBar
                  value={singleTask.status === 'running' ? singleTask.progress : 0}
                  size="sm"
                />
              </div>
            </div>
          </button>
        )}

        {!isSingle && collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className={cn(
              'flex w-full items-center justify-between gap-3 text-left',
            )}
          >
            <span className={cn('text-sm font-medium text-era-fg')}>
              {activeCount} генераций · {formatProgress(averageProgress)}
            </span>
            <ChevronUp className={cn('size-4 text-era-fg-mute')} aria-hidden />
          </button>
        )}

        {!isSingle && !collapsed && (
          <div className={cn('flex flex-col gap-3')}>
            <div className={cn('flex items-start justify-between gap-2')}>
              <button
                type="button"
                onClick={openQueue}
                className={cn('min-w-0 flex-1 text-left hover:opacity-90')}
              >
                <p className={cn('text-sm font-medium text-era-fg')}>
                  Генерации идут · {activeCount} активны ·{' '}
                  {formatProgress(averageProgress)}
                </p>
              </button>
              <IconButton
                size="sm"
                label="Свернуть"
                onClick={() => setCollapsed(true)}
              >
                <ChevronDown className={cn('size-4')} />
              </IconButton>
            </div>

            <ul className={cn('space-y-2')}>
              {previewTasks.map((task) => (
                <li key={task.id}>
                  <div className={cn('flex items-center justify-between gap-2')}>
                    <span
                      className={cn(
                        'truncate text-xs text-era-fg-dim',
                      )}
                    >
                      {GEN_TYPE_LABELS[task.type]} · {task.model}
                    </span>
                    <span className={cn('shrink-0 font-mono text-xs text-era-fg-mute')}>
                      {task.status === 'running'
                        ? formatProgress(task.progress)
                        : 'В очереди'}
                    </span>
                  </div>
                  {task.status === 'running' && (
                    <div className={cn('mt-1.5')}>
                      <ProgressBar value={task.progress} size="sm" showLabel={false} />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={openQueue}
              className={cn(
                'text-left text-sm font-medium text-era-accent transition-colors',
                'hover:text-era-accent-2',
              )}
            >
              Открыть очередь →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
