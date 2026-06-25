# ERA2 — Очередь генераций

Экран «Очередь генераций» для агрегатора нейросетей ERA2. Бэкенд отсутствует — все данные и асинхронность эмулируются на клиенте.

## Стек

- **React 19** + **TypeScript** (strict)
- **Vite** — сборщик
- **Tailwind CSS v4** — стили
- **React Router** — маршрутизация
- **@tanstack/react-virtual** — виртуализация длинных списков (≥15 задач)
- **Vitest** — юнит-тесты редьюсера и движка
- **lucide-react** — иконки
- **Feature-Sliced Design (FSD)** — архитектура

## Шрифты

- Основной: **Geist Sans** (`@fontsource/geist-sans`)
- Моноширинный: **Geist Mono** (`@fontsource/geist-mono`)
- Fallback: **Inter** / system-ui (если Geist недоступен)

## Роутинг

| Путь     | Страница    | Описание                                    |
| -------- | ----------- | ------------------------------------------- |
| `/`      | `HomePage`  | Заглушка главной (фон для демо статус-бара) |
| `/queue` | `QueuePage` | Экран «Очередь генераций»                   |

Решение: **react-router-dom** с layout-обёрткой в `app/layouts/AppLayout.tsx`.

## Глобальный статус-бар

- Компонент `GenerationStatusBar` в `features/generation-queue`, монтируется в `AppLayout`
- Читает тот же `QueueProvider` / `useQueue`, что и страница очереди
- Скрыт, если нет активных задач (`queued` + `running`) или открыта страница `/queue`
- **1 задача** — компактная карточка; **несколько** — раскрытый виджет со сворачиванием в пилюлю
- Клик / «Открыть очередь →» — `navigate('/queue')`
- Desktop/tablet: fixed снизу-справа (~24px); mobile: полноширинная панель с `safe-area`

## Персистентность (localStorage)

- Ключ: `era2:generation-queue:v1`
- Состояние очереди сохраняется при каждом изменении
- Первый запуск — сид; перезагрузка — данные из `localStorage`
- **`running` при restore → `queued`**, прогресс сбрасывается (таймеры не переживают reload)
- `reload()` сбрасывает storage и загружает свежий сид

## Структура FSD

```
src/
├── app/          # инициализация, роутинг, глобальные стили
├── pages/        # тонкие страницы-композиции
├── widgets/      # композитные блоки (экран очереди)
├── features/     # бизнес-логика очереди (редьюсер, движок)
├── entities/     # сущность generation-task
└── shared/       # ui-kit, lib (cn), хуки
```

Публичный API каждого слайса — только через `index.ts`. Импорты: `@/features/generation-queue`, без deep-import.

## Адаптив и полировка

| Брейкпоинт | Поведение |
| ---------- | --------- |
| **≤480px** (mobile) | Карточки задач, статистика 2×2, горизонтальный скролл чипов, статус-бар на всю ширину снизу |
| **481–1023px** (tablet) | Карточки задач, плавающий статус-бар справа снизу |
| **≥1024px** (desktop) | Строки списка (`TaskRow`), статистика 4 колонки, контент `max-w-6xl` по центру |

### Анимации

- Плавный рост прогресс-бара (`transition-[width]`, 300ms)
- Появление строк очереди (`animate-queue-item-in`, stagger до 8 элементов)
- Статус-бар: enter/exit через `useDelayedVisibility` + opacity/translate
- Hover на строках и карточках задач
- `prefers-reduced-motion`: анимации и transitions отключаются глобально

### Доступность

- `:focus-visible` — акцентное кольцо фокуса
- `aria-live`, `role="region"` на статус-баре
- Чипы фильтров: `aria-pressed`, группы с `role="group"`
- Список задач: `role="list"` / `listitem`, `aria-label` на строках
- Меню «…»: `aria-expanded`, focus trap, закрытие по `Escape` с возвратом фокуса
- Скелетоны загрузки с `aria-busy`

### Бонусные возможности

| Функция | Описание |
| ------- | -------- |
| **Юнит-тесты** | `queueReducer.test.ts`, `queueEngine.test.ts` — FSM, слоты, cancel |
| **Undo** | Toast «Отменить» (5 с) после удаления задачи и «Очистить готовые» |
| **Optimistic UI** | Удаление и очистка применяются мгновенно; откат через Undo |
| **Виртуализация** | `@tanstack/react-virtual` при ≥15 видимых задач (`TaskList`) |

### Ключевые решения

- **Restore из localStorage:** `running` → `queued`, прогресс сбрасывается (таймеры не переживают reload)
- **Статус-бар на `/queue`:** скрыт, чтобы не дублировать экран очереди
- **MAX_CONCURRENT:** 2 одновременных `running`-задачи
- **Скачать:** заглушка `console.info` до появления бэкенда

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

## Линтер

```bash
npm run lint
```

## Тесты

```bash
npm test          # один прогон
npm run test:watch  # watch-режим
```

## Этапы разработки

1. ✅ **Этап 0** — scaffold проекта (Vite, FSD, роутинг, токены)
2. ✅ **Этап 1** — entities: типы и seed-данные
3. ✅ **Этап 2** — queueReducer (конечный автомат)
4. ✅ **Этап 3** — queueEngine (мок-движок) + QueueProvider + useQueue
4. ✅ **Этап 4** — Селекторы, фильтры и персистентность
5. ✅ **Этап 5** — UI-примитивы (Button, Chip, StatusBadge, ProgressBar, formatEta)
6. ✅ **Этап 6** — TaskRow, TaskCard, TaskActions
7. ✅ **Этап 7** — QueueStats, QueueToolbar
8. ✅ **Этап 8** — EmptyState, LoadingState, ErrorState
9. ✅ **Этап 9** — виджет GenerationQueue + шапка «Очистить готовые»
10. ✅ **Этап 10** — глобальный статус-бар
11. ✅ **Этап 11** — адаптив и полировка

Подробное ТЗ — в файле `тз.md`.
