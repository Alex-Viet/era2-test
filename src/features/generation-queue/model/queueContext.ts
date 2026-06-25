import { createContext } from 'react';
import type { QueueState } from './queueReducer';
import type {
  QueueSortOrder,
  QueueStats,
  QueueStatusFilter,
  QueueTypeFilter,
} from './selectors';
import type { GenerationTask } from '@/entities/generation-task';

export type QueueInitStatus = 'loading' | 'ready' | 'error';

export interface QueueUndoOffer {
  message: string;
}

export interface QueueContextValue {
  state: QueueState;
  initStatus: QueueInitStatus;
  stats: QueueStats;
  visibleTasks: GenerationTask[];
  statusFilter: QueueStatusFilter;
  sortOrder: QueueSortOrder;
  typeFilter: QueueTypeFilter;
  searchInput: string;
  setStatusFilter: (filter: QueueStatusFilter) => void;
  setSortOrder: (order: QueueSortOrder) => void;
  setTypeFilter: (filter: QueueTypeFilter) => void;
  setSearchInput: (query: string) => void;
  cancelTask: (taskId: string) => void;
  retryTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  clearDone: () => void;
  reload: () => void;
  undoOffer: QueueUndoOffer | null;
  undoLastAction: () => void;
  dismissUndo: () => void;
}

export const QueueContext = createContext<QueueContextValue | null>(null);
