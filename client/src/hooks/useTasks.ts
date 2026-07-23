"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Task, TaskStatus } from "@/types/task";

export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
}

const tasksKey = (status?: TaskStatus | "all") => ["tasks", status ?? "all"];

export function useTasks(status: TaskStatus | "all") {
  return useQuery({
    queryKey: tasksKey(status),
    queryFn: async () => {
      const res = await api.get<Task[]>("/tasks", {
        params: status === "all" ? {} : { status },
      });
      return res.data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TaskInput) => {
      const res = await api.post<Task>("/tasks", input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<TaskInput> & { id: number }) => {
      const res = await api.put<Task>(`/tasks/${id}`, input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
