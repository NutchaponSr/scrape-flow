import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query"

import { deleteWorkflow } from "@/features/workflows/server/delete-workflow";

export const useDeleteWorkflow = (id: string) => {
  const mutation = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id });
    },
    onError: () => {
      toast.error("Failed to delete workflow", { id });
    },
  });

  return mutation;
}