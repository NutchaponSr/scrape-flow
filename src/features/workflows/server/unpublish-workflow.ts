"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { WorkflowStatus } from "../types";
import { revalidatePath } from "next/cache";

export const UnpublishWorkflow = async (id: string) => {
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

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not pubished");
  }

  await db.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  revalidatePath(`/workflows/editor/${id}`);
}