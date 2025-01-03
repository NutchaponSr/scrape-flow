import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query"

import { UpdateWorkflow } from "../server/update-workflow";

export const useUpdateWorkflow = () => {
  const mutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Failed to update workflow", { id: "save-workflow" });
    },
  });

  return mutation;
}