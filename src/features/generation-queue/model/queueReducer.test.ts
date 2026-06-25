import { describe, expect, it } from 'vitest';
import type { GenerationTask } from '@/entities/generation-task';
import {
  canCancelTask,
  canRetryTask,
  canTransition,
  initialQueueState,
  queueActions,
  queueReducer,
  recalculateQueuePositions,
} from './queueReducer';

function createTask(overrides: Partial<GenerationTask> = {}): GenerationTask {
  return {
    id: 'task-1',
    type: 'text',
    prompt: 'test prompt',
    model: 'gpt-test',
    status: 'queued',
    progress: 0,
    credits: 10,
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  };
}

describe('canTransition', () => {
  it('allows valid FSM transitions', () => {
    expect(canTransition('queued', 'running')).toBe(true);
    expect(canTransition('queued', 'canceled')).toBe(true);
    expect(canTransition('running', 'done')).toBe(true);
    expect(canTransition('running', 'failed')).toBe(true);
    expect(canTransition('running', 'canceled')).toBe(true);
  });

  it('rejects invalid transitions', () => {
    expect(canTransition('done', 'running')).toBe(false);
    expect(canTransition('failed', 'queued')).toBe(false);
    expect(canTransition('canceled', 'running')).toBe(false);
    expect(canTransition('queued', 'done')).toBe(false);
  });
});

describe('canCancelTask / canRetryTask', () => {
  it('identifies cancellable and retriable tasks', () => {
    expect(canCancelTask(createTask({ status: 'queued' }))).toBe(true);
    expect(canCancelTask(createTask({ status: 'running' }))).toBe(true);
    expect(canCancelTask(createTask({ status: 'done' }))).toBe(false);

    expect(canRetryTask(createTask({ status: 'failed' }))).toBe(true);
    expect(canRetryTask(createTask({ status: 'canceled' }))).toBe(true);
    expect(canRetryTask(createTask({ status: 'done' }))).toBe(false);
  });
});

describe('recalculateQueuePositions', () => {
  it('assigns FIFO positions to queued tasks only', () => {
    const tasks = [
      createTask({ id: 'b', createdAt: 2000, queuePosition: 99 }),
      createTask({ id: 'a', createdAt: 1000 }),
      createTask({ id: 'c', status: 'running', progress: 50, queuePosition: 1 }),
      createTask({ id: 'd', status: 'done', progress: 100, queuePosition: 2 }),
    ];

    const next = recalculateQueuePositions(tasks);

    expect(next.find((t) => t.id === 'a')?.queuePosition).toBe(1);
    expect(next.find((t) => t.id === 'b')?.queuePosition).toBe(2);
    expect(next.find((t) => t.id === 'c')?.queuePosition).toBeUndefined();
    expect(next.find((t) => t.id === 'd')?.queuePosition).toBeUndefined();
  });
});

