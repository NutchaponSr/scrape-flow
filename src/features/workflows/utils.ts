import { Edge } from "@xyflow/react";

import { 
  AppNodeMissingInputs,
  FlowToExecutionPlanType, 
  FlowToExecutionPlanValidationError, 
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/features/workflows/types";
import { AppNode } from "@/features/node/types";
import { TaskRegistry } from "@/features/tasks/registry";

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[],
): FlowToExecutionPlanType {
  const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint);

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUT,
      },
    }
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);

  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }
  
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already put in the execution plan
        continue;
      }

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);

        if (incomers.every((incomers) => planned.has(incomers.id))) {
          // If all incomers/edges are planned and there are still invalid inputs
          // This means that this particular node has an invalid input
          // Which means that the workflow is invalid
          if (invalidInputs.length > 0) {
            inputsWithErrors.push({
              nodeId: currentNode.id,
              inputs: invalidInputs,
            });
          }
        } else {
          // Let's skip this node for now
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUT,
        invalidElements: inputsWithErrors,
      },
    }
  }

  return { executionPlan };
}

export function getInvalidInputs(
  node: AppNode,
  edges: Edge[],
  planned: Set<string>,
) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;  

    if (inputValueProvided) {
      // This input is fine, so we can move on
      continue;
    }

    // If a value is not provided by the user then we need to check
    // If there is an output linked to the current input
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name);
    const requiredInputProvidedByVisitedOutput = 
      input.required && 
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // The inputs is required and we have a valid value for it
      // Provided by a task that is already planned
      continue;
    } else if (!input.required) {
      // If the input is not required but there is an output linked to it
      // Then we need to be sure that the output is already planned
      if (!inputLinkedToOutput) continue;
      if (inputLinkedToOutput &&  planned.has(inputLinkedToOutput.source)) {
        // The output is providing a value to the input: the input is fine
        continue;
      }
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}

export function getIncomers(
  node: AppNode,
  nodes: AppNode[],
  edges: Edge[],
) {
  if (!node.id) return [];

  const incomersIds = new Set();

  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });

  return nodes.filter((node) => incomersIds.has(node.id));
} 

export function calculatorWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}

export function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(`/api/workflows/execute?workflowId=${workflowId}`);

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET!}`
    },
    cache: "no-store",
    // signal: AbortSignal.timeout(5000),
  }).catch((error) => (
    console.error("🔴 Error triggering workflow with id", workflowId, ":error", error.message)
  ));
}

export function getAppUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return `${appUrl}/${path}`
}