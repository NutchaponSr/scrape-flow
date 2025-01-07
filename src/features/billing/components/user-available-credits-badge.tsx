"use client";

import Link from "next/link";

import {
  CoinsIcon, 
  Loader2Icon 
} from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";

import { CountUpWrapper } from "@/components/count-up-wrapper";

import { useGetAvailableCredits } from "@/features/billing/api/use-get-available-credits";

export const UserAvailableCreditsBadge = () => {
  const { data: credits, isLoading } = useGetAvailableCredits();

  return (
    <Link href="/billing" className={cn(
      "w-full space-x-2 items-center",
      buttonVariants({
        variant: "outline",
      })
    )}>
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {isLoading && <Loader2Icon className="size-4 animate-spin" />}
        {!isLoading && credits && <CountUpWrapper value={credits} />}
        {!isLoading && credits === undefined && "-"}
      </span>
    </Link>
  );
}