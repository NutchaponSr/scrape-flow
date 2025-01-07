/* eslint-disable @typescript-eslint/no-explicit-any */
"server-only";

import { Edge } from "@xyflow/react";
import { Browser, Page } from "puppeteer";
import { revalidatePath } from "next/cache";
import { ExecutionPhase } from "@prisma/client";

import { db } from "@/lib/db";
import { waitFor } from "@/lib/utils";

import { 
  ExecutionPhaseStatus, 
  WorkflowExecutionStatus 
} from "@/features/workflows/types";
import { 
  Environment, 
  ExecutionEnvironment 
} from "@/features/executor/types";
import { AppNode } from "@/features/node/types";
import { LogCollector } from "@/features/log/types";
import { TaskParamType } from "@/features/tasks/types";
import { TaskRegistry } from "@/features/tasks/registry";
import { createLogCollector } from "@/features/log/utils";
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

  const edges = JSON.parse(execution.workflow.definition).edges as Edge[];

  const env: Environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatuses(execution);
  
  
  let creditConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase, env, edges, execution.userId);

    creditConsumed += phaseExecution.creditsConsumed;

    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditConsumed);

  await cleanUpEnvironment(env);

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
    },
  });
}

async function initializePhaseStatuses(execution: any) {
  await db.executionPhase.updateMany({
    where: {
      id: {
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

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  env: Environment,
  edges: Edge[],
  userId: string,
) {
  const startedAt = new Date();
  const log = createLogCollector();
  const node = JSON.parse(phase.node) as AppNode;

  setUpEnvironmentForPhase(node, env, edges);

  // Update phase status
  await db.executionPhase.update({
    where: {
      id: phase.id
    },
    data: {
      startedAt,
      status: ExecutionPhaseStatus.RUNNING,
      inputs: JSON.stringify(env.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  let success = await decrementCredits(userId, creditsRequired, log);

  const creditsConsumed = success ? creditsRequired : 0;

  if (success) {
    // We can execute the phase if the credits are sufficient
    success = await executePhase(phase, node, env, log);
  }

  const outputs = env.phases[node.id].outputs;

  await finalizePhase(phase.id, success, outputs, log, creditsConsumed);
  
  return { success, creditsConsumed };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: Record<string, string>,
  log: LogCollector,
  creditsConsumed: number,
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await db.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      creditsConsumed,
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      logs: {
        createMany: {
          data: log.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  env: Environment,
  log: LogCollector,
): Promise<boolean> {
  waitFor(2000);

  const runFn = ExecutorRegistry[node.data.type];

  if (!runFn) return false;

  waitFor(3000);
  const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, env, log);

  return await runFn(executionEnvironment);
}

function setUpEnvironmentForPhase(
  node: AppNode,
  env: Environment,
  edges: Edge[]
) {
  env.phases[node.id] = { inputs: {}, outputs: {} };

  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;

    const inputValue = node.data.inputs[input.name];

    if (inputValue) {
      env.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value from output in the environment
    const connectedEdge = edges.find((edge) => edge.target === node.id && edge.targetHandle === input.name);

    if (!connectedEdge) {
      console.log("🔴 Missing edge for input", input.name, "Node Id:", node.id);
      continue;
    }

    const outputValue = env.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];

    env.phases[node.id].inputs[input.name] = outputValue;
  }
}
  
function createExecutionEnvironment(
  node: AppNode,
  env: Environment,
  log: LogCollector,
): ExecutionEnvironment<any> {
  return {
    log,
    getInput: (name: string) => env.phases[node.id].inputs[name], 
    getBrowser: () => env.browser,
    getPage: () => env.page,
    setBrowser: (browser: Browser) => env.browser = browser,
    setPage: (page: Page) => env.page = page,
    setOutput: (name: string, value: string) => env.phases[node.id].outputs[name] = value,
  }
}

async function cleanUpEnvironment(env: Environment) {
  if (env.browser) {
    await env.browser
      .close()
      .catch((error) => console.log("🔴 Cannot close browser, reason", error));
  }
}

async function decrementCredits(
  userId: string,
  amount: number,
  log: LogCollector,
) {
  try {
    await db.userBalance.update({
      where: {
        userId,
        credits: {
          gte: amount,
        },
      },
      data: { 
        credits: {
          decrement: amount,
        }
      },
    });

    return true;
  } catch {
    log.error("Insufficient balance");
    return false;
  }
}