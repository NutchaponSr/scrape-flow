import "server-only";

import { revalidatePath } from "next/cache";
import { ExecutionPhase } from "@prisma/client";

import { db } from "@/lib/db";

import { 
  ExecutionPhaseStatus, 
  WorkflowExecutionStatus 
} from "@/features/workflows/types";
import { AppNode } from "@/features/node/types";
import { TaskRegistry } from "@/features/tasks/registry";
import { ExecutorRegistry } from "@/features/executor/registry";

export async function ExecutionWorkflow(executionId: string) {
  const execution = await db.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Execution");
  }

  const environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatuses(execution);
  

  const creditConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: Consume credits
    const phaseExecution = await executeWorkflowPhase(phase);

    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  // Finalize execution
  finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditConsumed);

  // TODO: Clean up environment

  revalidatePath("/workflows/runs");
}
async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
) {
  await db.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await db.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function initializePhaseStatuses(execution: any) {
  await db.executionPhase.updateMany({
    where: {
      id: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        in: execution.phases.map((phase: any) => phase.id)
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditConsumed: number,
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED
  
  await db.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditConsumed,
    },
  });

  await db.workflow.update({
    where: {
      id: workflowId,
      lastRunId: executionId,
    },
    data: {
      lastRunStatus: finalStatus,
    },
  }).catch((error) => {
    console.log("🔴 Error", error);
  });
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  // Update phase status
  await db.executionPhase.update({
    where: {
      id: phase.id
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  console.log("🪙 CREDITS", creditsRequired);

  // TODO: Decrement user balance (with required credits)

  const success = await executePhase(phase, node);

  await finalizePhase(phase.id, success);
  
  return { success };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await db.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    }
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];

  if (!runFn) return false;

  return await runFn();
}