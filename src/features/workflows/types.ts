import { LucideProps } from "lucide-react";
import { ExecutionPhase } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

import { AppNode } from "@/features/node/types";
import { TaskParam, TaskType } from "@/features/tasks/types";

import { GetWorkflowExecutions } from "@/features/workflows/server/get-workflow-executions";
import { GetWorkflowExecutionWithPhases } from "@/features/workflows/server/get-workflow-execution-with-phases";

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

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_INPUT",
}

export type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
}

export type FlowValidationContextType = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
}

export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}

export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>

export type Phase = Pick<ExecutionPhase, "creditsConsumed">;

export type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;