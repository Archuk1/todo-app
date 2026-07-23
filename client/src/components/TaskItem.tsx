"use client";

import { useState } from "react";
import type { Task } from "@/types/task";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTasks";
import { TaskForm } from "./TaskForm";
import { Modal } from "./Modal";

const STATUS_STYLES: Record<Task["status"], string> = {
  todo: "bg-zinc-100 text-zinc-700",
  "in progress": "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};

const STATUS_LABELS: Record<Task["status"], string> = {
  todo: "To do",
  "in progress": "In progress",
  done: "Done",
};

export function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  return (
    <>
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit task">
        <TaskForm
          initialTask={task}
          isSubmitting={updateTask.isPending}
          onCancel={() => setIsEditing(false)}
          onSubmit={async (input) => {
            await updateTask.mutateAsync({ id: task.id, ...input });
            setIsEditing(false);
          }}
        />
      </Modal>

      <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-zinc-900">{task.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}
          >
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        {task.description && (
          <p className="whitespace-pre-wrap text-sm text-zinc-600">{task.description}</p>
        )}

        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={deleteTask.isPending}
            onClick={() => deleteTask.mutate(task.id)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
