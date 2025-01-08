"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

import { WorkflowStatus } from "@/features/workflows/types";
import { calculatorWorkflowCost, FlowToExecutionPlan } from "@/features/workflows/utils";
import { revalidatePath } from "next/cache";

export const PublishWorkflow = async ({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not a draft");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("Flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }

  const creditsCost = calculatorWorkflowCost(flow.nodes);

  await db.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      creditsCost,
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      status: WorkflowStatus.PUBLISHED,
    },
  });

  revalidatePath(`/workflows/editor/${id}`);
}