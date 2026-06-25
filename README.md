# ERA2 — Очередь генераций

Экран «Очередь генераций» для агрегатора нейросетей ERA2. Бэкенд отсутствует — все данные и асинхронность эмулируются на клиенте.

## Стек

- **React 19** + **TypeScript** (strict)
- **Vite** — сборщик
- **Tailwind CSS v4** — стили
- **React Router** — маршрутизация
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

## Этапы разработки

1. ✅ **Этап 0** — scaffold проекта (Vite, FSD, роутинг, токены)
2. ✅ **Этап 1** — entities: типы и seed-данные
3. ✅ **Этап 2** — queueReducer (конечный автомат)
4. ✅ **Этап 3** — queueEngine (мок-движок) + QueueProvider + useQueue
5. ✅ **Этап 4** — селекторы + localStorage persistence
6. ⬜ Этап 5–11 — UI, виджет, статус-бар, адаптив

Подробное ТЗ — в файле `тз.md`.
