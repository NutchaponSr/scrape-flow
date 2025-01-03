"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

import { WorkflowStatus } from "@/features/workflows/types";

export const UpdateWorkflow = async ({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id,
      userId,
    }
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not a draft");
  }

  await db.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      definition,
    },
  })
}