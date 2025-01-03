"use client";

import { toast } from "sonner";
import { CheckIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

import { Button } from "@/components/ui/button";

import { useUpdateWorkflow } from "@/features/workflows/api/use-update-workflow";

interface SaveButtonProps {
  workflowId: string;
}

export const SaveButton = ({ workflowId }: SaveButtonProps) => {
  const { toObject } = useReactFlow();
  const { mutate, isPending } = useUpdateWorkflow();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());

        toast.loading("Saving workflow...", { id: "save-workflow" });
        mutate({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}