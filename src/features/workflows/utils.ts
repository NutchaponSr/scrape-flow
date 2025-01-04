import { 
  Edge, 
  getIncomers 
} from "@xyflow/react";

import { 
  FlowToExecutionPlanType, 
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
    throw new Error("TODO: HANDLE THIS ERROR");
  }

  const planned = new Set<string>();
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  for (
    let phase = 2;
    phase <= nodes.length || planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already put in the execution plan
        continue;
      }

      const invalidInputs = [];
      const inputs = TaskRegistry[currentNode.data.type].inputs;

      for (const input of inputs) {
        const inputValue = currentNode.data.inputs[input.name];
        const inputValueProvided = inputValue?.length > 0;  

        if (inputValueProvided) {
          // This input is fine, so we can move on
          continue;
        }

        // If a value is not provided by the user then we need to check
        // If there is an output linked to the current input
        const incomingEdges = edges.filter((edge) => edge.target === currentNode.id);
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
      
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);

        if (incomers.every((incomers) => planned.has(incomers.id))) {
          // If all incomers/edges are planned and there are still invalid inputs
          // This means that this particular node has an invalid input
          // Which means that the workflow is invalid
          throw new Error("TODO: HANDLE ERROR 1");
        } else {
          // Let's skip this node for now
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
      planned.add(currentNode.id);
    }
  }

  return { executionPlan };
}
