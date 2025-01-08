"use server";

import parser from "cron-parser";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export const UpdateWorkflowCron = async ({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const interval = parser.parseExpression(cron, { utc: true })
    
    await db.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error) {
    console.error("🔴 Invalid cron:", error);
    throw new Error("Invalid cron expression");
  }

  revalidatePath("/workflows");
}