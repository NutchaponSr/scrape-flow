"use client";

import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useExecutionPlan } from "@/features/workflows/hooks/use-execution-plan";

interface ExecuteButtonProps {
  workflowId: string;
}

export const ExecuteButton = ({ workflowId }:  ExecuteButtonProps) => {
  const generate = useExecutionPlan();

  return (
    <Button
      variant="outline"
      onClick={() => {
        const plan = generate();
        console.log("---- Plan ----");
        console.table(plan);
      }}
    >
      <PlayIcon className="stroke-orange-400" />
      Execute
    </Button>
  );
}