import { Edge } from "@xyflow/react";

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
        // Node 
      }
    }
  }

  return { executionPlan };
}