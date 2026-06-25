import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GenerationTask } from '@/entities/generation-task';
import { queueActions, queueReducer, type QueueState } from './queueReducer';
import { createQueueEngine, MAX_CONCURRENT } from './queueEngine';

function createTask(
  id: string,
  createdAt: number,
  overrides: Partial<GenerationTask> = {},
): GenerationTask {
  return {
    id,
    type: 'text',
    prompt: `prompt ${id}`,
    model: 'gpt-test',
    status: 'queued',
    progress: 0,
    credits: 10,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

describe('createQueueEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function createHarness(initialTasks: GenerationTask[]) {
    let state: QueueState = { tasks: initialTasks };

    const dispatch = (action: Parameters<typeof queueReducer>[1]) => {
      state = queueReducer(state, action);
    };

    const engine = createQueueEngine({
      dispatch,
      getTasks: () => state.tasks,
    });

    return { engine, getState: () => state, dispatch };
  }

  it(`starts at most ${MAX_CONCURRENT} tasks concurrently (FIFO)`, () => {
    const tasks = [
      createTask('1', 100),
      createTask('2', 200),
      createTask('3', 300),
      createTask('4', 400),
    ];

    const { engine, getState } = createHarness(tasks);
    engine.start();

    vi.advanceTimersByTime(500);

    const running = getState().tasks.filter((task) => task.status === 'running');
    expect(running).toHaveLength(MAX_CONCURRENT);
    expect(running.map((task) => task.id)).toEqual(['1', '2']);

    const queued = getState().tasks.filter((task) => task.status === 'queued');
    expect(queued).toHaveLength(2);

    engine.stop();
  });

  it('promotes next queued task when a slot frees up', () => {
    const tasks = [
      createTask('1', 100),
      createTask('2', 200),
      createTask('3', 300),
    ];

    const { engine, getState, dispatch } = createHarness(tasks);
    engine.start();
    vi.advanceTimersByTime(500);

    expect(getState().tasks.find((task) => task.id === '3')?.status).toBe(
      'queued',
    );

    engine.clearTaskTimer('1');
    dispatch(queueActions.complete('1', Date.now()));
    vi.advanceTimersByTime(500);

    expect(getState().tasks.find((task) => task.id === '1')?.status).toBe(
      'done',
    );
    expect(getState().tasks.find((task) => task.id === '3')?.status).toBe(
      'running',
    );

    engine.stop();
  });

  it('stops progress updates after cancel clears the timer', () => {
    const tasks = [createTask('1', 100)];

    const { engine, getState, dispatch } = createHarness(tasks);
    engine.start();
    vi.advanceTimersByTime(500);

    const running = getState().tasks[0];
    expect(running?.status).toBe('running');

    const progressBeforeCancel = running?.progress ?? 0;
    engine.clearTaskTimer('1');
    dispatch(queueActions.cancel('1'));

    vi.advanceTimersByTime(10_000);

    const canceled = getState().tasks[0];
    expect(canceled?.status).toBe('canceled');
    expect(canceled?.progress).toBe(progressBeforeCancel);

    engine.stop();
  });

  it('does not start engine twice', () => {
    const { engine, getState } = createHarness([createTask('1', 100)]);

    engine.start();
    engine.start();
    vi.advanceTimersByTime(500);

    expect(getState().tasks.filter((t) => t.status === 'running')).toHaveLength(1);

    engine.stop();
  });
});
