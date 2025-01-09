import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { DuplicateWorkflow } from "@/features/workflows/server/duplicate-workflow";

export const useDuplicateWorkflow = () => {
  const mutation = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated", { id: "duplicate-workflow" });
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  return mutation;
}