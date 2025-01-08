import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";

import { Button } from "@/components/ui/button";

import { useExecutionPlan } from "@/features/workflows/hooks/use-execution-plan";
import { usePublishWorkflow } from "@/features/workflows/api/use-publish-workflow";

interface PublishButtonProps {
  workflowId: string;
}

export const PublishButton = ({ workflowId }: PublishButtonProps) => {
  const generate = useExecutionPlan();
  
  const { toObject } = useReactFlow();
  const { mutate, isPending } = usePublishWorkflow(workflowId);

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={isPending}
      onClick={() => {
        const plan = generate();

        if (!plan) return;

        toast.loading("Publishing workflow...", { id: workflowId });
        mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        })
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
}