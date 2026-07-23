"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/Sidebar";
import type { StatusFilterValue } from "@/components/StatusFilter";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { Modal } from "@/components/Modal";
import { useCreateTask, useTasks } from "@/hooks/useTasks";

const EMPTY_STATE_LABEL: Record<StatusFilterValue, string> = {
  all: "No tasks yet. Create your first one to get started.",
  todo: "Nothing to do right now.",
  "in progress": "Nothing in progress right now.",
  done: "Nothing marked as done yet.",
};

function TasksPageContent() {
  const { user, logout } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: allTasks, isLoading, isError } = useTasks("all");
  const createTask = useCreateTask();

  const visibleTasks = useMemo(() => {
    if (!allTasks) return [];
    if (statusFilter === "all") return allTasks;
    return allTasks.filter((task) => task.status === statusFilter);
  }, [allTasks, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">My tasks</h1>
          {user && <p className="text-sm text-zinc-500">{user.email}</p>}
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Log out
        </button>
      </header>

      <div className="flex flex-col gap-6 sm:flex-row">
        <Sidebar value={statusFilter} onChange={setStatusFilter} tasks={allTasks ?? []} />

        <main className="flex flex-1 flex-col gap-4">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            + Create task
          </button>

          <div className="flex flex-col gap-3">
            {isLoading && <p className="text-sm text-zinc-500">Loading tasks...</p>}
            {isError && (
              <p className="text-sm text-red-600">Failed to load tasks. Please try again.</p>
            )}
            {!isLoading && !isError && visibleTasks.length === 0 && (
              <p className="text-sm text-zinc-500">{EMPTY_STATE_LABEL[statusFilter]}</p>
            )}
            {visibleTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </main>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create task">
        <TaskForm
          isSubmitting={createTask.isPending}
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={async (input) => {
            await createTask.mutateAsync(input);
            setIsCreateOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksPageContent />
    </ProtectedRoute>
  );
}
