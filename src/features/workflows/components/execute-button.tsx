"use client";

import { PlayIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

import { Button } from "@/components/ui/button";

import { useRunWorkflow } from "@/features/workflows/api/use-run-workflow";
import { useExecutionPlan } from "@/features/workflows/hooks/use-execution-plan";

interface ExecuteButtonProps {
  workflowId: string;
}

export const ExecuteButton = ({ workflowId }:  ExecuteButtonProps) => {
  const generate = useExecutionPlan();

  const { toObject } = useReactFlow();
  const { mutate, isPending } = useRunWorkflow(workflowId);

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => {
        const plan = generate();
        
        // Client side validation
        if (!plan) return;

        mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon className="stroke-orange-400" />
      Execute
    </Button>
  );
}