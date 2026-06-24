import { createContext } from 'react';
import type { QueueState } from './queueReducer';

export type QueueInitStatus = 'loading' | 'ready' | 'error';

export interface QueueContextValue {
  state: QueueState;
  initStatus: QueueInitStatus;
  cancelTask: (taskId: string) => void;
  retryTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  clearDone: () => void;
  reload: () => void;
}

export const QueueContext = createContext<QueueContextValue | null>(null);
