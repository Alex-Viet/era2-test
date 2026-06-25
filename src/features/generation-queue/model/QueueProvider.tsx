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
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import {
  clearPersistedTasks,
  loadPersistedTasks,
  savePersistedTasks,
} from '../lib/queueStorage';
import { QueueContext, type QueueInitStatus } from './queueContext';
import { createQueueEngine } from './queueEngine';
import {
  initialQueueState,
  queueActions,
  queueReducer,
} from './queueReducer';
import {
  selectQueueStats,
  selectVisibleTasks,
  type QueueSortOrder,
  type QueueStatusFilter,
  type QueueTypeFilter,
} from './selectors';

const INIT_DELAY_MS = 600;
const SEARCH_DEBOUNCE_MS = 300;
const PERSIST_DEBOUNCE_MS = 500;

interface QueueProviderProps {
  children: ReactNode;
  /** Эмулирует сбой инициализации (для ErrorState на этапе UI). */
  simulateInitError?: boolean;
}

/** Резолвит задачи из localStorage или создаёт сид-задачи. */
function resolveInitialTasks() {
  return loadPersistedTasks() ?? createSeedTasks();
}

export function QueueProvider({
  children,
  simulateInitError = false,
}: QueueProviderProps) {
  const [state, dispatch] = useReducer(queueReducer, initialQueueState);
  const [initStatus, setInitStatus] = useState<QueueInitStatus>('loading');
  const [statusFilter, setStatusFilter] = useState<QueueStatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<QueueSortOrder>('newest');
  const [typeFilter, setTypeFilter] = useState<QueueTypeFilter>('all');
  const [searchInput, setSearchInput] = useState('');

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  const stateRef = useRef(state);
  stateRef.current = state;

  const engineRef = useRef<ReturnType<typeof createQueueEngine> | null>(null);
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadQueue = useCallback((withError: boolean, useSeedOnly = false) => {
    if (initTimeoutRef.current !== null) {
      clearTimeout(initTimeoutRef.current);
    }

    setInitStatus('loading');

    initTimeoutRef.current = setTimeout(() => {
      if (withError) {
        setInitStatus('error');
        return;
      }

      const tasks = useSeedOnly ? createSeedTasks() : resolveInitialTasks();
      dispatch(queueActions.init(tasks));
      setInitStatus('ready');
    }, INIT_DELAY_MS);
  }, []);

  useEffect(() => {
    loadQueue(simulateInitError);

    return () => {
      if (initTimeoutRef.current !== null) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [loadQueue, simulateInitError]);

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

  useEffect(() => {
    if (initStatus !== 'ready') {
      return;
    }

    const timeoutId = setTimeout(() => {
      savePersistedTasks(state.tasks);
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state.tasks, initStatus]);

  const viewParams = useMemo(
    () => ({
      statusFilter,
      sortOrder,
      searchQuery: debouncedSearch,
      typeFilter,
    }),
    [statusFilter, sortOrder, debouncedSearch, typeFilter],
  );

  const stats = useMemo(
    () => selectQueueStats(state.tasks),
    [state.tasks],
  );

  const visibleTasks = useMemo(
    () => selectVisibleTasks(state.tasks, viewParams),
    [state.tasks, viewParams],
  );

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

    clearPersistedTasks();
    dispatch(queueActions.init([]));
    loadQueue(false, true);
  }, [loadQueue]);

  const value = useMemo(
    () => ({
      state,
      initStatus,
      stats,
      visibleTasks,
      statusFilter,
      sortOrder,
      typeFilter,
      searchInput,
      setStatusFilter,
      setSortOrder,
      setTypeFilter,
      setSearchInput,
      cancelTask,
      retryTask,
      deleteTask,
      clearDone,
      reload,
    }),
    [
      state,
      initStatus,
      stats,
      visibleTasks,
      statusFilter,
      sortOrder,
      typeFilter,
      searchInput,
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