describe('queueReducer', () => {
  const NOW = 5000;

  it('initializes tasks with queue positions', () => {
    const tasks = [
      createTask({ id: 'a', createdAt: 100 }),
      createTask({ id: 'b', createdAt: 200 }),
    ];

    const state = queueReducer(
      initialQueueState,
      queueActions.init(tasks),
    );

    expect(state.tasks).toHaveLength(2);
    expect(state.tasks.find((t) => t.id === 'a')?.queuePosition).toBe(1);
    expect(state.tasks.find((t) => t.id === 'b')?.queuePosition).toBe(2);
  });

  it('starts a queued task', () => {
    const state = queueReducer(
      { tasks: [createTask()] },
      queueActions.start('task-1', NOW),
    );

    const task = state.tasks[0];
    expect(task?.status).toBe('running');
    expect(task?.startedAt).toBe(NOW);
    expect(task?.progress).toBe(0);
    expect(task?.queuePosition).toBeUndefined();
  });

  it('ignores invalid start transition', () => {
    const doneTask = createTask({ status: 'done', progress: 100 });
    const state = queueReducer(
      { tasks: [doneTask] },
      queueActions.start('task-1', NOW),
    );

    expect(state.tasks[0]?.status).toBe('done');
  });

  it('updates progress for running tasks only', () => {
    const running = createTask({ status: 'running', progress: 10, startedAt: 1000 });
    const state = queueReducer(
      { tasks: [running] },
      queueActions.updateProgress('task-1', 42.7, 30, NOW),
    );

    expect(state.tasks[0]?.progress).toBe(43);
    expect(state.tasks[0]?.etaSeconds).toBe(30);
    expect(state.tasks[0]?.updatedAt).toBe(NOW);
  });

  it('completes a running task', () => {
    const running = createTask({
      status: 'running',
      progress: 80,
      startedAt: NOW - 10_000,
    });

    const state = queueReducer(
      { tasks: [running] },
      queueActions.complete('task-1', NOW),
    );

    const task = state.tasks[0];
    expect(task?.status).toBe('done');
    expect(task?.progress).toBe(100);
    expect(task?.finishedAt).toBe(NOW);
    expect(task?.durationSeconds).toBe(10);
  });

  it('fails a running task with error message', () => {
    const running = createTask({ status: 'running', progress: 40, startedAt: 1000 });
    const state = queueReducer(
      { tasks: [running] },
      queueActions.fail('task-1', 'Timeout', NOW),
    );

    expect(state.tasks[0]?.status).toBe('failed');
    expect(state.tasks[0]?.error).toBe('Timeout');
    expect(state.tasks[0]?.finishedAt).toBe(NOW);
  });

  it('cancels queued and running tasks', () => {
    const queued = createTask({ id: 'q', queuePosition: 1 });
    const running = createTask({
      id: 'r',
      status: 'running',
      progress: 20,
      startedAt: 1000,
    });

    const afterQueued = queueReducer(
      { tasks: [queued, running] },
      queueActions.cancel('q', NOW),
    );
    expect(afterQueued.tasks.find((t) => t.id === 'q')?.status).toBe('canceled');

    const afterRunning = queueReducer(
      afterQueued,
      queueActions.cancel('r', NOW),
    );
    expect(afterRunning.tasks.find((t) => t.id === 'r')?.status).toBe('canceled');
  });

  it('retries failed task back to queued with reset progress', () => {
    const failed = createTask({
      status: 'failed',
      progress: 55,
      error: 'Error',
      finishedAt: 4000,
    });

    const state = queueReducer(
      { tasks: [failed] },
      queueActions.retry('task-1', NOW),
    );

    const task = state.tasks[0];
    expect(task?.status).toBe('queued');
    expect(task?.progress).toBe(0);
    expect(task?.error).toBeUndefined();
    expect(task?.queuePosition).toBe(1);
  });

  it('deletes a task and recalculates queue positions', () => {
    const tasks = [
      createTask({ id: 'a', createdAt: 100 }),
      createTask({ id: 'b', createdAt: 200 }),
      createTask({ id: 'c', createdAt: 300 }),
    ];

    const state = queueReducer(
      { tasks },
      queueActions.delete('b'),
    );

    expect(state.tasks.map((t) => t.id)).toEqual(['a', 'c']);
    expect(state.tasks.find((t) => t.id === 'a')?.queuePosition).toBe(1);
    expect(state.tasks.find((t) => t.id === 'c')?.queuePosition).toBe(2);
  });

  it('clears done tasks only', () => {
    const tasks = [
      createTask({ id: 'done', status: 'done', progress: 100 }),
      createTask({ id: 'run', status: 'running', progress: 10, startedAt: 100 }),
      createTask({ id: 'queued', createdAt: 300 }),
    ];

    const state = queueReducer({ tasks }, queueActions.clearDone());

    expect(state.tasks.map((t) => t.id)).toEqual(['run', 'queued']);
    expect(state.tasks.find((t) => t.id === 'queued')?.queuePosition).toBe(1);
  });
});
