"use server";

import { Edge } from "@xyflow/react";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

import { 
  CreateWorkflowSchema, 
  CreateWorkflow as CreateWorkflowType 
} from "@/features/workflows/schemas/create";

import { AppNode } from "@/features/node/types";
import { WorkflowStatus } from "@/features/workflows/types";

export const CreateWorkflow = async (value: CreateWorkflowType) => {
  const validatedValue = CreateWorkflowSchema.safeParse(value);

  if (!validatedValue.success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const initialFlow: {
    nodes: AppNode[];
    edges: Edge[];
  } = {
    nodes: [],
    edges: [],
  }

  // let's add the flow entry point
  // initialFlow.nodes.push(CreateWorkflowNode(TaskType.LAUNCH_BROWSER))

  const workflow = await db.workflow.create({
    data: {
      ...validatedValue.data,
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
    },
  });

  if (!workflow) {
    throw new Error("Failed to create workflow");
  }

  return workflow
}