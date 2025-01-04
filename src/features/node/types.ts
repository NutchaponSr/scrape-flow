import { Node } from "@xyflow/react";
import { TaskParam, TaskParamType, TaskType } from "@/features/tasks/types";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  disabled: boolean;
  updateNodeParamValue: (newValue: string) => void;
}

export const ColorForHandle: Record<TaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-sky-400",
  STRING: "!bg-yellow-400",
}