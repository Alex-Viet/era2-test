import type { GenerationTask } from './types';

const MINUTE = 60_000;

/** Базовое время «сейчас» для воспроизводимого сида. */
const BASE_NOW = Date.parse('2026-06-24T12:00:00.000Z');

function minutesAgo(minutes: number): number {
  return BASE_NOW - minutes * MINUTE;
}

/**
 * Стартовый набор из 10 задач в разных статусах.
 * При загрузке экран выглядит «живым»: 2 running, 4 queued, 2 done, 1 failed, 1 canceled.
 */
export const SEED_TASKS: readonly GenerationTask[] = [
  {
    id: 'task-001',
    type: 'text',
    prompt:
      'Напиши продающий текст для лендинга ERA2 — агрегатора нейросетей с единой подпиской на 90+ моделей',
    model: 'GPT-4o',
    status: 'running',
    progress: 68,
    credits: 12,
    etaSeconds: 18,
    createdAt: minutesAgo(12),
    updatedAt: minutesAgo(2),
    startedAt: minutesAgo(4),
  },
  {
    id: 'task-002',
    type: 'image',
    prompt:
      'Фотореалистичный портрет киберпанк-хакера в неоновом освещении, тёмный фон, детальная проработка лица',
    model: 'DALL·E 3',
    status: 'running',
    progress: 34,
    credits: 24,
    etaSeconds: 42,
    createdAt: minutesAgo(10),
    updatedAt: minutesAgo(1),
    startedAt: minutesAgo(3),
  },
  {
    id: 'task-003',
    type: 'video',
    prompt:
      'Короткий рекламный ролик 15 сек: камера пролетает над футуристическим городом на рассвете, кинематографичный стиль',
    model: 'Sora',
    status: 'queued',
    progress: 0,
    credits: 80,
    etaSeconds: 240,
    queuePosition: 1,
    createdAt: minutesAgo(9),
    updatedAt: minutesAgo(9),
  },
  {
    id: 'task-004',
    type: 'audio',
    prompt:
      'Озвучить приветственное сообщение для голосового ассистента: дружелюбный мужской голос, русский язык',
    model: 'ElevenLabs v2',
    status: 'queued',
    progress: 0,
    credits: 16,
    etaSeconds: 90,
    queuePosition: 2,
    createdAt: minutesAgo(8),
    updatedAt: minutesAgo(8),
  },
  {
    id: 'task-005',
    type: 'text',
    prompt: 'Сгенерируй 10 вариантов слоганов для сервиса генерации изображений',
    model: 'Claude 3.5 Sonnet',
    status: 'queued',
    progress: 0,
    credits: 8,
    etaSeconds: 30,
    queuePosition: 3,
    createdAt: minutesAgo(7),
    updatedAt: minutesAgo(7),
  },
  {
    id: 'task-006',
    type: 'image',
    prompt: 'Минималистичная иконка приложения: буква E, оранжевый акцент #E85420 на тёмном фоне',
    model: 'Midjourney v6',
    status: 'queued',
    progress: 0,
    credits: 20,
    etaSeconds: 55,
    queuePosition: 4,
    createdAt: minutesAgo(6),
    updatedAt: minutesAgo(6),
  },
  {
    id: 'task-007',
    type: 'text',
    prompt: 'Переведи техническую документацию API с английского на русский, сохрани терминологию',
    model: 'GPT-4o mini',
    status: 'done',
    progress: 100,
    credits: 6,
    durationSeconds: 22,
    createdAt: minutesAgo(45),
    updatedAt: minutesAgo(40),
    startedAt: minutesAgo(42),
    finishedAt: minutesAgo(40),
  },
  {
    id: 'task-008',
    type: 'image',
    prompt: 'Иллюстрация для блога: робот и человек работают вместе за одним столом, flat design',
    model: 'Stable Diffusion XL',
    status: 'done',
    progress: 100,
    credits: 18,
    durationSeconds: 38,
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(55),
    startedAt: minutesAgo(58),
    finishedAt: minutesAgo(55),
  },
  {
    id: 'task-009',
    type: 'video',
    prompt: 'Анимация логотипа ERA2: плавное появление букв с эффектом свечения',
    model: 'Runway Gen-3',
    status: 'failed',
    progress: 47,
    error: 'Превышено время ожидания',
    credits: 65,
    createdAt: minutesAgo(30),
    updatedAt: minutesAgo(25),
    startedAt: minutesAgo(28),
    finishedAt: minutesAgo(25),
  },
  {
    id: 'task-010',
    type: 'audio',
    prompt: 'Создай фоновую ambient-мелодию для медитации, 3 минуты, без резких переходов',
    model: 'Suno v4',
    status: 'canceled',
    progress: 12,
    credits: 30,
    createdAt: minutesAgo(20),
    updatedAt: minutesAgo(18),
    startedAt: minutesAgo(19),
    finishedAt: minutesAgo(18),
  },
];

/** Возвращает копию сида — безопасно для мутаций в сторе. */
export function createSeedTasks(): GenerationTask[] {
  return SEED_TASKS.map((task) => ({ ...task }));
}
