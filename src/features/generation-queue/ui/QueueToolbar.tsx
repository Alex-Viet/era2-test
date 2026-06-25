import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/shared/lib";
import { Chip } from "@/shared/ui";
import type {
  QueueSortOrder,
  QueueStatusFilter,
  QueueTypeFilter,
} from "../model/selectors";
import {
  QUEUE_SORT_OPTIONS,
  QUEUE_STATUS_FILTERS,
  QUEUE_TYPE_FILTERS,
} from "../model/selectors";

export interface QueueToolbarProps {
  statusFilter: QueueStatusFilter;
  sortOrder: QueueSortOrder;
  searchInput: string;
  typeFilter?: QueueTypeFilter;
  showTypeFilter?: boolean;
  onStatusFilterChange: (filter: QueueStatusFilter) => void;
  onSortOrderChange: (order: QueueSortOrder) => void;
  onSearchInputChange: (query: string) => void;
  onTypeFilterChange?: (filter: QueueTypeFilter) => void;
}

export function QueueToolbar({
  statusFilter,
  sortOrder,
  searchInput,
  typeFilter = "all",
  showTypeFilter = true,
  onStatusFilterChange,
  onSortOrderChange,
  onSearchInputChange,
  onTypeFilterChange,
}: QueueToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3")}>
      <div
        className={cn(
          "flex gap-8 lg:flex-row lg:items-center",
          "overflow-x-auto",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        <div
          role="group"
          aria-label="Фильтр по статусу"
          className={cn(
            "flex gap-2 pb-1",
            "max-[480px]:-mx-1 max-[480px]:px-1",
          )}
        >
          {QUEUE_STATUS_FILTERS.map((chip) => (
            <Chip
              key={chip.value}
              selected={statusFilter === chip.value}
              aria-label={chip.label}
              onClick={() => onStatusFilterChange(chip.value)}
            >
              {chip.label}
            </Chip>
          ))}
        </div>

        <div className={cn("shrink-0")}>
          <label className={cn("sr-only")} htmlFor="queue-sort">
            Сортировка
          </label>
          <div className={cn("relative inline-flex")}>
            <select
              id="queue-sort"
              value={sortOrder}
              onChange={(event) =>
                onSortOrderChange(event.target.value as QueueSortOrder)
              }
              className={cn(
                "h-[34px] appearance-none rounded-full border border-era-line bg-era-secondary",
                "pl-3.5 pr-8 text-[13px] text-era-fg-dim outline-none transition-colors",
                "focus:border-era-accent",
              )}
            >
              {QUEUE_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className={cn(
                "pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2",
                "text-era-fg-mute",
              )}
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center")}>
        <div className={cn("relative min-w-0 flex-1")}>
          <Search
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2",
              "text-era-fg-mute",
            )}
            aria-hidden
          />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="Поиск по промпту…"
            aria-label="Поиск по промпту"
            className={cn(
              "h-10 w-full rounded-lg border border-era-line bg-era-card",
              "py-2 pl-9 pr-3 text-sm outline-none transition-colors",
              "focus:border-era-accent",
            )}
          />
        </div>
      </div>

      {showTypeFilter && onTypeFilterChange && (
        <div
          role="group"
          aria-label="Фильтр по типу генерации"
          className={cn(
            "flex gap-2 overflow-x-auto pb-1",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {QUEUE_TYPE_FILTERS.map((chip) => (
            <Chip
              key={chip.value}
              selected={typeFilter === chip.value}
              aria-label={chip.label}
              onClick={() => onTypeFilterChange(chip.value)}
            >
              {chip.label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
