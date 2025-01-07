"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const GetAvailableCredits = async () => { 
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const balance = await db.userBalance.findUnique({
    where: {
      userId,
    },
  });

  if (!balance) return -1;

  return balance.credits;
}