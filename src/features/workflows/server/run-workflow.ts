"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

import { 
  ExecutionPhaseStatus, 
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/features/workflows/types";
import { TaskRegistry } from "@/features/tasks/registry";
import { FlowToExecutionPlan } from "@/features/workflows/utils";
import { ExecutionWorkflow } from "@/features/workflows/lib/execute";

export const RunWorkflow = async (form: {
  workflowId: string;
  flowDefinition: string;
}) => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unathenticated");
  }

  const { workflowId, flowDefinition } = form;

  if (!workflowId) {
    throw new Error("Workflow ID is required");
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (!flowDefinition) {
    throw new Error("Flow definition is not defined");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("No execution plan generated");
  }

  
  const executionPlan = result.executionPlan;
  
  if (!executionPlan) {
    throw new Error("No execution plan generated");
  }

  const execution = await db.workflowExecution.create({
    data: {
      userId,
      workflowId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: flowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });


  if (!execution) {
    throw new Error("Workflow execution not created");
  }

  ExecutionWorkflow(execution.id);  
  redirect(`/workflows/runs/${workflowId}/${execution.id}`);
}