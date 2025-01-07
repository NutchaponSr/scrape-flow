"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const GetWorkflowExecutions = async (workflowId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return await db.workflowExecution.findMany({
    where: {
      workflowId,
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}