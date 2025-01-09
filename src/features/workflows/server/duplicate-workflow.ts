"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

import { 
  DuplicateWorkflowSchema, 
  DuplicateWorkflow as DuplicateWorkflowType 
} from "@/features/workflows/schemas/duplicate";
import { WorkflowStatus } from "@/features/workflows/types";

export const DuplicateWorkflow = async (flow: DuplicateWorkflowType) => {
  const validatedFields = DuplicateWorkflowSchema.safeParse(flow);

  if (!validatedFields.success) {
    throw new Error("Invalid form data");
  }

  const { workflowId, name, description } = validatedFields.data;

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const sourceWorkflow = await db.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  if (!sourceWorkflow) {
    throw new Error("Workflow not found");
  }

  const result = await db.workflow.create({
    data: {
      userId,
      name,
      description,
      status: WorkflowStatus.DRAFT,
      definition: sourceWorkflow.definition,
    },
  });

  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  revalidatePath("/workflows");
}