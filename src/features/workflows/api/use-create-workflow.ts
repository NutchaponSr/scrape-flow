import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { CreateWorkflow } from "@/features/workflows/server/create-workflow";

export const useCreateWorkflow = () => {
  const mutation = useMutation({
    mutationFn: CreateWorkflow,
    onSuccess: () => {
      toast.success("Workflow created successfully", { id: "create-workflow" });
      
    },
    onError: () => {
      toast.error("Failed to create workflow", { id: "create-workflow" });
    },
  });

  return mutation;
}