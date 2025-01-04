import { LucideProps } from "lucide-react";

import { AppNode } from "@/features/node/types";
import { TaskParam, TaskType } from "@/features/tasks/types";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
}

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
}

export type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];