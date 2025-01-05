"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const GetWorkflowExecutionWithPhases = async (executionId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return await db.workflowExecution.findUnique({
    where: {
      userId,
      id: executionId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}