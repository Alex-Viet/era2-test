import type { Dispatch } from "react";
import type { GenType, GenerationTask } from "@/entities/generation-task";
import {
  QUEUE_FAIL_MESSAGES,
  queueActions,
  type QueueAction,
} from "./queueReducer";

export const MAX_CONCURRENT = 2;

const SLOT_CHECK_MS = 500;
const FAIL_PROBABILITY = 0.15;

const GEN_TYPE_PROFILE: Record<
  GenType,
  { stepMin: number; stepMax: number; tickMin: number; tickMax: number }
> = {
  text: { stepMin: 8, stepMax: 18, tickMin: 400, tickMax: 600 },
  image: { stepMin: 6, stepMax: 14, tickMin: 450, tickMax: 650 },
  video: { stepMin: 2, stepMax: 6, tickMin: 550, tickMax: 750 },
  audio: { stepMin: 3, stepMax: 7, tickMin: 500, tickMax: 700 },
};

interface TaskRuntime {
  intervalId: ReturnType<typeof setInterval>;
  progress: number;
  willFail: boolean;
  failAtProgress?: number;
  avgStep: number;
  tickMs: number;
}

export interface QueueEngineOptions {
  dispatch: Dispatch<QueueAction>;
  getTasks: () => GenerationTask[];
}

export interface QueueEngine {
  start: () => void;
  stop: () => void;
  clearTaskTimer: (taskId: string) => void;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickFailMessage(): string {
  const index = randomBetween(0, QUEUE_FAIL_MESSAGES.length - 1);
  return QUEUE_FAIL_MESSAGES[index] ?? QUEUE_FAIL_MESSAGES[0];
}

function estimateEtaSeconds(
  progress: number,
  avgStep: number,
  tickMs: number,
): number {
  if (progress >= 100 || avgStep <= 0) {
    return 0;
  }

  const ticksLeft = Math.ceil((100 - progress) / avgStep);
  return Math.max(1, Math.round((ticksLeft * tickMs) / 1000));
}

export function createQueueEngine({
  dispatch,
  getTasks,
}: QueueEngineOptions): QueueEngine {
  const runtimes = new Map<string, TaskRuntime>();
  let slotTimer: ReturnType<typeof setInterval> | null = null;
  let started = false;

  function clearTaskTimer(taskId: string): void {
    const runtime = runtimes.get(taskId);
    if (!runtime) {
      return;
    }

    clearInterval(runtime.intervalId);
    runtimes.delete(taskId);
  }

  function clearAllTimers(): void {
    for (const taskId of runtimes.keys()) {
      clearTaskTimer(taskId);
    }

    if (slotTimer !== null) {
      clearInterval(slotTimer);
      slotTimer = null;
    }
  }

  function getQueuedTasks(tasks: GenerationTask[]): GenerationTask[] {
    return tasks
      .filter((task) => task.status === "queued")
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  function fillSlots(): void {
    const tasks = getTasks();
    const runningCount = tasks.filter(
      (task) => task.status === "running",
    ).length;
    const slotsAvailable = MAX_CONCURRENT - runningCount;

    if (slotsAvailable <= 0) {
      return;
    }

    const nextQueued = getQueuedTasks(tasks).slice(0, slotsAvailable);

    for (const task of nextQueued) {
      dispatch(queueActions.start(task.id));
      startTaskTimer(task.id, task.type, 0);
    }
  }

  function syncRunningTimers(): void {
    const tasks = getTasks();
    const runningTasks = tasks.filter((task) => task.status === "running");

    for (const task of runningTasks) {
      if (!runtimes.has(task.id)) {
        startTaskTimer(task.id, task.type, task.progress);
      }
    }

    for (const taskId of runtimes.keys()) {
      const task = tasks.find((item) => item.id === taskId);
      if (!task || task.status !== "running") {
        clearTaskTimer(taskId);
      }
    }
  }

  function tickTask(taskId: string): void {
    const runtime = runtimes.get(taskId);
    if (!runtime) {
      return;
    }

    const task = getTasks().find((item) => item.id === taskId);
    if (!task || task.status !== "running") {
      clearTaskTimer(taskId);
      return;
    }

    if (
      runtime.willFail &&
      runtime.failAtProgress !== undefined &&
      runtime.progress >= runtime.failAtProgress
    ) {
      clearTaskTimer(taskId);
      dispatch(queueActions.fail(taskId, pickFailMessage()));
      fillSlots();
      return;
    }

    runtime.progress = Math.min(
      100,
      runtime.progress +
        randomBetween(
          GEN_TYPE_PROFILE[task.type].stepMin,
          GEN_TYPE_PROFILE[task.type].stepMax,
        ),
    );

    if (runtime.progress >= 100) {
      clearTaskTimer(taskId);
      dispatch(queueActions.complete(taskId));
      fillSlots();
      return;
    }

    dispatch(
      queueActions.updateProgress(
        taskId,
        runtime.progress,
        estimateEtaSeconds(runtime.progress, runtime.avgStep, runtime.tickMs),
      ),
    );
  }

  function startTaskTimer(
    taskId: string,
    type: GenType,
    initialProgress: number,
  ): void {
    if (runtimes.has(taskId)) {
      return;
    }

    const profile = GEN_TYPE_PROFILE[type];
    const tickMs = randomBetween(profile.tickMin, profile.tickMax);
    const avgStep = (profile.stepMin + profile.stepMax) / 2;
    const willFail = Math.random() < FAIL_PROBABILITY;
    const failAtProgress = willFail ? randomBetween(25, 85) : undefined;

    const runtime: TaskRuntime = {
      intervalId: setInterval(() => tickTask(taskId), tickMs),
      progress: initialProgress,
      willFail,
      failAtProgress,
      avgStep,
      tickMs,
    };

    runtimes.set(taskId, runtime);

    if (initialProgress > 0) {
      dispatch(
        queueActions.updateProgress(
          taskId,
          initialProgress,
          estimateEtaSeconds(initialProgress, avgStep, tickMs),
        ),
      );
    }
  }

  function start(): void {
    if (started) {
      return;
    }

    started = true;

    slotTimer = setInterval(() => {
      syncRunningTimers();
      fillSlots();
    }, SLOT_CHECK_MS);

    syncRunningTimers();
    fillSlots();
  }

  function stop(): void {
    started = false;
    clearAllTimers();
  }

  return {
    start,
    stop,
    clearTaskTimer,
  };
}
