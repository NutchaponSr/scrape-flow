"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const GetUserWorkflows = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return await db.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}