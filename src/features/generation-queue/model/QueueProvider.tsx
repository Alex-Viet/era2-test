import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createSeedTasks } from '@/entities/generation-task';
import { QueueContext, type QueueInitStatus } from './queueContext';
import { createQueueEngine } from './queueEngine';
import {
  initialQueueState,
  queueActions,
  queueReducer,
} from './queueReducer';

const INIT_DELAY_MS = 600;

interface QueueProviderProps {
  children: ReactNode;
  /** Эмулирует сбой инициализации (для ErrorState на этапе UI). */
  simulateInitError?: boolean;
}

export function QueueProvider({
  children,
  simulateInitError = false,
}: QueueProviderProps) {
  const [state, dispatch] = useReducer(queueReducer, initialQueueState);
  const [initStatus, setInitStatus] = useState<QueueInitStatus>('loading');

  const stateRef = useRef(state);
  stateRef.current = state;

  const engineRef = useRef<ReturnType<typeof createQueueEngine> | null>(null);
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadSeed = useCallback((withError: boolean) => {
    if (initTimeoutRef.current !== null) {
      clearTimeout(initTimeoutRef.current);
    }

    setInitStatus('loading');

    initTimeoutRef.current = setTimeout(() => {
      if (withError) {
        setInitStatus('error');
        return;
      }

      dispatch(queueActions.init(createSeedTasks()));
      setInitStatus('ready');
    }, INIT_DELAY_MS);
  }, []);

  useEffect(() => {
    loadSeed(simulateInitError);

    return () => {
      if (initTimeoutRef.current !== null) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [loadSeed, simulateInitError]);

  useEffect(() => {
    const engine = createQueueEngine({
      dispatch,
      getTasks: () => stateRef.current.tasks,
    });

    engine.start();
    engineRef.current = engine;

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  const cancelTask = useCallback((taskId: string) => {
    engineRef.current?.clearTaskTimer(taskId);
    dispatch(queueActions.cancel(taskId));
  }, []);

  const retryTask = useCallback((taskId: string) => {
    dispatch(queueActions.retry(taskId));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    engineRef.current?.clearTaskTimer(taskId);
    dispatch(queueActions.delete(taskId));
  }, []);

  const clearDone = useCallback(() => {
    dispatch(queueActions.clearDone());
  }, []);

  const reload = useCallback(() => {
    for (const task of stateRef.current.tasks) {
      if (task.status === 'running') {
        engineRef.current?.clearTaskTimer(task.id);
      }
    }

    dispatch(queueActions.init([]));
    loadSeed(false);
  }, [loadSeed]);

  const value = useMemo(
    () => ({
      state,
      initStatus,
      cancelTask,
      retryTask,
      deleteTask,
      clearDone,
      reload,
    }),
    [
      state,
      initStatus,
      cancelTask,
      retryTask,
      deleteTask,
      clearDone,
      reload,
    ],
  );

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}
