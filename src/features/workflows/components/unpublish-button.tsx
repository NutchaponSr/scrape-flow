import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useUnpublishWorkflow } from "@/features/workflows/api/use-unpublish-workflow";

interface PublishButtonProps {
  workflowId: string;
}

export const UnpublishButton = ({ workflowId }: PublishButtonProps) => {
  const { mutate, isPending } = useUnpublishWorkflow(workflowId);

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: workflowId });
        mutate(workflowId)
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-400" />
      Unpublish
    </Button>
  );
}