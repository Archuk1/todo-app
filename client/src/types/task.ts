export type TaskStatus = "todo" | "in progress" | "done";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  userId: number;
}

export interface User {
  id: number;
  email: string;
}
