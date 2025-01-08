import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { RunWorkflow } from "@/features/workflows/server/run-workflow";

export const useRunWorkflow = (id: string) => {
  const mutate = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution started", { id });
    },
    onError: () => {
      toast.error("Something went wrong", { id });
    },
  });

  return mutate;
}