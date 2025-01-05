import "server-only";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/features/workflows/types";

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

  const environment = {
    phase: {
      launchBrowser: {
        inputs: {
          websiteUrl: "www.google.com",
        },
        outputs: {
          browser: "PuppetterInstance",
        },
      },
    },
  };

  // Initial workflow execution
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
      id: execution.workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    }
  });

  // Initial phases status
  await db.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id)
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });

  const creditConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: Execute phase
  }

  // Finalize execution
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED
  
  await db.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completeAt: new Date(),
      creditConsumed,
    },
  });

  await db.workflow.update({
    where:  {
      id: execution.workflowId,
      lastRunId: executionId,
    },
    data: {
      lastRunStatus: finalStatus,
    },
  }).catch((error) => {
    // Ingore
    // This means that we have triggered other runs for this workflow
    // While an execution was running
  });

  // TODO: Clean up environment

  revalidatePath("/workflows/runs");
}