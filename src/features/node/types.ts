import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "@/features/tasks/types";

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
  updateNodeParamValue: (newValue: string) => void;
}