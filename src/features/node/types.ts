import { TaskType } from "@/features/tasks/types";

export interface AppNodeData {
  type: TaskType;
  input: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}