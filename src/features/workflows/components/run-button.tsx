"use client";

import { toast } from "sonner";
import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useRunWorkflow } from "@/features/workflows/api/use-run-workflow";

interface RunButtonProps {
  workflowId: string;
}

export const RunButton = ({ workflowId }: RunButtonProps) => {
  const { mutate, isPending } = useRunWorkflow(workflowId);

  return (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
      disabled={isPending}
      onClick={() => {
        toast.loading("Scheduling run...", { id: workflowId });
        mutate({ workflowId });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
}