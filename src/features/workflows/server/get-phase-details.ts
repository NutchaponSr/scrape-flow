"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const GetWorkflowPhaseDetails = async (phaseId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return await db.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: "asc",
        },
      },
    },
  });
}