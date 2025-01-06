import "server-only";

import { Browser, Page } from "puppeteer";
import { revalidatePath } from "next/cache";
import { ExecutionPhase } from "@prisma/client";

import { db } from "@/lib/db";

import { 
  ExecutionPhaseStatus, 
  WorkflowExecutionStatus 
} from "@/features/workflows/types";
import { 
  Environment, 
  ExecutionEnvironment 
} from "@/features/executor/types";
import { AppNode } from "@/features/node/types";
import { TaskParamType } from "@/features/tasks/types";
import { TaskRegistry } from "@/features/tasks/registry";
import { ExecutorRegistry } from "@/features/executor/registry";
import { Edge } from "@xyflow/react";

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
  

  const creditConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: Consume credits
    const phaseExecution = await executeWorkflowPhase(phase, env, edges);

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

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  env: Environment,
  edges: Edge[],
) {
  const startedAt = new Date();
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

  console.log("🪙 CREDITS", creditsRequired);

  // TODO: Decrement user balance (with required credits)

  const success = await executePhase(phase, node, env);
  const outputs = env.phases[node.id].outputs;

  await finalizePhase(phase.id, success, outputs);
  
  return { success };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: Record<string, string>,
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
      outputs: JSON.stringify(outputs),
    }
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  env: Environment,
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];

  if (!runFn) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, env);

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): ExecutionEnvironment<any> {
  return {
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