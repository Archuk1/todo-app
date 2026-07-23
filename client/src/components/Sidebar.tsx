"use client";

import type { Task } from "@/types/task";
import type { StatusFilterValue } from "./StatusFilter";

const NAV_ITEMS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "todo", label: "To do" },
  { value: "in progress", label: "In progress" },
  { value: "done", label: "Done" },
];

interface SidebarProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
  tasks: Task[];
}

export function Sidebar({ value, onChange, tasks }: SidebarProps) {
  function countFor(status: StatusFilterValue) {
    if (status === "all") return tasks.length;
    return tasks.filter((task) => task.status === status).length;
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 sm:w-52">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Filter
      </p>
      {NAV_ITEMS.map((item) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              isActive
                ? "bg-zinc-900 text-white"
                : "text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`text-xs ${isActive ? "text-zinc-300" : "text-zinc-400"}`}
            >
              {countFor(item.value)}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
